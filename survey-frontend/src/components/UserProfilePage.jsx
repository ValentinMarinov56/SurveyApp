import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import userService from '../services/users';
import { Survey } from './Survey';

export default function UserProfilePage({ user }) {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const fetchedUser = await userService.getUserById(id);
        if (isMounted) {
          setProfileUser(fetchedUser);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          alert('Failed to load user profile.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading profile...</div>;
  }

  if (!profileUser) {
    return <div className="text-center py-4">User not found.</div>;
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-outline-light">Back to gallery</Link>
        <span className="text-muted">Profile</span>
      </div>

      <div className="py-4">
        <h1 className="display-6 text-center fw-bold mb-0 text-white">{profileUser.username}'s Profile</h1>
      </div>

      <div className="mt-4">
        <h4 className="mb-3 text-center">Created Surveys</h4>
        {profileUser.surveys?.length ? (
          profileUser.surveys.map((survey) => (
            <div key={survey.id} className="mb-3">
              <Survey
                survey={{ ...survey, creator: { id: profileUser.id, username: profileUser.username } }}
                user={user}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-muted">This user hasn’t created any surveys yet.</p>
        )}
      </div>
    </div>
  );
}
