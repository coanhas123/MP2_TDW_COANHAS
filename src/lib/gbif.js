// Através desta API é possivel obter informações detalhadas sobre as espécies de plantas: daqui retirei os	nomes vernaculares adicionais, as descrições das espécies, o status de conservação (IUCN), a contagem de ocorrências, as imagens adicionais e por fim as informação taxonómica completa


const GBIF_BASE = 'https://api.gbif.org/v1';
const CACHE_TTL = 1000 * 60 * 60 * 24; 

// Cache functions
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

// procurar por especies pelo nome cientifico

export async function searchSpeciesByName(scientificName) {
  if (!scientificName) return null;

  const cacheKey = `gbif_species_${scientificName.toLowerCase().replace(/\s+/g, '_')}`;
  
  // Check cache first
  const cached = readCache(cacheKey);
  if (cached) {
    console.log(`[GBIF] Cache hit for species: ${scientificName}`);
    return cached;
  }

  try {
    const url = `${GBIF_BASE}/species/search?` + new URLSearchParams({
      q: scientificName,
      limit: '5',
      datasetKey: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c', // GBIF Backbone Taxonomy
    });

    console.log(`[GBIF] Searching for species: ${scientificName}`);
    
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`[GBIF] API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const results = data.results || [];
    
    if (results.length === 0) {
      console.log(`[GBIF] No results found for: ${scientificName}`);
      return null;
    }

    // Procura o melhor match (normalmente o primeiro, mas verifica se o nome cientifico é exatamente o mesmo)
    const exactMatch = results.find(r => 
      r.scientificName?.toLowerCase() === scientificName.toLowerCase() ||
      r.canonicalName?.toLowerCase() === scientificName.toLowerCase()
    );
    
    const species = exactMatch || results[0];
    
    console.log(`[GBIF] Found species: ${species.canonicalName || species.scientificName}`);

    writeCache(cacheKey, species);

    return species;
  } catch (err) {
    console.error('[GBIF] Exception in searchSpeciesByName:', err);
    return null;
  }
}

// Informação especifica sobre a espécie
export async function getSpeciesDetails(speciesKey) {
  if (!speciesKey) return null;

  const cacheKey = `gbif_details_${speciesKey}`;
  
  const cached = readCache(cacheKey);
  if (cached) {
    console.log(`[GBIF] Cache hit for species key: ${speciesKey}`);
    return cached;
  }

  try {
    // recolhe informação sobre a especie
    const detailsUrl = `${GBIF_BASE}/species/${speciesKey}`;
    const detailsRes = await fetch(detailsUrl);
    
    if (!detailsRes.ok) {
      return null;
    }

    const details = await detailsRes.json();

    // recolhe descrição da especie
    const descriptionsUrl = `${GBIF_BASE}/species/${speciesKey}/descriptions`;
    let descriptions = [];
    try {
      const descRes = await fetch(descriptionsUrl);
      if (descRes.ok) {
        const descData = await descRes.json();
        descriptions = descData.results || [];
      }
    } catch (e) {
      console.warn('[GBIF] Error fetching descriptions:', e);
    }

    // procura imagens
    const mediaUrl = `${GBIF_BASE}/species/${speciesKey}/media`;
    let media = [];
    try {
      const mediaRes = await fetch(mediaUrl);
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        media = mediaData.results || [];
      }
    } catch (e) {
      console.warn('[GBIF] Error fetching media:', e);
    }

    // procura ocorrencias 
    const occurrencesUrl = `${GBIF_BASE}/occurrence/count?taxonKey=${speciesKey}`;
    let occurrenceCount = null;
    try {
      const occRes = await fetch(occurrencesUrl);
      if (occRes.ok) {
        const count = await occRes.json();
        // garante que tens sempre um número e nunca um elemento 0
        occurrenceCount = typeof count === 'number' ? count : null;
      }
    } catch (e) {
      console.warn('[GBIF] Error fetching occurrences:', e);
      occurrenceCount = null;
    }

    const enrichedDetails = {
      ...details,
      descriptions: descriptions.filter(d => d.type === 'DESCRIPTION').map(d => ({
        description: d.description,
        source: d.source,
        language: d.language,
      })),
      media: media.map(m => ({
        type: m.type,
        url: m.identifier,
        source: m.publisher,
      })),
      occurrenceCount: occurrenceCount,
    };
    writeCache(cacheKey, enrichedDetails);

    return enrichedDetails;
  } catch (err) {
    console.error('[GBIF] Exception in getSpeciesDetails:', err);
    return null;
  }
}

// enriquece a informação através da data do GBIF

export async function enrichFlowerWithGBIF(flower) {
  if (!flower || !flower.scientific_name) {
    return null;
  }

  try {
    // procura especies
    const species = await searchSpeciesByName(flower.scientific_name);
    
    if (!species || !species.key) {
      return null;
    }

    // recolhe informação detalhada
    const details = await getSpeciesDetails(species.key);
    
    if (!details) {
      return {
        speciesKey: species.key,
        canonicalName: species.canonicalName,
        scientificName: species.scientificName,
        kingdom: species.kingdom,
        phylum: species.phylum,
        class: species.className,
        order: species.order,
        family: species.family,
        genus: species.genus,
        species: species.species,
        rank: species.rank,
        status: species.status,
        taxonomicStatus: species.taxonomicStatus,
      };
    }

    // combina toda a informação
    return {
      speciesKey: details.key,
      canonicalName: details.canonicalName,
      scientificName: details.scientificName,
      kingdom: details.kingdom,
      phylum: details.phylum,
      class: details.className,
      order: details.order,
      family: details.family,
      genus: details.genus,
      species: details.species,
      rank: details.rank,
      status: details.status,
      taxonomicStatus: details.taxonomicStatus,
      year: details.year,
      authors: details.authorship,
      descriptions: details.descriptions || [],
      media: details.media || [],
      occurrenceCount: details.occurrenceCount,
      higherClassification: details.higherClassification,
      habitats: details.habitats || [],
      threatStatus: details.threatStatuses || [],
      vernacularNames: details.vernacularNames || [],
    };
  } catch (err) {
    console.error('[GBIF] Error enriching flower data:', err);
    return null;
  }
}

