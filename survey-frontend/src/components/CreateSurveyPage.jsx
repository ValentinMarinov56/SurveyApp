import { Link, useNavigate } from 'react-router-dom';
import { CreateSurveyForm } from './CreateSurveyForm';

export default function CreateSurveyPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/" className="btn btn-outline-light">Back to gallery</Link>
        <h3 className="mb-0">Create Survey</h3>
      </div>

      <CreateSurveyForm onCreated={() => navigate('/', { replace: true })} />
    </div>
  );
}
