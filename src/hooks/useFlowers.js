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

function saveDeletedSamples(deletedIds) {
  try {
    localStorage.setItem(DELETED_SAMPLES_KEY, JSON.stringify(deletedIds));
  } catch (e) {
    console.error('Error saving deleted samples:', e);
  }
}

// A partir do LocalStorage carregar as plantas do utilizador
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

// Guardar plantas do utilizador no Local storage
function saveUserPlants(plants) {
  try {
    const plantsWithImages = plants.filter(hasValidImage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantsWithImages));
  } catch (e) {
    console.error('Error saving user plants to localStorage:', e);
  }
}

// Adicionar favoritos ao Local Storage
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

// Salvar favoritos
export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorites to localStorage:', e);
  }
}


const USER_PLANTS_CHANGED_EVENT = 'user-plants-changed';

function triggerUserPlantsSync() {
  window.dispatchEvent(new CustomEvent(USER_PLANTS_CHANGED_EVENT));
}


// DADOS DE EXEMPLO - Apenas flores com imagens válidas
// Estes são apenas exemplos, as plantas do utilizador são carregadas do localStorage


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


// HOOK


export default function useFlowers(fetchCount = 8) {
  // Carregar IDs de amostras eliminadas
  const deletedSamples = loadDeletedSamples();
  
  // Filtrar amostras eliminadas
  const availableSamples = SAMPLE_FLOWERS.filter(
    sample => !deletedSamples.includes(sample.id)
  );
  
  // Carregar plantas guardadas do utilizador do localStorage
  const savedUserPlants = loadUserPlants();
  
  // Encontrar plantas sem imagens que precisam de substituição
  const plantsWithoutImages = savedUserPlants.filter(plant => !hasValidImage(plant));
  
  // Inicializar com flores de amostra disponíveis + plantas guardadas (substituirá as sem imagens depois)
  const initialFlowers = [...availableSamples, ...savedUserPlants].filter(hasValidImage);
  
  const [flowers, setFlowers] = useState(initialFlowers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replacingFlowers, setReplacingFlowers] = useState(false);

  // Função para substituir flores sem imagens por outras válidas da API
  const replaceFlowersWithoutImages = useCallback(async (plantsNeedingReplacement) => {
    if (plantsNeedingReplacement.length === 0) return;

    console.log(`[useFlowers] A substituir ${plantsNeedingReplacement.length} flores sem imagens...`);
    setReplacingFlowers(true);

    try {
      // Procurar flores suficientes para substituir as que não têm imagens
      const replacementCount = Math.max(plantsNeedingReplacement.length, 5);
      const apiFlowers = await fetchRandomFlowers(null, replacementCount);
      
      // Filtrar apenas flores com imagens válidas
      const validReplacements = apiFlowers.filter(hasValidImage);
      
      if (validReplacements.length === 0) {
        console.warn('[useFlowers] Não foram encontradas flores válidas para substituição na API');
        return;
      }

      // Mapear substituições para plantas que precisam de substituição
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

        // Substituir plantas sem imagens
        const replaced = userPlants.map(plant => {
          if (!hasValidImage(plant)) {
            // Encontrar a planta original na lista
            const needsReplacement = plantsNeedingReplacement.find(p => p.id === plant.id);
            if (needsReplacement && validReplacements.length > 0) {
              // Obter uma substituição e manter o ID original e dados do utilizador
              const replacement = validReplacements.pop();
              console.log(`[useFlowers] A substituir ${plant.name || plant.common_name} por ${replacement.common_name || replacement.name}`);
              
              // Manter o ID original e combinar com dados da substituição
              return {
                ...replacement,
                id: plant.id,
                name: plant.name || replacement.common_name || replacement.name,
                common_name: plant.name || replacement.common_name || replacement.name,
                scientific: plant.scientific || replacement.scientific_name || replacement.scientific,
                scientific_name: plant.scientific || replacement.scientific_name || replacement.scientific,
                // Preservar notas adicionadas pelo utilizador ou outros campos personalizados se existirem
                ...(plant.notes && { notes: plant.notes }),
                ...(plant.customData && { customData: plant.customData }),
              };
            }
          }
          return plant;
        });

        // Guardar as plantas do utilizador actualizadas (apenas IDs user-*, não amostras)
        const userAddedOnly = replaced.filter(plant => {
          const idString = String(plant.id);
          return idString.startsWith('user-');
        });
        saveUserPlants(userAddedOnly);

        return [...replaced, ...apiFlowers];
      });
    } catch (err) {
      console.error('[useFlowers] Erro ao substituir flores sem imagens:', err);
    } finally {
      setReplacingFlowers(false);
    }
  }, []);

  // Carregar plantas do utilizador do armazenamento
  const loadUserPlantsFromStorage = useCallback(() => {
    const deleted = loadDeletedSamples();
    const available = SAMPLE_FLOWERS.filter(s => !deleted.includes(s.id));
    const saved = loadUserPlants();
    
    // Verificar plantas sem imagens
    const withoutImages = saved.filter(plant => !hasValidImage(plant));
    if (withoutImages.length > 0) {
      // Substituí-las de forma assíncrona
      replaceFlowersWithoutImages(withoutImages);
    }
    
    return [...available, ...saved.filter(hasValidImage)].filter(hasValidImage);
  }, [replaceFlowersWithoutImages]);

  // Verificar e substituir flores sem imagens ao inicializar
  useEffect(() => {
    if (plantsWithoutImages.length > 0) {
      replaceFlowersWithoutImages(plantsWithoutImages);
    }
  }, []); // Executar apenas ao inicializar

  // Sincronizar quando o armazenamento muda
  useEffect(() => {
    const handleStorageChange = () => {
      const loaded = loadUserPlantsFromStorage();
      setFlowers(current => {
        // Manter flores da API, actualizar plantas do utilizador e amostras
        const apiFlowers = current.filter(f => {
          const idString = String(f.id || '');
          return !idString.startsWith('user-') && !idString.startsWith('sample-');
        });
        const userPlants = loaded;
        return [...userPlants, ...apiFlowers];
      });
    };

    // Verificar evento personalizado para sincronização no mesmo separador
    window.addEventListener(USER_PLANTS_CHANGED_EVENT, handleStorageChange);
    
    // Verificar eventos de armazenamento (para sincronização entre separadores)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(USER_PLANTS_CHANGED_EVENT, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUserPlantsFromStorage]);

 
  // Guardar plantas do utilizador no localStorage sempre que mudarem
 
  useEffect(() => {
    // Filtrar apenas plantas pessoais do utilizador (IDs user-* e sample-*)
    const userPlants = flowers.filter(flower => {
      if (!flower.id) return false;
      const idString = String(flower.id);
      return idString.startsWith('user-') || idString.startsWith('sample-');
    });
    
    // Filtrar plantas sem imagens e substituí-las
    const userPlantsWithImages = userPlants.filter(hasValidImage);
    const withoutImages = userPlants.filter(plant => !hasValidImage(plant));
    
    if (withoutImages.length > 0) {
      // Substituir flores sem imagens
      replaceFlowersWithoutImages(withoutImages);
    }
    
    // Separar amostras e plantas adicionadas pelo utilizador
    const samples = userPlantsWithImages.filter(flower => {
      const idString = String(flower.id);
      return idString.startsWith('sample-');
    });
    
    const userAddedPlants = userPlantsWithImages.filter(flower => {
      const idString = String(flower.id);
      return idString.startsWith('user-');
    });
    
    // Guardar apenas plantas adicionadas pelo utilizador (não amostras)
    saveUserPlants(userAddedPlants);
    
    // Disparar sincronização após um atraso
    setTimeout(() => {
      triggerUserPlantsSync();
    }, 100);
  }, [flowers, replaceFlowersWithoutImages]);


  // Procurar flores da API ao inicializar (mas não guardar no localStorage)
  
  useEffect(() => {

    fetchRandomFlowers(null, fetchCount)
      .then((data) => {
        // Preservar todos os dados da API incluindo imagens, hierarquia taxonómica, etc.
     
        const mapped = data
          .filter(hasValidImage) // Apenas incluir flores com imagens válidas
          .map((flower) => ({
            ...flower,
            name: flower.common_name || "Unknown Specimen",
            common_name: flower.common_name || "Unknown Specimen",
            scientific: flower.scientific_name || "—",
            scientific_name: flower.scientific_name || "—",
            image: flower.default_image?.medium_url,
          }));

        console.log(`[useFlowers] A API retornou ${data.length} flores, ${mapped.length} com imagens`);

        // Não sobrescrever plantas do utilizador, apenas adicionar flores da API (não são guardadas no localStorage)
        setFlowers((prev) => {
          // Manter plantas do utilizador e amostras existentes, adicionar flores da API
          const userPlants = prev.filter(f => {
            const idString = String(f.id || '');
            return idString.startsWith('user-') || idString.startsWith('sample-');
          });
          return [...userPlants, ...mapped];
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar flores:', err);
        setError(err);
        setLoading(false);
      });
  }, [fetchCount]);

  
  // Adicionar uma nova flor à colecção
  
  const addFlower = useCallback((newFlower) => {
 
    if (!hasValidImage(newFlower)) {
      console.warn('[useFlowers] Não é possível adicionar flor sem imagem:', newFlower.name);
      alert("Por favor, carregue uma imagem para a sua planta antes de a adicionar à colecção.");
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

 
  // Remover uma flor por ID

  const removeFlower = useCallback((id) => {
    if (!id) return;
    
    const idString = String(id);
    
    // Se for uma amostra, marcá-la como eliminada
    if (idString.startsWith('sample-')) {
      const deleted = loadDeletedSamples();
      if (!deleted.includes(idString)) {
        deleted.push(idString);
        saveDeletedSamples(deleted);
      }
    }
    
    // Remover do estado
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
