// Hook personalizado para gestão de plantas pessoais do utilizador
// Persiste dados no localStorage e substitui automaticamente flores sem imagens
import { useState, useEffect, useCallback } from 'react';
import { fetchRandomFlowers } from '../lib/regions';

function hasValidImage(flower) {
  const imageUrl = flower?.default_image?.medium_url || flower?.image;
  return Boolean(imageUrl && imageUrl.trim() !== '');
}

const STORAGE_KEY = 'beFlourished_user_plants';
const FAVORITES_KEY = 'beFlourished_favorites';
const DELETED_SAMPLES_KEY = 'beFlourished_deleted_samples';

// Carrega IDs de amostras eliminadas para não reaparecerem
function loadDeletedSamples() {
  try {
    const stored = localStorage.getItem(DELETED_SAMPLES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading deleted samples:', e);
  }
  return [];
}

// Save deleted sample IDs
function saveDeletedSamples(deletedIds) {
  try {
    localStorage.setItem(DELETED_SAMPLES_KEY, JSON.stringify(deletedIds));
  } catch (e) {
    console.error('Error saving deleted samples:', e);
  }
}

// Load user plants from localStorage
function loadUserPlants() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const plants = JSON.parse(stored);
      return Array.isArray(plants) ? plants : [];
    }
  } catch (e) {
    console.error('Error loading user plants from localStorage:', e);
  }
  return [];
}

// Save user plants to localStorage
function saveUserPlants(plants) {
  try {
    // Only save plants with valid images
    const plantsWithImages = plants.filter(hasValidImage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantsWithImages));
  } catch (e) {
    console.error('Error saving user plants to localStorage:', e);
  }
}

// Load favorites from localStorage
export function loadFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      const favorites = JSON.parse(stored);
      return Array.isArray(favorites) ? favorites : [];
    }
  } catch (e) {
    console.error('Error loading favorites from localStorage:', e);
  }
  return [];
}

// Save favorites to localStorage
export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorites to localStorage:', e);
  }
}

// Custom event to sync user plants across components
const USER_PLANTS_CHANGED_EVENT = 'user-plants-changed';

// Function to trigger user plants sync
function triggerUserPlantsSync() {
  window.dispatchEvent(new CustomEvent(USER_PLANTS_CHANGED_EVENT));
}

// =============================================================================
// SAMPLE DATA - Flowers only with valid images
// These are just examples, user's plants are loaded from localStorage
// =============================================================================

const SAMPLE_FLOWERS = [
  {
    id: 'sample-1',
    name: "Rose",
    common_name: "Rose",
    scientific: "Rosa rubiginosa",
    scientific_name: "Rosa rubiginosa",
    image: "https://images.unsplash.com/photo-1518621012428-7018d682e85f?w=400&h=300&fit=crop&q=80&auto=format",
    default_image: { 
      medium_url: "https://images.unsplash.com/photo-1518621012428-7018d682e85f?w=400&h=300&fit=crop&q=80&auto=format" 
    },
    family: "Rosaceae",
  },
  {
    id: 'sample-2',
    name: "Lavender",
    common_name: "Lavender",
    scientific: "Lavandula angustifolia",
    scientific_name: "Lavandula angustifolia",
    image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&h=300&fit=crop&q=80&auto=format",
    default_image: { 
      medium_url: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&h=300&fit=crop&q=80&auto=format" 
    },
    family: "Lamiaceae",
  },
  {
    id: 'sample-3',
    name: "Sunflower",
    common_name: "Sunflower",
    scientific: "Helianthus annuus",
    scientific_name: "Helianthus annuus",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=300&fit=crop&q=80&auto=format",
    default_image: { 
      medium_url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=300&fit=crop&q=80&auto=format" 
    },
    family: "Asteraceae",
  },
  {
    id: 'sample-4',
    name: "Tulip",
    common_name: "Tulip",
    scientific: "Tulipa gesneriana",
    scientific_name: "Tulipa gesneriana",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=300&fit=crop&q=80&auto=format",
    default_image: { 
      medium_url: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=300&fit=crop&q=80&auto=format" 
    },
    family: "Liliaceae",
  },
  {
    id: 'sample-5',
    name: "Daisy",
    common_name: "Daisy",
    scientific: "Bellis perennis",
    scientific_name: "Bellis perennis",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=300&fit=crop&q=80&auto=format",
    default_image: { 
      medium_url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=300&fit=crop&q=80&auto=format" 
    },
    family: "Asteraceae",
  },
  {
    id: 'sample-6',
    name: "Orchid",
    common_name: "Orchid",
    scientific: "Orchidaceae",
    scientific_name: "Orchidaceae",
    image: "https://images.unsplash.com/photo-1574029806020-e8c78d5c5c4c?w=400&h=300&fit=crop&q=80&auto=format",
    default_image: { 
      medium_url: "https://images.unsplash.com/photo-1574029806020-e8c78d5c5c4c?w=400&h=300&fit=crop&q=80&auto=format" 
    },
    family: "Orchidaceae",
  },
  {
    id: 'sample-7',
    name: "Poppy",
    common_name: "Poppy",
    scientific: "Papaver rhoeas",
    scientific_name: "Papaver rhoeas",
    image: "https://images.unsplash.com/photo-1581383040073-9040805c06b0?w=400&h=300&fit=crop&q=80&auto=format",
    default_image: { 
      medium_url: "https://images.unsplash.com/photo-1581383040073-9040805c06b0?w=400&h=300&fit=crop&q=80&auto=format" 
    },
    family: "Papaveraceae",
  },
];

