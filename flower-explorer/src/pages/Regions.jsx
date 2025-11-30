// Página do mapa-mundo com seleção de regiões geográficas
// Mostra mapa interativo com etiquetas clicáveis e lista de regiões disponíveis
import { Link } from "react-router-dom";
import { REGIONS } from "../lib/regions";
import "./Regions.css";

export default function Regions() {
  return (
    <div className="swiss-container">
      <header className="hero-swiss">
        <div className="hero-content">
          <h1 className="swiss-title">
            GLOBAL<br />ZONES<span className="dot">.</span>
          </h1>
          <div className="hero-meta">
            <p className="hero-subtitle">
              Select Geographic Origin<br />
              For Botanical Analysis
            </p>
          </div>
        </div>
        <hr className="swiss-divider" />
      </header>

      <div className="map-wrapper-swiss">
        <div className="map-container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2000px-World_map_-_low_resolution.svg.png"
            alt="World Map"
            className="world-map"
          />

          <Link className="map-label europe" to="/region/europa">
            <span className="label-line"></span>
            <span className="label-text">EUROPE (01)</span>
          </Link>

          <Link className="map-label asia" to="/region/asia">
            <span className="label-line"></span>
            <span className="label-text">ASIA (02)</span>
          </Link>

          <Link className="map-label africa" to="/region/africa">
            <span className="label-line"></span>
            <span className="label-text">AFRICA (03)</span>
          </Link>

          <Link className="map-label samerica" to="/region/south-america">
            <span className="label-line"></span>
            <span className="label-text">S. AMERICA (04)</span>
          </Link>

          <Link className="map-label camerica" to="/region/central-america">
            <span className="label-line"></span>
            <span className="label-text">C. AMERICA (05)</span>
          </Link>
        </div>
      </div>

      <div className="regions-wrapper">
        <h2 className="regions-title">Available Regions</h2>
        <p className="regions-description">
          Choose a continent to explore botanical species of that area.
        </p>

        <div className="regions-grid">
          {Object.entries(REGIONS).map(([key, region]) => (
            <Link key={key} to={`/region/${key}`} className="region-card">
              <span className="region-name">{region.name}</span>
              <span className="region-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
