import trunckImage from "../assets/img/Trunck.png";
import { useAuth } from "../firebase/auth";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <img src={trunckImage} alt="Trunck optique" className="trunck-logo" />
        </div>
        <div className="header-text">
          <h1>Configurateur de truncks optiques</h1>
          <p>Configurez votre trunck optique selon vos besoins spécifiques</p>
        </div>
        {user && (
          <div className="user-info">
            <div className="user-details">
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