// =============================================================================
// HOOK
// =============================================================================

export default function useFlowers(fetchCount = 8) {
  // Load deleted sample IDs
  const deletedSamples = loadDeletedSamples();
  
  // Filter out deleted samples
  const availableSamples = SAMPLE_FLOWERS.filter(
    sample => !deletedSamples.includes(sample.id)
  );
  
  // Load user's saved plants from localStorage
  const savedUserPlants = loadUserPlants();
  
  // Find plants without images that need replacement
  const plantsWithoutImages = savedUserPlants.filter(plant => !hasValidImage(plant));
  
  // Initialize with available sample flowers + saved plants (will replace ones without images later)
  const initialFlowers = [...availableSamples, ...savedUserPlants].filter(hasValidImage);
  
  const [flowers, setFlowers] = useState(initialFlowers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replacingFlowers, setReplacingFlowers] = useState(false);

  // Function to replace flowers without images with valid ones from API
  const replaceFlowersWithoutImages = useCallback(async (plantsNeedingReplacement) => {
    if (plantsNeedingReplacement.length === 0) return;

    console.log(`[useFlowers] Replacing ${plantsNeedingReplacement.length} flowers without images...`);
    setReplacingFlowers(true);

    try {
      // Fetch enough flowers to replace the ones without images
      const replacementCount = Math.max(plantsNeedingReplacement.length, 5);
      const apiFlowers = await fetchRandomFlowers(null, replacementCount);
      
      // Filter to only flowers with valid images
      const validReplacements = apiFlowers.filter(hasValidImage);
      
      if (validReplacements.length === 0) {
        console.warn('[useFlowers] No valid replacement flowers found from API');
        return;
      }

      // Map replacements to plants needing replacement
      setFlowers(current => {
        const updated = [...current];
        const userPlants = updated.filter(f => {
          const idString = String(f.id || '');
          return idString.startsWith('user-') || idString.startsWith('sample-');
        });
        const apiFlowers = updated.filter(f => {
          const idString = String(f.id || '');
          return !idString.startsWith('user-') && !idString.startsWith('sample-');
        });

        // Replace plants without images
        const replaced = userPlants.map(plant => {
          if (!hasValidImage(plant)) {
            // Find the original plant in the list
            const needsReplacement = plantsNeedingReplacement.find(p => p.id === plant.id);
            if (needsReplacement && validReplacements.length > 0) {
              // Get a replacement and keep the original ID and user data
              const replacement = validReplacements.pop();
              console.log(`[useFlowers] Replacing ${plant.name || plant.common_name} with ${replacement.common_name || replacement.name}`);
              
              // Keep the original ID and merge with replacement data
              return {
                ...replacement,
                id: plant.id, // Keep original ID
                name: plant.name || replacement.common_name || replacement.name,
                common_name: plant.name || replacement.common_name || replacement.name,
                scientific: plant.scientific || replacement.scientific_name || replacement.scientific,
                scientific_name: plant.scientific || replacement.scientific_name || replacement.scientific,
                // Preserve user-added notes or other custom fields if they exist
                ...(plant.notes && { notes: plant.notes }),
                ...(plant.customData && { customData: plant.customData }),
              };
            }
          }
          return plant;
        });

        // Save the updated user plants (only user-* IDs, not samples)
        const userAddedOnly = replaced.filter(plant => {
          const idString = String(plant.id);
          return idString.startsWith('user-');
        });
        saveUserPlants(userAddedOnly);

        return [...replaced, ...apiFlowers];
      });
    } catch (err) {
      console.error('[useFlowers] Error replacing flowers without images:', err);
    } finally {
      setReplacingFlowers(false);
    }
  }, []);

  // Load user plants from storage
  const loadUserPlantsFromStorage = useCallback(() => {
    const deleted = loadDeletedSamples();
    const available = SAMPLE_FLOWERS.filter(s => !deleted.includes(s.id));
    const saved = loadUserPlants();
    
    // Check for plants without images
    const withoutImages = saved.filter(plant => !hasValidImage(plant));
    if (withoutImages.length > 0) {
      // Replace them asynchronously
      replaceFlowersWithoutImages(withoutImages);
    }
    
    return [...available, ...saved.filter(hasValidImage)].filter(hasValidImage);
  }, [replaceFlowersWithoutImages]);

  // Check and replace flowers without images on mount
  useEffect(() => {
    if (plantsWithoutImages.length > 0) {
      replaceFlowersWithoutImages(plantsWithoutImages);
    }
  }, []); // Only run on mount

  // Sync when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const loaded = loadUserPlantsFromStorage();
      setFlowers(current => {
        // Keep API flowers, update user plants and samples
        const apiFlowers = current.filter(f => {
          const idString = String(f.id || '');
          return !idString.startsWith('user-') && !idString.startsWith('sample-');
        });
        const userPlants = loaded;
        return [...userPlants, ...apiFlowers];
      });
    };

    // Listen to custom event for same-tab sync
    window.addEventListener(USER_PLANTS_CHANGED_EVENT, handleStorageChange);
    
    // Listen to storage events (for cross-tab sync)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(USER_PLANTS_CHANGED_EVENT, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUserPlantsFromStorage]);

  // ---------------------------------------------------------------------------
  // Save user plants to localStorage whenever they change
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Filter to only user's personal plants (user-* and sample-* IDs)
    const userPlants = flowers.filter(flower => {
      if (!flower.id) return false;
      const idString = String(flower.id);
      return idString.startsWith('user-') || idString.startsWith('sample-');
    });
    
    // Filter out plants without images and replace them
    const userPlantsWithImages = userPlants.filter(hasValidImage);
    const withoutImages = userPlants.filter(plant => !hasValidImage(plant));
    
    if (withoutImages.length > 0) {
      // Replace flowers without images
      replaceFlowersWithoutImages(withoutImages);
    }
    
    // Separate samples and user-added plants
    const samples = userPlantsWithImages.filter(flower => {
      const idString = String(flower.id);
      return idString.startsWith('sample-');
    });
    
    const userAddedPlants = userPlantsWithImages.filter(flower => {
      const idString = String(flower.id);
      return idString.startsWith('user-');
    });
    
    // Save only user-added plants (not samples)
    saveUserPlants(userAddedPlants);
    
    // Trigger sync after a delay
    setTimeout(() => {
      triggerUserPlantsSync();
    }, 100);
  }, [flowers, replaceFlowersWithoutImages]);

  // ---------------------------------------------------------------------------
  // Fetch flowers from API on mount (but don't save to localStorage)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // No API key needed for iNaturalist
    fetchRandomFlowers(null, fetchCount)
      .then((data) => {
        // Preserve all data from API including images, taxonomic hierarchy, etc.
        // CRITICAL: Filter out flowers without images - don't add them to state
        const mapped = data
          .filter(hasValidImage) // Only include flowers with valid images
          .map((flower) => ({
            ...flower,
            name: flower.common_name || "Unknown Specimen",
            common_name: flower.common_name || "Unknown Specimen",
            scientific: flower.scientific_name || "—",
            scientific_name: flower.scientific_name || "—",
            image: flower.default_image?.medium_url,
          }));

        console.log(`[useFlowers] API returned ${data.length} flowers, ${mapped.length} with images`);

        // Don't overwrite user's plants, just add API flowers (they're not saved to localStorage)
        setFlowers((prev) => {
          // Keep existing user plants and samples, add API flowers
          const userPlants = prev.filter(f => {
            const idString = String(f.id || '');
            return idString.startsWith('user-') || idString.startsWith('sample-');
          });
          return [...userPlants, ...mapped];
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching flowers:', err);
        setError(err);
        setLoading(false);
      });
  }, [fetchCount]);

  // ---------------------------------------------------------------------------
  // Add a new flower to the collection
  // ---------------------------------------------------------------------------
  const addFlower = useCallback((newFlower) => {
    // CRITICAL: Don't add flowers without images
    if (!hasValidImage(newFlower)) {
      console.warn('[useFlowers] Cannot add flower without image:', newFlower.name);
      alert("Please upload an image for your plant before adding it to the collection.");
      return;
    }

    const flowerWithId = { 
      ...newFlower, 
      id: `user-${Date.now()}`,
      common_name: newFlower.name,
      scientific_name: newFlower.scientific,
      default_image: newFlower.image ? { medium_url: newFlower.image } : null,
    };
    setFlowers((prev) => [flowerWithId, ...prev]);
  }, []);

  // ---------------------------------------------------------------------------
  // Remove a flower by ID
  // ---------------------------------------------------------------------------
  const removeFlower = useCallback((id) => {
    if (!id) return;
    
    const idString = String(id);
    
    // If it's a sample, mark it as deleted
    if (idString.startsWith('sample-')) {
      const deleted = loadDeletedSamples();
      if (!deleted.includes(idString)) {
        deleted.push(idString);
        saveDeletedSamples(deleted);
      }
    }
    
    // Remove from state
    setFlowers((prev) => prev.filter((flower) => flower.id !== id));
  }, []);

  return {
    flowers,
    loading: loading || replacingFlowers,
    error,
    addFlower,
    removeFlower,
  };
}
