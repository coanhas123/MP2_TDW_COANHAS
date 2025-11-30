// apiComparison.mjs - Compare Perenual vs Trefle API responses
// Run with: node tests/apiComparison.mjs

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// =============================================================================
// CONFIGURATION
// =============================================================================

const PERENUAL_KEY = process.env.VITE_PERENUAL_KEY;
const TREFLE_KEY = process.env.VITE_TREFLE_KEY;

const PERENUAL_BASE = 'https://perenual.com/api';
const TREFLE_BASE = 'https://trefle.io/api/v1';

// How many items to fetch per API for comparison
const ITEMS_PER_PAGE = 30;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function log(message) {
  console.log(`[TEST] ${message}`);
}

function separator() {
  console.log('\n' + '='.repeat(60) + '\n');
}

// =============================================================================
// PERENUAL API
// =============================================================================

async function fetchPerenualPlants(page = 1) {
  if (!PERENUAL_KEY) {
    throw new Error('VITE_PERENUAL_KEY not found in .env');
  }

  const url = new URL(`${PERENUAL_BASE}/species-list`);
  url.searchParams.set('key', PERENUAL_KEY);
  url.searchParams.set('page', page);

  log(`Fetching Perenual: ${url.toString().replace(PERENUAL_KEY, '***')}`);

  const res = await fetch(url);
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Perenual API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  
  // Normalize response
  const plants = (data.data || []).map(plant => ({
    id: plant.id,
    common_name: plant.common_name || null,
    scientific_name: plant.scientific_name || null,
    image: plant.default_image?.medium_url || plant.default_image?.original_url || null,
    cycle: plant.cycle || null,
    watering: plant.watering || null,
    sunlight: plant.sunlight || null,
  }));

  return {
    total: data.total || plants.length,
    page: data.current_page || page,
    lastPage: data.last_page || 1,
    perPage: data.per_page || plants.length,
    plants,
  };
}

// =============================================================================
// TREFLE API
// =============================================================================

async function fetchTreflePlants(page = 1) {
  if (!TREFLE_KEY) {
    throw new Error('VITE_TREFLE_KEY not found in .env');
  }

  const url = new URL(`${TREFLE_BASE}/species`);
  url.searchParams.set('token', TREFLE_KEY);
  url.searchParams.set('page', page);

  log(`Fetching Trefle: ${url.toString().replace(TREFLE_KEY, '***')}`);

  const res = await fetch(url);
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trefle API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  
  // Normalize response
  const plants = (data.data || []).map(plant => ({
    id: plant.id,
    common_name: plant.common_name || null,
    scientific_name: plant.scientific_name || null,
    image: plant.image_url || null,
    family: plant.family || null,
    genus: plant.genus || null,
  }));

  return {
    total: data.meta?.total || plants.length,
    page: data.links?.self?.match(/page=(\d+)/)?.[1] || page,
    plants,
  };
}

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

function analyzeResults(plants, apiName) {
  const withImages = plants.filter(p => p.image);
  const withCommonName = plants.filter(p => p.common_name);
  const withScientificName = plants.filter(p => p.scientific_name);
  
  // Try to identify flowers/trees by common name keywords
  const flowerKeywords = ['flower', 'rose', 'lily', 'daisy', 'tulip', 'orchid', 'sunflower', 'lavender', 'hibiscus', 'peony', 'bloom'];
  const treeKeywords = ['tree', 'oak', 'pine', 'maple', 'birch', 'willow', 'cedar', 'spruce', 'elm', 'ash'];
  
  const flowers = plants.filter(p => {
    const name = (p.common_name || '').toLowerCase();
    return flowerKeywords.some(kw => name.includes(kw));
  });
  
  const trees = plants.filter(p => {
    const name = (p.common_name || '').toLowerCase();
    return treeKeywords.some(kw => name.includes(kw));
  });

  return {
    apiName,
    total: plants.length,
    withImages: withImages.length,
    withCommonName: withCommonName.length,
    withScientificName: withScientificName.length,
    flowers: flowers.length,
    trees: trees.length,
    sampleWithImages: withImages.slice(0, 5).map(p => ({
      name: p.common_name || p.scientific_name,
      image: p.image?.substring(0, 50) + '...'
    })),
  };
}

