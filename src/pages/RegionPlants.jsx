// Página que exibe flores de uma região específica
// Carrega dados da API iNaturalist e permite adicionar flores à coleção pessoal ou favoritos
import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import FlowerGrid from "../components/FlowerGrid";
import FlowerDetailModal from "../components/FlowerDetailModal";
import Loader from "../components/Loader";
import { fetchRegionPlants, REGIONS } from "../lib/regions";
import useFavorites from "../hooks/useFavorites";
import useFlowers from "../hooks/useFlowers";

import "./RegionPlants.css";

function hasValidImage(flower) {
  const imageUrl = flower?.default_image?.medium_url || flower?.image;
  return Boolean(imageUrl && imageUrl.trim() !== '');
}

export default function RegionPlants() {
  const { region } = useParams();
  const location = useLocation();
  const [flowers, setFlowers] = useState([]);
  const [allFlowers, setAllFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { addFavorite, isFavorite, reloadFavorites } = useFavorites();
  const { addFlower, flowers: userFlowers } = useFlowers(0);

  const regionData = REGIONS[region];

  // Recarrega favoritos ao mudar de rota
  useEffect(() => {
    reloadFavorites();
  }, [location.pathname, reloadFavorites]);

  // Carrega flores iniciais da região
  useEffect(() => {
    async function loadFlowers() {
      try {
        setLoading(true);
        setPage(1);
        const data = await fetchRegionPlants(region, null, "all", 1);
        const flowersWithImages = data.filter(hasValidImage);
        
        setAllFlowers(flowersWithImages);
        setFlowers(flowersWithImages);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching flower data.");
        setAllFlowers([]);
        setFlowers([]);
      } finally {
        setLoading(false);
      }
    }
    loadFlowers();
  }, [region]);

  // Carrega mais 20 flores aleatórias únicas ao clicar em "See More"
  const handleLoadMore = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      let attempts = 0;
      const maxAttempts = 15;
      let totalNewFlowers = [];
      const existingNames = new Set(allFlowers.map(f => f.scientific_name));
      
      // Começa numa página aleatória e continua até obter 20 flores únicas
      const startPage = page + 1 + Math.floor(Math.random() * 10);
      let currentPage = startPage;
      
      while (totalNewFlowers.length < 20 && attempts < maxAttempts) {
        try {
          // Ignora cache para obter dados novos a cada vez
          const data = await fetchRegionPlants(region, null, "all", currentPage, true);
          
          if (!data || data.length === 0) {
            currentPage++;
            attempts++;
            continue;
          }
          
          const flowersWithImages = data.filter(hasValidImage);
          // Filtra duplicados (espécies que já temos)
          const newFlowers = flowersWithImages.filter(f => {
            return f && f.scientific_name && !existingNames.has(f.scientific_name);
          });
          
          if (newFlowers.length > 0) {
            totalNewFlowers.push(...newFlowers);
            newFlowers.forEach(f => {
              if (f && f.scientific_name) {
                existingNames.add(f.scientific_name);
              }
            });
          }
        } catch (pageError) {
          console.error(`Error fetching page ${currentPage}:`, pageError);
        }
        
        currentPage++;
        attempts++;
        
        // Pequeno atraso para não sobrecarregar a API
        if (attempts < maxAttempts && totalNewFlowers.length < 20) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      if (totalNewFlowers.length > 0) {
        const shuffled = totalNewFlowers.sort(() => Math.random() - 0.5);
        setAllFlowers(prev => [...prev, ...shuffled]);
        setFlowers(prev => [...prev, ...shuffled]);
        setPage(currentPage - 1);
      } else {
        setPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error loading more flowers:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCardClick = (flower) => {
    setSelectedFlower(flower);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlower(null);
  };

  const handleAddToCollection = (flower) => {
    const added = addFavorite(flower);
    if (added) {
      setTimeout(() => reloadFavorites(), 200);
    }
    return added;
  };

  const handleAddToMyFlowers = (flower) => {
    const isAlreadyAdded = userFlowers.some(f => {
      const idString = String(f.id || '');
      return idString.startsWith('user-') && f.scientific_name === flower.scientific_name;
    });
    
    if (isAlreadyAdded) {
      return;
    }
    
    const flowerToAdd = {
      ...flower,
      id: `user-${Date.now()}`,
      name: flower.common_name || flower.name || "Unknown",
      common_name: flower.common_name || flower.name || "Unknown",
      scientific: flower.scientific_name || "—",
      scientific_name: flower.scientific_name || "—",
      image: flower.default_image?.medium_url || flower.image,
    };
    
    addFlower(flowerToAdd);
  };

  const isInMyFlowers = (flower) => {
    if (!flower) return false;
    return userFlowers.some(f => {
      const idString = String(f.id || '');
      return idString.startsWith('user-') && f.scientific_name === flower.scientific_name;
    });
  };


  if (loading) {
    return (
      <div className="swiss-container">
        <div className="region-loader">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="swiss-container">
        <div className="region-error">
          <h1 className="swiss-title">ERROR<span className="dot">.</span></h1>
          <p className="error-message">{error}</p>
          <Link to="/" className="btn-swiss">
            Back to Index <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="swiss-container">
      {/* Region Header */}
      <header className="hero-swiss">
        <div className="hero-content">
          <h1 className="swiss-title">
            {regionData?.name || region}<span className="dot">.</span>
          </h1>
          <div className="hero-meta">
            <p className="hero-subtitle">
              Flower Collection
              <br />
              {flowers.length} Species
            </p>
            <Link to="/regions" className="btn-swiss">
              All Regions <span>→</span>
            </Link>
          </div>
        </div>
        <hr className="swiss-divider" />
      </header>

{/* Flower Grid - Already filtered to only include flowers with images */}
      <FlowerGrid
        flowers={flowers}
        loading={false}
        onCardClick={handleCardClick}
        emptyMessage="No flowers found in archive."
      />

      {/* Load More Button */}
      {allFlowers.length > 0 && (
        <div className="load-more-container">
          <button 
            onClick={handleLoadMore} 
            className="btn-swiss load-more-btn"
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'See More'}
            {!loadingMore && <span>→</span>}
          </button>
        </div>
      )}

      {/* Flower Detail Modal */}
      <FlowerDetailModal
        flower={selectedFlower}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCollection={handleAddToCollection}
        isInCollection={selectedFlower ? isFavorite(selectedFlower) : false}
        onAddToMyFlowers={handleAddToMyFlowers}
        isInMyFlowers={selectedFlower ? isInMyFlowers(selectedFlower) : false}
      />
    </div>
  );
}
