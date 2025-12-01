//Grelha responsiva para organizar cartões das plantas
// Filtra plantas sem imagens (não cria cartões para elas)
// Layout adaptativo: 1 coluna (móvel), 2-3 colunas (tablet), 3-4 colunas (desktop)
import FlowerCard from './FlowerCard';
import Loader from './Loader';

function hasValidImage(flower) {
  const imageUrl = flower?.default_image?.medium_url || flower?.image;
  return Boolean(imageUrl && imageUrl.trim() !== '');
}

export default function FlowerGrid({ flowers, loading, onRemove, onCardClick, emptyMessage }) {
  if (loading) {
    return (
      <div className="grid-loader">
        <Loader />
      </div>
    );
  }

  const safeFlowers = Array.isArray(flowers) ? flowers : [];
  
  
  const visibleFlowers = safeFlowers.filter(flower => {
    if (!hasValidImage(flower)) {
      return false;
    }
    return true;
  });

  if (visibleFlowers.length === 0) {
    return (
      <div className="grid-empty">
        <p>{emptyMessage || 'No specimens found.'}</p>
      </div>
    );
  }

  return (
    <div className="flower-grid">
      {visibleFlowers.map((flower) => {
        const imageUrl = flower.default_image?.medium_url || flower.image;
        
        if (!imageUrl) {
          return null;
        }

        return (
          <FlowerCard
            key={flower.id}
            flower={{
              ...flower,
              // Normaliza propriedades de nome (API pode usar nomes diferentes)
              name: flower.common_name || flower.name,
              scientific: flower.scientific_name || flower.scientific,
              image: imageUrl,
            }}
            onRemove={onRemove}
            onClick={onCardClick}
          />
        );
      })}
    </div>
  );
}
