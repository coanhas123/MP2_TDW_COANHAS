// useFavorites.js - Hook personalizado para gerir flores favoritas das regiões
// Guarda favoritos no localStorage e sincroniza entre páginas
// Substitui automaticamente favoritos sem imagens por outros válidos da API

import { useState, useEffect, useCallback } from 'react';
import { loadFavorites, saveFavorites } from './useFlowers';
import { fetchRandomFlowers } from '../lib/regions';

// Função auxiliar para verificar se uma flor tem uma imagem válida
function hasValidImage(flower) {
  const imageUrl = flower?.default_image?.medium_url || flower?.image;
  return Boolean(imageUrl && imageUrl.trim() !== '');
}

// Evento personalizado para sincronizar favoritos entre componentes
const FAVORITES_CHANGED_EVENT = 'favorites-changed';

// Função para disparar sincronização de favoritos
function triggerFavoritesSync() {
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [replacingFavorites, setReplacingFavorites] = useState(false);

  // Função para substituir favoritos sem imagens por outros válidos da API
  const replaceFavoritesWithoutImages = useCallback(async (favoritesNeedingReplacement) => {
    if (favoritesNeedingReplacement.length === 0) return;

    console.log(`[useFavorites] A substituir ${favoritesNeedingReplacement.length} favoritos sem imagens...`);
    setReplacingFavorites(true);

    try {
      // Procurar flores suficientes para substituir as que não têm imagens
      const replacementCount = Math.max(favoritesNeedingReplacement.length, 5);
      const apiFlowers = await fetchRandomFlowers(null, replacementCount);
      
      // Filtrar apenas flores com imagens válidas
      const validReplacements = apiFlowers.filter(hasValidImage);
      
      if (validReplacements.length === 0) {
        console.warn('[useFavorites] Não foram encontradas flores válidas para substituição na API');
        return;
      }

      setFavorites(current => {
        const replaced = current.map(fav => {
          if (!hasValidImage(fav)) {
            // Encontrar o favorito original na lista
            const needsReplacement = favoritesNeedingReplacement.find(f => f.id === fav.id);
            if (needsReplacement && validReplacements.length > 0) {
              // Obter uma substituição e manter o ID original
              const replacement = validReplacements.pop();
              console.log(`[useFavorites] A substituir ${fav.common_name || fav.name} por ${replacement.common_name || replacement.name}`);
              
              // Manter o ID original e combinar com os dados da substituição
              return {
                ...replacement,
                id: fav.id, 
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
      console.error('[useFavorites] Erro ao substituir favoritos sem imagens:', err);
    } finally {
      setReplacingFavorites(false);
    }
  }, []);

  // Carregar favoritos do localStorage
  const loadFavoritesFromStorage = useCallback(() => {
    const loaded = loadFavorites();
    console.log('[useFavorites] A carregar do armazenamento, encontrados:', loaded.length, 'favoritos');
    
    // Verificar favoritos sem imagens
    const withoutImages = loaded.filter(fav => !hasValidImage(fav));
    if (withoutImages.length > 0) {
      console.log('[useFavorites] Encontrados', withoutImages.length, 'favoritos sem imagens, serão substituídos');
      // Substituí-los de forma assíncrona
      replaceFavoritesWithoutImages(withoutImages);
    }
    
    // Filtrar favoritos sem imagens e actualizar o estado
    const validFavorites = loaded.filter(hasValidImage);
    console.log('[useFavorites] A recarregar favoritos do armazenamento:', validFavorites.length, 'favoritos válidos');
    console.log('[useFavorites] Favoritos válidos:', validFavorites.map(f => ({
      id: f.id,
      name: f.common_name || f.name,
      scientific: f.scientific_name || f.scientific
    })));
    
    // Forçar actualização do estado
    setFavorites(validFavorites);
    return validFavorites;
  }, [replaceFavoritesWithoutImages]);

  // Carregar favoritos ao inicializar e quando o armazenamento muda
  useEffect(() => {
    const loaded = loadFavorites();
    console.log('[useFavorites] Carregamento inicial do armazenamento:', loaded.length, 'favoritos');
    
    // Verificar favoritos sem imagens ao inicializar
    const withoutImages = loaded.filter(fav => !hasValidImage(fav));
    if (withoutImages.length > 0) {
      console.log('[useFavorites] Encontrados', withoutImages.length, 'favoritos sem imagens, a substituir...');
      replaceFavoritesWithoutImages(withoutImages);
    }
    
    // Definir favoritos iniciais (apenas os válidos)
    const validFavorites = loaded.filter(hasValidImage);
    console.log('[useFavorites] A definir favoritos iniciais:', validFavorites.length, 'favoritos válidos');
    setFavorites(validFavorites);
  }, []); // Executar apenas ao inicializar

  // Verificar mudanças de outros separadores/componentes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('[useFavorites] Mudança no armazenamento detectada, a recarregar...');
      loadFavoritesFromStorage();
    };

    // Verificar evento personalizado para sincronização no mesmo separador
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleStorageChange);
    
    // Verificar eventos de armazenamento (para sincronização entre separadores)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadFavoritesFromStorage]);

  // Guardar favoritos sempre que mudarem (mas saltar se acabámos de guardar em addFavorite)
  useEffect(() => {
    // Saltar se o array de favoritos estiver vazio (carregamento inicial)
    if (favorites.length === 0) {
      return;
    }
    
    // Sempre guardar favoritos (mesmo se vazio) - apenas guardar favoritos com imagens válidas
    const validFavorites = favorites.filter(hasValidImage);
    console.log('[useFavorites] useEffect: A guardar favoritos no localStorage:', validFavorites.length, 'favoritos');
    
    // Apenas guardar se for diferente do que está no armazenamento (evitar escritas desnecessárias)
    const currentSaved = loadFavorites();
    if (currentSaved.length === validFavorites.length) {
      // Verificar se são iguais
      const same = validFavorites.every(fav => {
        return currentSaved.some(saved => saved.id === fav.id);
      });
      if (same) {
        console.log('[useFavorites] Favoritos inalterados, a saltar guardar');
        return;
      }
    }
    
    saveFavorites(validFavorites);
    
    // Verificar se o guardar foi bem-sucedido
    const saved = loadFavorites();
    console.log('[useFavorites] Favoritos guardados verificados:', saved.length, 'favoritos no armazenamento');
    
    if (saved.length !== validFavorites.length) {
      console.error('[useFavorites] Incompatibilidade! Tentámos guardar', validFavorites.length, 'mas encontramos', saved.length, 'no armazenamento');
    }
    
    // Disparar evento de sincronização após um pequeno atraso para garantir que o localStorage foi escrito
    setTimeout(() => {
      console.log('[useFavorites] A disparar evento de sincronização de favoritos');
      triggerFavoritesSync();
    }, 100);
  }, [favorites]);

  // Adicionar uma flor aos favoritos
  const addFavorite = useCallback((flower) => {
    console.log('[useFavorites] addFavorite chamado com:', {
      name: flower?.common_name || flower?.name,
      scientific: flower?.scientific_name || flower?.scientific,
      hasDefaultImage: !!flower?.default_image,
      hasImage: !!flower?.image,
      defaultImageUrl: flower?.default_image?.medium_url,
      imageUrl: flower?.image,
      fullFlower: flower
    });
    
    const imageValid = hasValidImage(flower);
    console.log('[useFavorites] Resultado da validação da imagem:', imageValid);
    
    if (!imageValid) {
      console.warn('[useFavorites] Não é possível adicionar flor sem imagem aos favoritos');
      console.warn('[useFavorites] Estrutura da flor:', JSON.stringify(flower, null, 2));
      return false;
    }

    // Normalizar nome científico para comparação
    const normalizeScientificName = (name) => {
      if (!name) return '';
      return String(name).trim().toLowerCase();
    };

    const flowerScientificName = normalizeScientificName(flower.scientific_name || flower.scientific);

    // Obter estado actual dos favoritos
    setFavorites(currentFavorites => {
      console.log('[useFavorites] Contagem actual de favoritos:', currentFavorites.length);
      
      // Verificar se já está nos favoritos 
      const isAlreadyFavorite = currentFavorites.some(fav => {
        const favScientificName = normalizeScientificName(fav.scientific_name || fav.scientific);
        return favScientificName === flowerScientificName && favScientificName !== '';
      });

      if (isAlreadyFavorite) {
        console.log('[useFavorites] Flor já está nos favoritos:', flower.scientific_name || flower.scientific);
        return currentFavorites; 
      }

      // Criar uma cópia com estrutura adequada
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
      console.log('[useFavorites] Favorito adicionado. Nova contagem:', updatedFavorites.length);
      console.log('[useFavorites] Detalhes do favorito:', {
        id: favoriteFlower.id,
        name: favoriteFlower.common_name,
        scientific: favoriteFlower.scientific_name,
        hasImage: hasValidImage(favoriteFlower),
        image: favoriteFlower.image || favoriteFlower.default_image?.medium_url
      });
      
      // Guardar imediatamente no localStorage para garantir que é persistido
      const validUpdated = updatedFavorites.filter(hasValidImage);
      console.log('[useFavorites] A guardar', validUpdated.length, 'favoritos no localStorage imediatamente');
      saveFavorites(validUpdated);
      
      // Verificar se foi guardado
      const saved = loadFavorites();
      console.log('[useFavorites] Verificação: guardados', saved.length, 'favoritos no localStorage');
      
      // Disparar evento de sincronização
      setTimeout(() => {
        triggerFavoritesSync();
      }, 50);
      
      return updatedFavorites;
    });

    return true;
  }, []);

  // Remover uma flor dos favoritos
  const removeFavorite = useCallback((flowerId) => {
    setFavorites(currentFavorites => {
      const updated = currentFavorites.filter(fav => fav.id !== flowerId);
      console.log('[useFavorites] Favorito removido. Contagem restante:', updated.length);
      return updated;
    });
  }, []);

  // Verificar se uma flor está nos favoritos
  const isFavorite = useCallback((flower) => {
    if (!flower) return false;
    
    // Normalizar nome científico para comparação
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
    
    console.log('[useFavorites] Verificação isFavorite:', {
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
