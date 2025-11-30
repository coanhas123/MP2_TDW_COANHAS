// Componente de carregamento - mostra animação enquanto dados são obtidos da API
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-flower">✿</div>
      </div>
      <p className="loader-text">Loading specimens...</p>
    </div>
  );
}
