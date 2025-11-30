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
    
    // Check for favorites without images
    const withoutImages = loaded.filter(fav => !hasValidImage(fav));
    if (withoutImages.length > 0) {
      // Replace them asynchronously
      replaceFavoritesWithoutImages(withoutImages);
    }
    
    // Filter out favorites without images
    const validFavorites = loaded.filter(hasValidImage);
    setFavorites(validFavorites);
    return validFavorites;
  }, [replaceFavoritesWithoutImages]);

  // Load favorites on mount and when storage changes
  useEffect(() => {
    const loaded = loadFavorites();
    
    // Check for favorites without images on mount
    const withoutImages = loaded.filter(fav => !hasValidImage(fav));
    if (withoutImages.length > 0) {
      replaceFavoritesWithoutImages(withoutImages);
    }
    
    // Set initial favorites (only valid ones)
    setFavorites(loaded.filter(hasValidImage));

    // Listen for changes from other tabs/components
    const handleStorageChange = () => {
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
  }, [loadFavoritesFromStorage, replaceFavoritesWithoutImages]);

  // Save favorites whenever they change
  useEffect(() => {
    if (favorites.length > 0 || loadFavorites().length === 0) {
      // Only save favorites with valid images
      const validFavorites = favorites.filter(hasValidImage);
      saveFavorites(validFavorites);
      
      // Trigger sync event after a small delay to ensure localStorage is written
      setTimeout(() => {
        triggerFavoritesSync();
      }, 100);
    }
  }, [favorites]);

  // Add a flower to favorites
  const addFavorite = useCallback((flower) => {
    if (!hasValidImage(flower)) {
      console.warn('[useFavorites] Cannot add flower without image to favorites');
      return false;
    }

    setFavorites(currentFavorites => {
      // Check if already in favorites (by scientific_name as unique identifier)
      const isAlreadyFavorite = currentFavorites.some(
        fav => fav.scientific_name === flower.scientific_name
      );

      if (isAlreadyFavorite) {
        return currentFavorites; // Already in favorites
      }

      // Create a copy with proper structure
      const favoriteFlower = {
        ...flower,
        id: `favorite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: flower.common_name || flower.name || flower.scientific_name,
        common_name: flower.common_name || flower.name || flower.scientific_name,
        scientific: flower.scientific_name || flower.scientific,
        scientific_name: flower.scientific_name || flower.scientific,
        image: flower.default_image?.medium_url || flower.image,
        default_image: flower.default_image || (flower.image ? { medium_url: flower.image } : null),
      };

      return [...currentFavorites, favoriteFlower];
    });

    return true;
  }, []);

  // Remove a flower from favorites
  const removeFavorite = useCallback((flowerId) => {
    setFavorites(currentFavorites => {
      return currentFavorites.filter(fav => fav.id !== flowerId);
    });
  }, []);

  // Check if a flower is in favorites
  const isFavorite = useCallback((flower) => {
    if (!flower || !flower.scientific_name) return false;
    return favorites.some(
      fav => fav.scientific_name === flower.scientific_name
    );
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    reloadFavorites: loadFavoritesFromStorage,
  };
}
