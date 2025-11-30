// FlowerDetailModal.jsx - Widget modal que mostra informações detalhadas sobre flores
// Exibe: nome científico, nome comum, categoria taxonómica, estado de conservação, imagens
// Inclui o botão «Adicionar à minha coleção» para favoritos
// Aprimorado com a API GBIF para informações adicionais
// Inclui informações sobre cuidados com as plantas

import { useState, useEffect } from 'react';
import { enrichFlowerWithGBIF } from '../lib/gbif';
import { getPlantCareInfo } from '../lib/plantCare';

export default function FlowerDetailModal({ flower, isOpen, onClose, onAddToCollection, isInCollection, onAddToMyFlowers, isInMyFlowers }) {
  const [gbifData, setGbifData] = useState(null);
  const [loadingGBIF, setLoadingGBIF] = useState(false);

  // Load GBIF data when flower changes
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
      const added = onAddToCollection(flower);
      if (added) {
        // Could show a success message here
      }
    }
  };

  const handleAddToMyFlowers = () => {
    if (onAddToMyFlowers) {
      onAddToMyFlowers(flower);
    }
  };

  // Build taxonomic hierarchy
  const taxonomicHierarchy = flower.taxonomic_hierarchy || [];
  const conservationStatus = [];
  
  if (flower.threatened) conservationStatus.push('Threatened');
  if (flower.endemic) conservationStatus.push('Endemic');
  if (flower.native) conservationStatus.push('Native');
  if (flower.introduced) conservationStatus.push('Introduced');
  
  const statusText = conservationStatus.length > 0 
    ? conservationStatus.join(', ') 
    : 'Not specified';

  // Get vernacular names (common names) from GBIF
  const commonNames = gbifData?.vernacularNames || [];
  const englishNames = commonNames.filter(v => v.language === 'eng').map(v => v.vernacularName);
  const allCommonNames = [...new Set(commonNames.map(v => v.vernacularName))];

  // Get plant care information
  const plantCare = getPlantCareInfo(flower);

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      onKeyDown={handleEscape}
      tabIndex={-1}
    >
      <div className="modal-content" role="dialog" aria-labelledby="modal-title">
        {/* Close Button */}
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
          
          {/* Additional Common Names from GBIF */}
          {englishNames.length > 0 && (
            <p className="modal-common-names">
              Also known as: {englishNames.slice(0, 3).join(', ')}
              {englishNames.length > 3 && '...'}
            </p>
          )}
        </div>

        {/* Action Buttons - After name, before images */}
        <div className="modal-actions-section">
          {/* Like Button (Favorites) */}
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
          
          {/* Add to My Flowers Button (Personal Collection) */}
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

        {/* Images Gallery */}
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
              {/* GBIF media images */}
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

        {/* Information Grid */}
        <div className="modal-info">
          {/* Taxonomic Category */}
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
                {/* GBIF taxonomic information (if available and different) */}
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

          {/* Plant Care Information */}
          <div className="info-section">
            <h3 className="modal-section-title">Plant Care</h3>
            <div className="plant-care-grid">
              <div className="care-item">
                <span className="care-label">Watering:</span>
                <span className="care-value">{plantCare.watering}</span>
              </div>
              <div className="care-item">
                <span className="care-label">Light:</span>
                <span className="care-value">{plantCare.light}</span>
              </div>
              <div className="care-item">
                <span className="care-label">Soil:</span>
                <span className="care-value">{plantCare.soil}</span>
              </div>
              <div className="care-item">
                <span className="care-label">Temperature:</span>
                <span className="care-value">{plantCare.temperature}</span>
              </div>
              <div className="care-item">
                <span className="care-label">Fertilization:</span>
                <span className="care-value">{plantCare.fertilization}</span>
              </div>
              <div className="care-item">
                <span className="care-label">Pruning:</span>
                <span className="care-value">{plantCare.pruning}</span>
              </div>
            </div>
            <p className="care-source">{plantCare.source}</p>
          </div>

          {/* Species Descriptions from GBIF */}
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

          {/* Conservation Status */}
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

          {/* Occurrence Data from GBIF */}
          {gbifData && typeof gbifData.occurrenceCount === 'number' && (
            <div className="info-section">
              <h3 className="modal-section-title">Global Observations</h3>
              <p className="info-text">
                {gbifData.occurrenceCount.toLocaleString()} records worldwide
              </p>
              <p className="info-subtext">Data from GBIF (Global Biodiversity Information Facility)</p>
            </div>
          )}

          {/* Additional Info */}
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

          {/* Loading indicator for GBIF */}
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
