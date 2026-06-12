import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import surveyService from '../services/surveys';
import ShowSurvey from './ShowSurvey';
import TakeSurvey from './TakeSurvey';

export default function SurveyPage({ user }) {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [showTakeSurvey, setShowTakeSurvey] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const s = await surveyService.getSurveyById(id);
        setSurvey(s);
      } catch (err) {
        console.error(err);
        alert('Failed to load survey.');
      }
    };
    fetch();
  }, [id]);

  if (!survey) return <div>Loading...</div>;

  return (
    <div className="survey-page container">
      <div className="mt-3 mb-3 d-flex justify-content-center">
        <Link to="/" className="btn btn-outline-light">Back to gallery</Link>
      </div>

      <h2 className="text-center">{survey.title}</h2>
      <h5 className="text-center text-muted">By {survey.creator?.username}</h5>
      <p className="text-center">{survey.description}</p>

      <div className="mt-3 mb-3 d-flex justify-content-center">
        <button className="btn btn-accent" onClick={() => setShowTakeSurvey(true)}>Take Survey</button>
      </div>

      <ShowSurvey survey={survey} onClose={() => {}} />

      {showTakeSurvey && <TakeSurvey survey={survey} onClose={() => setShowTakeSurvey(false)} onSubmit={() => { window.location.reload(); }} />}
    </div>
  );
}
