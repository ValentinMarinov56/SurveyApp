import { useState } from 'react';

export function Logout({ setUser }) {
  const [message, setMessage] = useState('');

  return (
    <div>
      <button
        className="btn btn-outline-light"
        onClick={() => {
          setUser(null);
          window.localStorage.removeItem('loggedSurveyappUser');
          setMessage('You have been logged out.');
        }}
      >
        Logout
      </button>
      {message && <p className="mt-2 text-muted">{message}</p>}
    </div>
  );
}