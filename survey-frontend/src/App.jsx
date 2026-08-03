import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Routes, Route, useNavigate } from 'react-router-dom';
import SurveyPage from './components/SurveyPage';
import { LoginForm } from './components/LoginForm';
import { SurveyGallery } from './components/SurveyGallery';
import { Logout } from './components/Logout';
import surveyService from './services/surveys';
import axios from 'axios';
import './styles/main.css';
import Toggable from './components/Toggable';
import UserProfilePage from './components/UserProfilePage';
import CreateSurveyPage from './components/CreateSurveyPage';

function HomePage({ user, searchQuery }) {
  return (
    <>
      {user && <h1 className="mb-3 text-center">Welcome, {user.username}</h1>}
      <SurveyGallery user={user} searchQuery={searchQuery} />
    </>
  );
}

function AppContent() {
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSurveyappUser');
    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON);
      surveyService.setToken(storedUser.token);
      return storedUser;
    }
    return null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      resp => resp,
      error => {
        if (error.response && error.response.status === 401) {
          window.localStorage.removeItem('loggedSurveyappUser');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-custom">
        <div className="container navbar-split-layout">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand text-decoration-none">Survey App</Link>
          </div>

          <div className="navbar-center">
            <form onSubmit={handleSearchSubmit} className="navbar-search-form">
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search surveys or creators"
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
              />
            </form>
          </div>

          <div className="navbar-right">
            {user ? (
              <>
                <Link to="/create-survey" className="btn btn-outline-light">
                  Create Survey
                </Link>
                <Link to={`/users/${user.userId ?? user.id}`} className="btn btn-outline-light">
                  Profile
                </Link>
                <Logout setUser={setUser} />
              </>
            ) : (
              <Toggable buttonLabel="Login">
                <LoginForm setUser={setUser} />
              </Toggable>
            )}
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="surveys-container">
          <Routes>
            <Route path="/" element={<HomePage user={user} searchQuery={searchQuery} />} />
            <Route path="/surveys/:id" element={<SurveyPage user={user} />} />
            <Route path="/users/:id" element={<UserProfilePage user={user} />} />
            <Route path="/create-survey" element={user ? <CreateSurveyPage /> : <HomePage user={user} searchQuery={searchQuery} />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
