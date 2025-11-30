// Cabeçalho de navegação principal
// Mostra o logo e links de navegação com destaque para a página ativa
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Flourished </span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            My Collection 
          </Link>
          <Link
            to="/regions"
            className={`nav-link ${isActive("/regions") ? "active" : ""}`}
          >
            Regions
          </Link>
        </nav>
      </div>
    </header>
  );
}
