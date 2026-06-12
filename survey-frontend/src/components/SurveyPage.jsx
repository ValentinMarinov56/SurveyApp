import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import surveyService from '../services/surveys';
import TakeSurvey from './TakeSurvey';
import ShowSurvey from './ShowSurvey';

export default function SurveyPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [showTake, setShowTake] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await surveyService.getSurveyById(id);
        setSurvey(s);
      } catch (err) {
        alert('Failed to load survey');
        navigate('/');
      }
    };
    load();
  }, [id]);

  if (!survey) return <div>Loading...</div>;

  const handleClose = () => navigate('/');

  const handleSubmitResponses = async (updatedSurvey) => {
    try {
      await surveyService.updateSurvey(survey.id, updatedSurvey);
      alert('Thanks for your responses!');
      setShowTake(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to submit responses.');
    }
  }

  return (
    <div className="card card-survey">
      <div className="card-body">
        <h5 className="card-title survey-title">{survey.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted survey-creator">Made by {survey.creator.username}</h6>
        <div className="survey-actions mt-3">
          <button className="btn btn-accent me-2" onClick={() => setShowTake(true)}>Take Survey</button>
          <button className="btn btn-outline-light" onClick={() => { /* results are shown below */ }}>View Results</button>
        </div>
      </div>

      {showTake && (
        <TakeSurvey survey={survey} onClose={() => setShowTake(false)} onSubmit={handleSubmitResponses} />
      )}

      <ShowSurvey survey={survey} onClose={handleClose} />
    </div>
  );
}
