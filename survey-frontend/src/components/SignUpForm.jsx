import { use, useState } from 'react';
import signupService from '../services/signup';
import loginService from '../services/login';

export function SignUpForm({ setUser, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password.length < 3 || username.length < 3 || password.length > 50 || username.length > 50) {
      alert('Password and username must be at least 3 characters long and at most 50 characters long');
      return;
    }
    try {
      const newUser = {
        username, passwordHash: password
      };
      const createdUser = await signupService.signup(newUser);
      setUsername('');
      setPassword('');
      const user = await loginService.login({
        username: createdUser.username,
        password: password
      });
      window.localStorage.setItem('loggedSurveyappUser', JSON.stringify(user));
      setUser(user);
      window.location.reload();
    } catch (error) {
      //console.log('failed signing up');
    }
  };

  return (
    <div className="form-surface">
      <form onSubmit={handleSignUp}>
        <h5 className="mb-3">Create account</h5>
        <div className="mb-2">
          <label className="form-label">Username</label>
          <input className="form-control" type="text" name="username" value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input className="form-control" type="password" name="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-accent mt-2" type="submit">Sign up</button>
          {onCancel && (
            <button type="button" className="btn btn-outline-light mt-2" onClick={onCancel}>Back to login</button>
          )}
        </div>
      </form>
    </div>
  );
}