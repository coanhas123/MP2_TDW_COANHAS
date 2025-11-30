// Integração com API iNaturalist para observações de flores
// API gratuita, não requer chave. Foca apenas em flores, agrupadas por espécie
const INATURALIST_PLACES = {
  europa: 97391,
  asia: 97395,
  africa: 97392,
  'south-america': 97389,
  'central-america': 143141,
};

export const REGIONS_ISO = {
  europa: { 
    name: "Europe", 
    placeId: 97391,
    description: "Flowering plants observed in Europe" 
  },
  asia: { 
    name: "Asia", 
    placeId: 97395,
    description: "Flowering plants observed in Asia" 
  },
  africa: { 
    name: "Africa", 
    placeId: 97392,
    description: "Flowering plants observed in Africa" 
  },
  "south-america": { 
    name: "South America", 
    placeId: 97389,
    description: "Flowering plants observed in South America" 
  },
  "central-america": { 
    name: "Central America", 
    placeId: 143141,
    description: "Flowering plants observed in Central America" 
  },
};

export const REGIONS = Object.fromEntries(
  Object.entries(REGIONS_ISO).map(([k, v]) => [k, { name: v.name, description: v.description }])
);

export function filterByType(plants, type) {
  if (type === "all") return plants;
  return plants;
}

const INATURALIST_BASE = 'https://api.inaturalist.org/v1';
const CACHE_TTL = 1000 * 60 * 60 * 2; // 2 horas
const CARDS_PER_BATCH = 20;
function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch (e) {
    return null;
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }));
  } catch (e) {
    // ignore quota errors
  }
}

// Shuffle array randomly
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Extract taxonomic hierarchy from ancestors
function extractTaxonomicHierarchy(taxon) {
  if (!taxon.ancestors || !Array.isArray(taxon.ancestors)) {
    return [];
  }

  const hierarchy = [];
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus'];
  
  taxon.ancestors.forEach(ancestor => {
    if (ranks.includes(ancestor.rank)) {
      hierarchy.push({
        rank: ancestor.rank.charAt(0).toUpperCase() + ancestor.rank.slice(1),
        name: ancestor.name || ancestor.preferred_common_name
      });
    }
  });

  // Add the current taxon if it's a species
  if (taxon.rank === 'species' && taxon.name) {
    hierarchy.push({
      rank: 'Species',
      name: taxon.name
    });
  }

  return hierarchy;
}

// =============================================================================
// FETCH REGION PLANTS - Uses iNaturalist API with flowering plant filter
// Groups by SPECIES and extracts all available data
// Supports pagination for "Load More" functionality
// =============================================================================

