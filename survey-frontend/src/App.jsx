import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { CreateSurveyForm } from './components/CreateSurveyForm';
import { SurveyGallery } from './components/SurveyGallery';
import { Logout } from './components/Logout';
import surveyService from './services/surveys';
import { SignUpForm } from './components/SignUpForm';
import axios from 'axios';
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
  }, [setUser]);

  const Layout = ({ children }) => (
    <>
      <nav className="navbar navbar-expand navbar-custom">
        <div className="container">
          <span className="navbar-brand">Survey App</span>
          <div className="nav-right">
            {user ? <Logout setUser={setUser} /> : (
              <Toggable buttonLabel="Login">
                <LoginForm setUser={setUser} />
              </Toggable>
            )}
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="surveys-container">
          {user && <h1 className="mb-3 text-center">Welcome, {user.username}</h1>}
          {user && (
            <Toggable buttonLabel="Create Survey">
              <CreateSurveyForm />
            </Toggable>
          )}
          {children}
        </div>
      </main>
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><SurveyGallery user={user} /></Layout>} />
        <Route path="/surveys/:id" element={<Layout><SurveyPage user={user} /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

// lazy import SurveyPage to avoid circular issues
import SurveyPage from './components/SurveyPage';
    );
  }
}
