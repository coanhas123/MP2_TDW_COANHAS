// Componente principal da aplicação
// Configura o roteamento e gestão de estado global
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

import Header from "./components/Header";
import FlowerGrid from "./components/FlowerGrid";
import FlowerDetailModal from "./components/FlowerDetailModal";
import AddPlantForm from "./components/AddPlantForm";
import Regions from "./pages/Regions";
import RegionPlants from "./pages/RegionPlants";
import useFlowers from "./hooks/useFlowers";
import useFavorites from "./hooks/useFavorites";

// Verifica se uma flor tem imagem válida (verifica diferentes estruturas da API)
function hasValidImage(flower) {
  const imageUrl = flower?.default_image?.medium_url || flower?.image;
  return Boolean(imageUrl && imageUrl.trim() !== '');
}

// Página inicial - Coleção pessoal do utilizador
// Mostra plantas pessoais (adicionadas via formulário) e flores favoritas (das regiões)
function Home() {
  const location = useLocation();
  const { flowers, loading, addFlower, removeFlower } = useFlowers(8);
  const { favorites, addFavorite, removeFavorite, isFavorite, reloadFavorites } = useFavorites();
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' ou 'liked'

  // Recarrega favoritos ao navegar para a página inicial (sincroniza com outras abas)
  useEffect(() => {
    if (location.pathname === '/') {
      reloadFavorites();
    }
  }, [location.pathname, reloadFavorites]);

  const handleCardClick = (flower) => {
    setSelectedFlower(flower);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlower(null);
  };

  const handleAddToCollection = (flower) => {
    return addFavorite(flower);
  };

  // Filtra apenas plantas pessoais (IDs que começam com 'user-' ou 'sample-')
  const userPlants = flowers.filter(flower => {
    if (!flower.id) return false;
    const idString = String(flower.id);
    const isUserPlant = idString.startsWith('user-') || idString.startsWith('sample-');
    return isUserPlant && hasValidImage(flower);
  });

  // Determina quais flores mostrar conforme o filtro ativo
  const displayedFlowers = filter === 'liked' 
    ? favorites.filter(hasValidImage)
    : userPlants;

  // Handler de remoção funciona para ambas as coleções
  const handleRemove = filter === 'all' ? removeFlower : (id) => removeFavorite(id);

  return (
    <div className="swiss-container">
      <section className="hero-swiss">
        <div className="hero-content">
          <h1 className="swiss-title">
            MY<span className="dot">.</span>
            <br />
            COLLECTION
          </h1>
          <div className="hero-meta">
            <p className="hero-subtitle">
              Personal Plant Catalog
              <br />
              {filter === 'liked' 
                ? `${favorites.filter(hasValidImage).length} Favorite${favorites.filter(hasValidImage).length !== 1 ? 's' : ''}`
                : `${userPlants.length} ${userPlants.length === 1 ? 'Plant' : 'Plants'}`
              }
            </p>
            <Link to="/regions" className="btn-swiss">
              Explore Regions <span>→</span>
            </Link>
          </div>
        </div>
        <hr className="swiss-divider" />
      </section>

      <div className="collection-filters">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          type="button"
        >
          My Flowers
        </button>
        <button
          className={`filter-tab ${filter === 'liked' ? 'active' : ''}`}
          onClick={() => setFilter('liked')}
          type="button"
        >
          Liked
        </button>
      </div>

      <FlowerGrid
        flowers={displayedFlowers}
        loading={loading}
        onRemove={handleRemove}
        onCardClick={handleCardClick}
        emptyMessage={
          filter === 'liked'
            ? "You haven't liked any flowers yet. Explore regions and add flowers to your collection!"
            : "Your collection is empty. Add your first plant below!"
        }
      />

      {filter === 'all' && (
        <>
          <hr className="swiss-divider" />
          <div className="add-form-container">
            <AddPlantForm onAddPlant={addFlower} />
          </div>
        </>
      )}

      <FlowerDetailModal
        flower={selectedFlower}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCollection={handleAddToCollection}
        isInCollection={selectedFlower ? isFavorite(selectedFlower) : false}
      />
    </div>
  );
}

// Componente raiz - Configura roteamento da aplicação
// Rotas: "/" (coleção), "/regions" (mapa), "/region/:region" (flores da região)
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />
        <main className="swiss-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/region/:region" element={<RegionPlants />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
