// plantCare.js - Plant care information based on taxonomic family/genus
// Since APIs don't provide care info directly, we provide general guidelines

// Plant care guidelines by family (general recommendations)
const PLANT_CARE_BY_FAMILY = {
  'Rosaceae': {
    watering: 'Water regularly, keeping soil evenly moist but not waterlogged. Reduce watering in winter.',
    light: 'Prefers full sun to partial shade. At least 6 hours of direct sunlight daily.',
    soil: 'Well-draining soil, rich in organic matter. pH 6.0-7.0.',
    temperature: 'Temperate climates. Most varieties tolerate temperatures from -20°C to 30°C.',
    fertilization: 'Feed monthly during growing season with balanced fertilizer.',
    pruning: 'Prune after flowering to maintain shape and encourage new growth.',
  },
  'Asteraceae': {
    watering: 'Moderate watering. Allow soil to dry slightly between waterings. Avoid overwatering.',
    light: 'Full sun preferred. Most varieties need 6-8 hours of direct sunlight.',
    soil: 'Well-draining soil. Can tolerate various soil types but prefer neutral pH.',
    temperature: 'Hardy perennials. Generally tolerate temperatures from -10°C to 35°C.',
    fertilization: 'Light feeding in spring with balanced fertilizer. Avoid high nitrogen.',
    pruning: 'Deadhead spent flowers to encourage continuous blooming.',
  },
  'Lamiaceae': {
    watering: 'Allow soil to dry between waterings. Drought tolerant once established.',
    light: 'Full sun to partial shade. Prefers bright, sunny locations.',
    soil: 'Well-draining, sandy or loamy soil. Tolerates poor soils.',
    temperature: 'Hardy perennials. Tolerates temperatures from -15°C to 30°C.',
    fertilization: 'Light fertilization. Too much fertilizer reduces fragrance.',
    pruning: 'Trim regularly to maintain compact growth. Cut back in early spring.',
  },
  'Liliaceae': {
    watering: 'Keep soil consistently moist during growing season. Reduce in dormancy.',
    light: 'Full sun to partial shade. Bright, indirect light preferred.',
    soil: 'Well-draining, fertile soil. Rich in organic matter.',
    temperature: 'Temperate to cool climates. Most prefer 15-25°C.',
    fertilization: 'Feed during active growth with balanced fertilizer.',
    pruning: 'Remove dead foliage after it turns yellow naturally.',
  },
  'Orchidaceae': {
    watering: 'Water when growing medium is nearly dry. Avoid waterlogged conditions.',
    light: 'Bright, indirect light. Avoid direct midday sun.',
    soil: 'Special orchid mix (bark, moss, or specialized media). Excellent drainage required.',
    temperature: 'Varies by type. Generally 18-24°C during day, 10-15°C cooler at night.',
    fertilization: 'Weak fertilizer solution weekly during growing season.',
    pruning: 'Cut spent flower spikes. Remove dead or damaged roots.',
  },
  'Papaveraceae': {
    watering: 'Moderate watering. Keep soil moist but well-drained.',
    light: 'Full sun preferred. At least 6 hours of direct sunlight.',
    soil: 'Well-draining, fertile soil. Can tolerate various pH levels.',
    temperature: 'Hardy annuals/perennials. Prefer cool to temperate climates.',
    fertilization: 'Light feeding. Too much fertilizer can reduce flowering.',
    pruning: 'Deadhead to prolong blooming. Cut back after flowering.',
  },
};

// General care guidelines (fallback)
const GENERAL_CARE = {
  watering: 'Water when top inch of soil is dry. Ensure good drainage to prevent root rot.',
  light: 'Most flowering plants prefer bright, indirect light or full sun depending on species.',
  soil: 'Well-draining soil rich in organic matter is ideal for most plants.',
  temperature: 'Maintain temperatures appropriate for the plant\'s native habitat.',
  fertilization: 'Feed during growing season with balanced fertilizer according to package instructions.',
  pruning: 'Remove dead or damaged growth regularly. Prune after flowering to encourage new blooms.',
};

// Get care information for a plant
export function getPlantCareInfo(flower) {
  const family = flower.family || flower.taxonomic_hierarchy?.find(t => t.rank === 'Family')?.name;
  
  if (family && PLANT_CARE_BY_FAMILY[family]) {
    return {
      ...PLANT_CARE_BY_FAMILY[family],
      source: `General care guidelines for ${family} family`,
    };
  }
  
  return {
    ...GENERAL_CARE,
    source: 'General flowering plant care guidelines',
  };
}


