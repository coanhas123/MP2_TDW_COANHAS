// useFavorites.js - Custom hook for managing favorite flowers from regions
// Stores favorites in localStorage and syncs across pages
// Automatically replaces favorites without images with valid ones from API

import { useState, useEffect, useCallback } from 'react';
import { loadFavorites, saveFavorites } from './useFlowers';
import { fetchRandomFlowers } from '../lib/regions';

// Helper function to check if flower has a valid image
function hasValidImage(flower) {
  const imageUrl = flower?.default_image?.medium_url || flower?.image;
  return Boolean(imageUrl && imageUrl.trim() !== '');
}

// Custom event to sync favorites across components
const FAVORITES_CHANGED_EVENT = 'favorites-changed';

// Function to trigger favorites sync
function triggerFavoritesSync() {
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [replacingFavorites, setReplacingFavorites] = useState(false);

  // Function to replace favorites without images with valid ones from API
  const replaceFavoritesWithoutImages = useCallback(async (favoritesNeedingReplacement) => {
    if (favoritesNeedingReplacement.length === 0) return;

    console.log(`[useFavorites] Replacing ${favoritesNeedingReplacement.length} favorites without images...`);
    setReplacingFavorites(true);

    try {
      // Fetch enough flowers to replace the ones without images
      const replacementCount = Math.max(favoritesNeedingReplacement.length, 5);
      const apiFlowers = await fetchRandomFlowers(null, replacementCount);
      
      // Filter to only flowers with valid images
      const validReplacements = apiFlowers.filter(hasValidImage);
      
      if (validReplacements.length === 0) {
        console.warn('[useFavorites] No valid replacement flowers found from API');
        return;
      }

      setFavorites(current => {
        const replaced = current.map(fav => {
          if (!hasValidImage(fav)) {
            // Find the original favorite in the list
            const needsReplacement = favoritesNeedingReplacement.find(f => f.id === fav.id);
            if (needsReplacement && validReplacements.length > 0) {
              // Get a replacement and keep the original ID
              const replacement = validReplacements.pop();
              console.log(`[useFavorites] Replacing ${fav.common_name || fav.name} with ${replacement.common_name || replacement.name}`);
              
              // Keep the original ID and merge with replacement data
              return {
                ...replacement,
                id: fav.id, // Keep original ID
                name: fav.common_name || fav.name || replacement.common_name || replacement.name,
                common_name: fav.common_name || fav.name || replacement.common_name || replacement.name,
                scientific: fav.scientific_name || fav.scientific || replacement.scientific_name || replacement.scientific,
                scientific_name: fav.scientific_name || fav.scientific || replacement.scientific_name || replacement.scientific,
              };
            }
          }
          return fav;
        });

        return replaced;
      });
    } catch (err) {
      console.error('[useFavorites] Error replacing favorites without images:', err);
    } finally {
      setReplacingFavorites(false);
    }
  }, []);

  // Load favorites from localStorage
  const loadFavoritesFromStorage = useCallback(() => {
    const loaded = loadFavorites();
    console.log('[useFavorites] Loading from storage, found:', loaded.length, 'favorites');
    
    // Check for favorites without images
    const withoutImages = loaded.filter(fav => !hasValidImage(fav));
    if (withoutImages.length > 0) {
      console.log('[useFavorites] Found', withoutImages.length, 'favorites without images, will replace');
      // Replace them asynchronously
      replaceFavoritesWithoutImages(withoutImages);
    }
    
    // Filter out favorites without images and update state
    const validFavorites = loaded.filter(hasValidImage);
    console.log('[useFavorites] Reloading favorites from storage:', validFavorites.length, 'valid favorites');
    console.log('[useFavorites] Valid favorites:', validFavorites.map(f => ({
      id: f.id,
      name: f.common_name || f.name,
      scientific: f.scientific_name || f.scientific
    })));
    
    // Force state update
    setFavorites(validFavorites);
    return validFavorites;
  }, [replaceFavoritesWithoutImages]);

  // Load favorites on mount and when storage changes
  useEffect(() => {
    const loaded = loadFavorites();
    console.log('[useFavorites] Initial load from storage:', loaded.length, 'favorites');
    
    // Check for favorites without images on mount
    const withoutImages = loaded.filter(fav => !hasValidImage(fav));
    if (withoutImages.length > 0) {
      console.log('[useFavorites] Found', withoutImages.length, 'favorites without images, replacing...');
      replaceFavoritesWithoutImages(withoutImages);
    }
    
    // Set initial favorites (only valid ones)
    const validFavorites = loaded.filter(hasValidImage);
    console.log('[useFavorites] Setting initial favorites:', validFavorites.length, 'valid favorites');
    setFavorites(validFavorites);
  }, []); // Only run on mount

  // Listen for changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('[useFavorites] Storage change detected, reloading...');
      loadFavoritesFromStorage();
    };

    // Listen to custom event for same-tab sync
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleStorageChange);
    
    // Listen to storage events (for cross-tab sync)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadFavoritesFromStorage]);

  // Save favorites whenever they change (but skip if we just saved in addFavorite)
  useEffect(() => {
    // Skip if favorites array is empty (initial load)
    if (favorites.length === 0) {
      return;
    }
    
    // Always save favorites (even if empty) - only save favorites with valid images
    const validFavorites = favorites.filter(hasValidImage);
    console.log('[useFavorites] useEffect: Saving favorites to localStorage:', validFavorites.length, 'favorites');
    
    // Only save if different from what's in storage (avoid unnecessary writes)
    const currentSaved = loadFavorites();
    if (currentSaved.length === validFavorites.length) {
      // Check if they're the same
      const same = validFavorites.every(fav => {
        return currentSaved.some(saved => saved.id === fav.id);
      });
      if (same) {
        console.log('[useFavorites] Favorites unchanged, skipping save');
        return;
      }
    }
    
    saveFavorites(validFavorites);
    
    // Verify save was successful
    const saved = loadFavorites();
    console.log('[useFavorites] Verified saved favorites:', saved.length, 'favorites in storage');
    
    if (saved.length !== validFavorites.length) {
      console.error('[useFavorites] Mismatch! Tried to save', validFavorites.length, 'but found', saved.length, 'in storage');
    }
    
    // Trigger sync event after a small delay to ensure localStorage is written
    setTimeout(() => {
      console.log('[useFavorites] Triggering favorites sync event');
      triggerFavoritesSync();
    }, 100);
  }, [favorites]);

  // Add a flower to favorites
  const addFavorite = useCallback((flower) => {
    console.log('[useFavorites] addFavorite called with:', {
      name: flower?.common_name || flower?.name,
      scientific: flower?.scientific_name || flower?.scientific,
      hasDefaultImage: !!flower?.default_image,
      hasImage: !!flower?.image,
      defaultImageUrl: flower?.default_image?.medium_url,
      imageUrl: flower?.image,
      fullFlower: flower
    });
    
    const imageValid = hasValidImage(flower);
    console.log('[useFavorites] Image validation result:', imageValid);
    
    if (!imageValid) {
      console.warn('[useFavorites] Cannot add flower without image to favorites');
      console.warn('[useFavorites] Flower structure:', JSON.stringify(flower, null, 2));
      return false;
    }

    // Normalize scientific name for comparison
    const normalizeScientificName = (name) => {
      if (!name) return '';
      return String(name).trim().toLowerCase();
    };

    const flowerScientificName = normalizeScientificName(flower.scientific_name || flower.scientific);

    // Get current favorites state
    setFavorites(currentFavorites => {
      console.log('[useFavorites] Current favorites count:', currentFavorites.length);
      
      // Check if already in favorites (by scientific_name as unique identifier)
      const isAlreadyFavorite = currentFavorites.some(fav => {
        const favScientificName = normalizeScientificName(fav.scientific_name || fav.scientific);
        return favScientificName === flowerScientificName && favScientificName !== '';
      });

      if (isAlreadyFavorite) {
        console.log('[useFavorites] Flower already in favorites:', flower.scientific_name || flower.scientific);
        return currentFavorites; // Already in favorites
      }

      // Create a copy with proper structure
      const favoriteFlower = {
        ...flower,
        id: `favorite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: flower.common_name || flower.name || flower.scientific_name || 'Unknown',
        common_name: flower.common_name || flower.name || flower.scientific_name || 'Unknown',
        scientific: flower.scientific_name || flower.scientific || '—',
        scientific_name: flower.scientific_name || flower.scientific || '—',
        image: flower.default_image?.medium_url || flower.image,
        default_image: flower.default_image || (flower.image ? { medium_url: flower.image } : null),
      };

      const updatedFavorites = [...currentFavorites, favoriteFlower];
      console.log('[useFavorites] Added favorite. New count:', updatedFavorites.length);
      console.log('[useFavorites] Favorite details:', {
        id: favoriteFlower.id,
        name: favoriteFlower.common_name,
        scientific: favoriteFlower.scientific_name,
        hasImage: hasValidImage(favoriteFlower),
        image: favoriteFlower.image || favoriteFlower.default_image?.medium_url
      });
      
      // Immediately save to localStorage to ensure it's persisted
      const validUpdated = updatedFavorites.filter(hasValidImage);
      console.log('[useFavorites] Saving', validUpdated.length, 'favorites to localStorage immediately');
      saveFavorites(validUpdated);
      
      // Verify it was saved
      const saved = loadFavorites();
      console.log('[useFavorites] Verification: saved', saved.length, 'favorites to localStorage');
      
      // Trigger sync event
      setTimeout(() => {
        triggerFavoritesSync();
      }, 50);
      
      return updatedFavorites;
    });

    return true;
  }, []);

  // Remove a flower from favorites
  const removeFavorite = useCallback((flowerId) => {
    setFavorites(currentFavorites => {
      const updated = currentFavorites.filter(fav => fav.id !== flowerId);
      console.log('[useFavorites] Removed favorite. Remaining count:', updated.length);
      return updated;
    });
  }, []);

  // Check if a flower is in favorites
  const isFavorite = useCallback((flower) => {
    if (!flower) return false;
    
    // Normalize scientific name for comparison
    const normalizeScientificName = (name) => {
      if (!name) return '';
      return String(name).trim().toLowerCase();
    };
    
    const flowerScientificName = normalizeScientificName(flower.scientific_name || flower.scientific);
    if (!flowerScientificName) return false;
    
    const isFav = favorites.some(fav => {
      const favScientificName = normalizeScientificName(fav.scientific_name || fav.scientific);
      return favScientificName === flowerScientificName && favScientificName !== '';
    });
    
    console.log('[useFavorites] isFavorite check:', {
      flowerName: flower.common_name || flower.name,
      scientific: flower.scientific_name || flower.scientific,
      isFavorite: isFav,
      totalFavorites: favorites.length
    });
    
    return isFav;
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    reloadFavorites: loadFavoritesFromStorage,
  };
}
