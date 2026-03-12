import { use, useState } from 'react';
import loginService from '../services/login';
import surveyService from '../services/surveys';
import { SignUpForm } from './SignUpForm';

export function LoginForm({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username, password
      });
      window.localStorage.setItem('loggedSurveyappUser', JSON.stringify(user));
      surveyService.setToken(user.token);
      //console.log(user.token); // remove later
      setUser(user);
      setUsername('');
      setPassword('');
      //console.log('logged in');
    } catch (error) {
      //console.log('failed loggin in');
    }
  };

  return (
    <div className="form-surface">
      {!showSignUp ? (
        <>
          <form onSubmit={handleLogin}>
            <h4 className="mb-3">Login</h4>
            <div className="mb-2">
              <label className="form-label">Username</label>
              <input className="form-control" type="text" name="username" value={username} onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" name="password" value={password} onChange={({ target }) => setPassword(target.value)} />
            </div>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-accent" type="submit">Log in</button>
            </div>
          </form>

          <div className="mt-3">
            <p className="mb-0 muted">Don't have an account? <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => setShowSignUp(true)}>Create a new one</button></p>
          </div>
        </>
      ) : (
        <div>
          <SignUpForm setUser={setUser} onCancel={() => setShowSignUp(false)} />
        </div>
      )}
    </div>
  );
}