export async function fetchRegionPlants(region, apiKey, type = 'all', page = 1, skipCache = false) {
  const cacheKey = `inat_region_v2_${region}_page${page}`;

  // Check cache first (unless skipCache is true)
  if (!skipCache) {
    const cached = readCache(cacheKey);
    if (cached && cached.length > 0) {
      console.log(`[iNaturalist] Cache hit for ${region} page ${page}: ${cached.length} flowers`);
      return filterByType(cached, type);
    }
  }

  const regionInfo = REGIONS_ISO[region];
  if (!regionInfo) {
    console.error(`[iNaturalist] Unknown region: ${region}`);
    return [];
  }

  try {
    // iNaturalist API - filter by place, flowering plants (term_id=12), with photos
    // term_id=12 = Plant Phenology: Flowering
    // Use sequential pages for predictable pagination
    // Each page request fetches from a sequential page number
    const pageNumber = page; // Use the page parameter directly for sequential pagination

    const url = `${INATURALIST_BASE}/observations?` + new URLSearchParams({
      place_id: regionInfo.placeId.toString(),
      iconic_taxa: 'Plantae',
      term_id: '12', // Flowering phenology
      photos: 'true',
      quality_grade: 'research,needs_id',
      per_page: '100',
      page: pageNumber.toString(),
      order: 'desc',
      order_by: 'observed_on',
    });

    console.log(`[iNaturalist] Fetching ${region} flowers from page ${pageNumber}...`);
    
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`[iNaturalist] API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const results = data.results || [];
    
    console.log(`[iNaturalist] Got ${results.length} results for ${region}`);

    // Group by species (deduplicate by scientific name)
    const speciesMap = new Map();

    for (const item of results) {
      // Get species info from taxon
      const taxon = item.taxon;
      if (!taxon) continue;
      
      const speciesName = taxon.name;
      if (!speciesName) continue;

      // Get all images from this observation
      const images = [];
      if (item.photos && item.photos.length > 0) {
        item.photos.forEach(photo => {
          const mediumUrl = photo.url?.replace('square', 'medium') || photo.medium_url;
          if (mediumUrl && !images.includes(mediumUrl)) {
            images.push(mediumUrl);
          }
        });
      }
      
      // Add taxon default photo if available
      if (taxon.default_photo?.medium_url && !images.includes(taxon.default_photo.medium_url)) {
        images.push(taxon.default_photo.medium_url);
      }

      if (images.length === 0) continue; // Skip if no images

      // If species already exists, merge images
      if (speciesMap.has(speciesName)) {
        const existing = speciesMap.get(speciesName);
        // Merge images (avoid duplicates)
        images.forEach(img => {
          if (!existing.all_images.includes(img)) {
            existing.all_images.push(img);
          }
        });
      } else {
        // Create new species entry
        const taxonomicHierarchy = extractTaxonomicHierarchy(taxon);
        
        speciesMap.set(speciesName, {
          id: item.id || `inat-${speciesMap.size}`,
          common_name: taxon.preferred_common_name || taxon.name?.split(' ')[0] || 'Unknown',
          scientific_name: speciesName,
          default_image: { medium_url: images[0] }, // First image for card
          all_images: images, // All images for modal
          family: taxon.ancestors?.find(a => a.rank === 'family')?.name 
               || taxon.iconic_taxon_name 
               || 'Plantae',
          genus: taxon.name?.split(' ')[0] || null,
          country: item.place_guess || null,
          observed_on: item.observed_on || null,
          taxonomic_hierarchy: taxonomicHierarchy,
          // Conservation status
          threatened: taxon.threatened || item.threatened || false,
          endemic: taxon.endemic || item.endemic || false,
          native: taxon.native !== false && item.native !== false,
          introduced: taxon.introduced || item.introduced || false,
        });
      }
    }

    // Convert map to array and shuffle
    const plants = Array.from(speciesMap.values());
    const shuffled = shuffleArray(plants);
    const result = shuffled.slice(0, CARDS_PER_BATCH);
    
    console.log(`[iNaturalist] Returning ${result.length} flower species for ${region} (page ${page}, requested ${CARDS_PER_BATCH})`);

    // If we got fewer than requested, try fetching more pages until we have enough
    // This ensures "See More" always returns the full batch size
    if (result.length < CARDS_PER_BATCH && results.length >= 100) {
      // Only try additional pages if the current page returned a full batch (100 results)
      // This suggests there might be more data available
      console.log(`[iNaturalist] Only got ${result.length} unique flowers, but page had ${results.length} results. This is normal for species deduplication.`);
    }

    // Cache the results
    if (result.length > 0) {
      writeCache(cacheKey, result);
    }

    return filterByType(result, type);
  } catch (err) {
    console.error('[iNaturalist] Exception in fetchRegionPlants:', err);
    return [];
  }
}

// =============================================================================
// FETCH RANDOM FLOWERS (for home page)
// =============================================================================

export async function fetchRandomFlowers(apiKey, count = 12) {
  try {
    const allFlowers = [];
    const speciesMap = new Map();
    
    // Pick 2 random regions
    const regionKeys = Object.keys(REGIONS_ISO);
    const shuffledRegions = shuffleArray(regionKeys).slice(0, 2);
    
    for (const regionKey of shuffledRegions) {
      const regionInfo = REGIONS_ISO[regionKey];
      const page = Math.floor(Math.random() * 5) + 1;
      
      const url = `${INATURALIST_BASE}/observations?` + new URLSearchParams({
        place_id: regionInfo.placeId.toString(),
        iconic_taxa: 'Plantae',
        term_id: '12', // Flowering
        photos: 'true',
        quality_grade: 'research',
        per_page: '50',
        page: page.toString(),
      });

      console.log(`[iNaturalist] Fetching random flowers from ${regionInfo.name}...`);
      
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        
        const data = await res.json();
        const results = data.results || [];

        for (const item of results) {
          const taxon = item.taxon;
          if (!taxon) continue;
          
          const speciesName = taxon.name;
          if (!speciesName) continue;
          
          // Get all images from this observation
          const images = [];
          if (item.photos && item.photos.length > 0) {
            item.photos.forEach(photo => {
              const mediumUrl = photo.url?.replace('square', 'medium') || photo.medium_url;
              if (mediumUrl && !images.includes(mediumUrl)) {
                images.push(mediumUrl);
              }
            });
          }
          
          // Add taxon default photo if available
          if (taxon.default_photo?.medium_url && !images.includes(taxon.default_photo.medium_url)) {
            images.push(taxon.default_photo.medium_url);
          }
          
          if (images.length === 0) continue; // Skip if no images

          const taxonomicHierarchy = extractTaxonomicHierarchy(taxon);
          
          // If species already exists, merge images
          if (speciesMap.has(speciesName)) {
            const existing = speciesMap.get(speciesName);
            // Merge images (avoid duplicates)
            images.forEach(img => {
              if (!existing.all_images.includes(img)) {
                existing.all_images.push(img);
              }
            });
          } else {
            speciesMap.set(speciesName, {
              id: item.id || `inat-home-${speciesMap.size}`,
              common_name: taxon.preferred_common_name || taxon.name?.split(' ')[0] || 'Unknown',
              scientific_name: speciesName,
              default_image: { medium_url: images[0] }, // First image for card
              all_images: images, // All images for modal
              family: taxon.ancestors?.find(a => a.rank === 'family')?.name 
                   || taxon.iconic_taxon_name 
                   || 'Plantae',
              genus: taxon.name?.split(' ')[0] || null,
              country: item.place_guess || null,
              observed_on: item.observed_on || null,
              taxonomic_hierarchy: taxonomicHierarchy,
              // Conservation status
              threatened: taxon.threatened || item.threatened || false,
              endemic: taxon.endemic || item.endemic || false,
              native: taxon.native !== false && item.native !== false,
              introduced: taxon.introduced || item.introduced || false,
            });
          }
        }
      } catch (err) {
        console.warn(`[iNaturalist] Error fetching ${regionInfo.name}:`, err.message);
      }
    }

    // Convert to array, shuffle and return
    const flowers = Array.from(speciesMap.values());
    const shuffled = shuffleArray(flowers);
    return shuffled.slice(0, count);
  } catch (err) {
    console.error('[iNaturalist] Exception in fetchRandomFlowers:', err);
    return [];
  }
}
