import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyPage from './components/SurveyPage';
import { LoginForm } from './components/LoginForm';
import { CreateSurveyForm } from './components/CreateSurveyForm';
import { SurveyGallery } from './components/SurveyGallery';
import { Logout } from './components/Logout';
import surveyService from './services/surveys';
import axios from 'axios';
import './styles/main.css';
import Toggable from './components/Toggable';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSurveyappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      surveyService.setToken(user.token);
    }
  }, []);

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

  const HomePage = () => (
    <>
      {user && <h1 className="mb-3 text-center">Welcome, {user.username}</h1>}
      {user && (
        <Toggable buttonLabel="Create Survey">
          <CreateSurveyForm />
        </Toggable>
      )}
      <SurveyGallery user={user} />
    </>
  );

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-custom">
        <div className="container">
          <span className="navbar-brand">Survey App</span>
          <div className="nav-right">
            {user ? (
              <Logout setUser={setUser} />
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
            <Route path="/" element={<HomePage />} />
            <Route path="/surveys/:id" element={<SurveyPage user={user} />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}
