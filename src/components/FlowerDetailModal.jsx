// FlowerDetailModal.jsx - Widget modal que mostra informações detalhadas sobre flores
// Exibe: nome científico, nome comum, categoria taxonómica, estado de conservação, imagens
// Inclui o botão adicionar à minha coleção e favoritos
// Aprimorado com a API GBIF para informações adicionais

import { useState, useEffect } from 'react';
import { enrichFlowerWithGBIF } from '../lib/gbif';

export default function FlowerDetailModal({ flower, isOpen, onClose, onAddToCollection, isInCollection, onAddToMyFlowers, isInMyFlowers }) {
  const [gbifData, setGbifData] = useState(null);
  const [loadingGBIF, setLoadingGBIF] = useState(false);

  // Load GBIF data quando as plantas mudam
  useEffect(() => {
    if (isOpen && flower && flower.scientific_name) {
      setLoadingGBIF(true);
      enrichFlowerWithGBIF(flower)
        .then(data => {
          setGbifData(data);
          setLoadingGBIF(false);
        })
        .catch(err => {
          console.error('Error loading GBIF data:', err);
          setLoadingGBIF(false);
        });
    } else {
      setGbifData(null);
    }
  }, [isOpen, flower]);

  if (!isOpen || !flower) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleAddToCollection = () => {
    if (onAddToCollection) {
      console.log('[FlowerDetailModal] handleAddToCollection called, flower:', {
        name: flower?.common_name || flower?.name,
        scientific: flower?.scientific_name || flower?.scientific,
        hasDefaultImage: !!flower?.default_image,
        hasImage: !!flower?.image,
        defaultImageUrl: flower?.default_image?.medium_url,
        imageUrl: flower?.image
      });
      
      const added = onAddToCollection(flower);
      console.log('[FlowerDetailModal] onAddToCollection returned:', added);
      
      if (added) {
        console.log('[FlowerDetailModal] Successfully added to collection');
        // Could show a success message here
      } else {
        console.warn('[FlowerDetailModal] Failed to add to collection');
      }
    } else {
      console.warn('[FlowerDetailModal] onAddToCollection prop not provided');
    }
  };

  const handleAddToMyFlowers = () => {
    if (onAddToMyFlowers) {
      onAddToMyFlowers(flower);
    }
  };

  // construção da taxonomia hierarquica
  const taxonomicHierarchy = flower.taxonomic_hierarchy || [];
  const conservationStatus = [];
  
  if (flower.threatened) conservationStatus.push('Threatened');
  if (flower.endemic) conservationStatus.push('Endemic');
  if (flower.native) conservationStatus.push('Native');
  if (flower.introduced) conservationStatus.push('Introduced');
  
  const statusText = conservationStatus.length > 0 
    ? conservationStatus.join(', ') 
    : 'Not specified';

  // recolhe os nomes vernaculares
  const commonNames = gbifData?.vernacularNames || [];
  const englishNames = commonNames.filter(v => v.language === 'eng').map(v => v.vernacularName);
  const allCommonNames = [...new Set(commonNames.map(v => v.vernacularName))];

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      onKeyDown={handleEscape}
      tabIndex={-1}
    >
      <div className="modal-content" role="dialog" aria-labelledby="modal-title">
        {/* botão de fechar */}
        <button 
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>

        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {flower.common_name || flower.name || flower.scientific_name || flower.scientific || 'Unknown'}
          </h2>
          <p className="modal-subtitle">{flower.scientific_name || flower.scientific || ''}</p>
          
          {/* Adicionar nomes comuns */}
          {englishNames.length > 0 && (
            <p className="modal-common-names">
              Also known as: {englishNames.slice(0, 3).join(', ')}
              {englishNames.length > 3 && '...'}
            </p>
          )}
        </div>

      
        <div className="modal-actions-section">
          {/* Liked */}
          {onAddToCollection && (
            <>
              {!isInCollection ? (
                <button 
                  className="btn-swiss modal-add-btn"
                  onClick={handleAddToCollection}
                  type="button"
                >
                  ♥ Like <span>→</span>
                </button>
              ) : (
                <div className="modal-status-badge">
                  <span>✓ Liked</span>
                </div>
              )}
            </>
          )}
          
          {/* coleção pessoal */}
          {onAddToMyFlowers && (
            <>
              {!isInMyFlowers ? (
                <button 
                  className="btn-swiss modal-add-btn"
                  onClick={handleAddToMyFlowers}
                  type="button"
                >
                  Add to My Flowers <span>→</span>
                </button>
              ) : (
                <div className="modal-status-badge">
                  <span>✓ In My Flowers</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* galeria de imagens */}
        {(flower.all_images && flower.all_images.length > 0) || (gbifData?.media && gbifData.media.length > 0) ? (
          <div className="modal-images">
            <h3 className="modal-section-title">Images</h3>
            <div className="image-gallery">
              {/* Original images */}
              {flower.all_images?.map((img, idx) => (
                <div key={`orig-${idx}`} className="gallery-item">
                  <img 
                    src={img} 
                    alt={`${flower.common_name || flower.name || flower.scientific_name || flower.scientific || 'Flower'} - Image ${idx + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
              {/* imagens de GBIF  */}
              {gbifData?.media?.filter(m => m.type === 'StillImage').slice(0, 3).map((media, idx) => (
                <div key={`gbif-${idx}`} className="gallery-item">
                  <img 
                    src={media.url} 
                    alt={`${flower.common_name || flower.name || flower.scientific_name || 'Flower'} - GBIF Image ${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* grelha de informação*/}
        <div className="modal-info">
          {(taxonomicHierarchy.length > 0 || gbifData) && (
            <div className="info-section">
              <h3 className="modal-section-title">Taxonomic Category</h3>
              <div className="taxonomic-tree">
                {taxonomicHierarchy.map((level, idx) => (
                  <div key={idx} className="taxonomic-level">
                    <span className="taxonomic-rank">{level.rank}:</span>
                    <span className="taxonomic-name">{level.name}</span>
                  </div>
                ))}
                {gbifData && (
                  <>
                    {gbifData.phylum && !taxonomicHierarchy.some(t => t.rank === 'Phylum') && (
                      <div className="taxonomic-level">
                        <span className="taxonomic-rank">Phylum:</span>
                        <span className="taxonomic-name">{gbifData.phylum}</span>
                      </div>
                    )}
                    {gbifData.class && !taxonomicHierarchy.some(t => t.rank === 'Class') && (
                      <div className="taxonomic-level">
                        <span className="taxonomic-rank">Class:</span>
                        <span className="taxonomic-name">{gbifData.class}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {gbifData?.descriptions && gbifData.descriptions.length > 0 && (
            <div className="info-section">
              <h3 className="modal-section-title">Description</h3>
              <div className="gbif-descriptions">
                {gbifData.descriptions.slice(0, 2).map((desc, idx) => (
                  <div key={idx} className="description-item">
                    <p className="description-text">{desc.description}</p>
                    {desc.source && (
                      <p className="description-source">Source: {desc.source}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          
          <div className="info-section">
            <h3 className="modal-section-title">Conservation Status</h3>
            <p className="status-text">{statusText}</p>
            {gbifData?.threatStatus && gbifData.threatStatus.length > 0 && (
              <div className="gbif-threat-status">
                <p className="gbif-status-label">GBIF Status:</p>
                <ul className="gbif-status-list">
                  {gbifData.threatStatus.map((status, idx) => (
                    <li key={idx}>{status}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

  
          {gbifData && typeof gbifData.occurrenceCount === 'number' && (
            <div className="info-section">
              <h3 className="modal-section-title">Global Observations</h3>
              <p className="info-text">
                {gbifData.occurrenceCount.toLocaleString()} records worldwide
              </p>
              <p className="info-subtext">Data from GBIF (Global Biodiversity Information Facility)</p>
            </div>
          )}

  
          {flower.family || gbifData?.family ? (
            <div className="info-section">
              <h3 className="modal-section-title">Family</h3>
              <p className="info-text">{gbifData?.family || flower.family}</p>
            </div>
          ) : null}

          {flower.genus || gbifData?.genus ? (
            <div className="info-section">
              <h3 className="modal-section-title">Genus</h3>
              <p className="info-text">{gbifData?.genus || flower.genus}</p>
            </div>
          ) : null}

          {gbifData?.authors && (
            <div className="info-section">
              <h3 className="modal-section-title">Scientific Author</h3>
              <p className="info-text">{gbifData.authors}</p>
              {gbifData.year && (
                <p className="info-subtext">Described in {gbifData.year}</p>
              )}
            </div>
          )}

          {flower.country && (
            <div className="info-section">
              <h3 className="modal-section-title">Location</h3>
              <p className="info-text">{flower.country}</p>
            </div>
          )}

         
          {loadingGBIF && (
            <div className="info-section">
              <p className="info-subtext">Loading additional information...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
