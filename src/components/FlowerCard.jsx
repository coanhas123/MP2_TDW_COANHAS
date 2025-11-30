// Componente de cartão individual de flor
// Exibe imagem, nome comum, nome científico e família
// Clicável para abrir modal de detalhes; opcionalmente pode ter botão de remoção
import { useState } from 'react';

export default function FlowerCard({ flower, onRemove, onClick }) {
  const [imageError, setImageError] = useState(false);
  
  const {
    id,
    name = 'Specimen',
    scientific = '—',
    image,
    family = null,
  } = flower;

  // Verifica várias propriedades possíveis (estrutura da API pode variar)
  const imageUrl = image || flower?.default_image?.medium_url || flower?.default_image?.url;

  const handleRemove = (e) => {
    e.stopPropagation(); // Evita que o clique no botão abra o modal
    onRemove?.(id);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(flower);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <article 
      className="flower-card" 
      tabIndex="0"
      onClick={handleCardClick}
      role="button"
      aria-label={`View details for ${name}`}
    >
      {/* Remove Button (only shown if onRemove is provided) */}
      {onRemove && (
        <button
          className="card-remove"
          onClick={handleRemove}
          aria-label={`Remove ${name}`}
          type="button"
        >
          <span aria-hidden="true">×</span>
        </button>
      )}

      {/* Image Section */}
      <div className="card-image">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={name} 
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="card-no-image">
            <span>NO IMAGE</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="card-content">
        {/* Meta: Family */}
        <div className="card-meta">
          {family && <span className="card-family">{family}</span>}
        </div>

        {/* Flower Name */}
        <h3 className="card-title">{name}</h3>

        {/* Scientific Name */}
        <p className="card-scientific">{scientific}</p>
      </div>
    </article>
  );
}