function printAnalysis(analysis) {
  console.log(`\n📊 ${analysis.apiName} Results:`);
  console.log(`   Total plants fetched: ${analysis.total}`);
  console.log(`   With images: ${analysis.withImages} (${((analysis.withImages / analysis.total) * 100).toFixed(1)}%)`);
  console.log(`   With common name: ${analysis.withCommonName} (${((analysis.withCommonName / analysis.total) * 100).toFixed(1)}%)`);
  console.log(`   With scientific name: ${analysis.withScientificName} (${((analysis.withScientificName / analysis.total) * 100).toFixed(1)}%)`);
  console.log(`   Identified as flowers: ${analysis.flowers}`);
  console.log(`   Identified as trees: ${analysis.trees}`);
  
  if (analysis.sampleWithImages.length > 0) {
    console.log(`\n   Sample plants with images:`);
    analysis.sampleWithImages.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
    });
  }
}

// =============================================================================
// MAIN COMPARISON
// =============================================================================

async function runComparison() {
  console.log('\n🌿 API Comparison Test: Perenual vs Trefle\n');
  console.log('This test fetches plants from both APIs and compares:');
  console.log('- Total available plants');
  console.log('- Plants with images');
  console.log('- Data completeness (common names, scientific names)');
  console.log('- Flower/tree identification');
  
  separator();

  let perenualResult = null;
  let trefleResult = null;

  // Test Perenual API
  try {
    log('Testing Perenual API...');
    const perenualData = await fetchPerenualPlants(1);
    log(`Perenual reports ${perenualData.total} total plants in database`);
    perenualResult = analyzeResults(perenualData.plants, 'PERENUAL');
    perenualResult.reportedTotal = perenualData.total;
  } catch (err) {
    console.error(`❌ Perenual API Error: ${err.message}`);
  }

  separator();

  // Test Trefle API
  try {
    log('Testing Trefle API...');
    const trefleData = await fetchTreflePlants(1);
    log(`Trefle reports ${trefleData.total} total plants in database`);
    trefleResult = analyzeResults(trefleData.plants, 'TREFLE');
    trefleResult.reportedTotal = trefleData.total;
  } catch (err) {
    console.error(`❌ Trefle API Error: ${err.message}`);
  }

  separator();

  // Print results
  console.log('📈 COMPARISON RESULTS');
  
  if (perenualResult) {
    printAnalysis(perenualResult);
    console.log(`   📦 Total plants in database: ${perenualResult.reportedTotal?.toLocaleString() || 'Unknown'}`);
  }
  
  if (trefleResult) {
    printAnalysis(trefleResult);
    console.log(`   📦 Total plants in database: ${trefleResult.reportedTotal?.toLocaleString() || 'Unknown'}`);
  }

  separator();

  // Summary
  console.log('🏆 SUMMARY\n');
  
  if (perenualResult && trefleResult) {
    const perenualImageRate = (perenualResult.withImages / perenualResult.total) * 100;
    const trefleImageRate = (trefleResult.withImages / trefleResult.total) * 100;
    
    console.log('Database Size:');
    if (perenualResult.reportedTotal > trefleResult.reportedTotal) {
      console.log(`   ✅ Perenual has more plants (${perenualResult.reportedTotal?.toLocaleString()} vs ${trefleResult.reportedTotal?.toLocaleString()})`);
    } else if (trefleResult.reportedTotal > perenualResult.reportedTotal) {
      console.log(`   ✅ Trefle has more plants (${trefleResult.reportedTotal?.toLocaleString()} vs ${perenualResult.reportedTotal?.toLocaleString()})`);
    } else {
      console.log(`   ⚖️ Both have similar database sizes`);
    }
    
    console.log('\nImage Availability:');
    if (perenualImageRate > trefleImageRate) {
      console.log(`   ✅ Perenual has better image coverage (${perenualImageRate.toFixed(1)}% vs ${trefleImageRate.toFixed(1)}%)`);
    } else if (trefleImageRate > perenualImageRate) {
      console.log(`   ✅ Trefle has better image coverage (${trefleImageRate.toFixed(1)}% vs ${perenualImageRate.toFixed(1)}%)`);
    } else {
      console.log(`   ⚖️ Both have similar image coverage`);
    }
    
    console.log('\nFlowers & Trees (from sample):');
    console.log(`   Perenual: ${perenualResult.flowers} flowers, ${perenualResult.trees} trees`);
    console.log(`   Trefle: ${trefleResult.flowers} flowers, ${trefleResult.trees} trees`);
  } else {
    console.log('⚠️ Could not compare - one or both APIs failed');
  }

  separator();
  console.log('Test completed.\n');
}

// Run the comparison
runComparison().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});


