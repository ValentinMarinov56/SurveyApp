import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import surveyService from '../services/surveys';
import ShowSurvey from './ShowSurvey';
import TakeSurvey from './TakeSurvey';

export default function SurveyPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
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

      <div className="mt-3 mb-3 d-flex justify-content-center gap-2">
        <button className="btn btn-accent" onClick={() => setShowTakeSurvey(true)}>Take Survey</button>
        {user && survey.creator?.id === user.userId && (
          <button
            className="btn btn-danger"
            onClick={async () => {
              if (!window.confirm('Delete this survey? This action cannot be undone.')) return;
              try {
                const deleted = await surveyService.deleteSurvey(survey.id);
                if (deleted) {
                  alert('Survey deleted.');
                  navigate('/', { replace: true });
                } else {
                  alert('Failed to delete survey.');
                }
              } catch (err) {
                console.error(err);
                alert('Failed to delete survey.');
              }
            }}
          >
            Delete Survey
          </button>
        )}
      </div>

      {!showTakeSurvey && <ShowSurvey survey={survey} />}

      {showTakeSurvey && (
        <TakeSurvey
          survey={survey}
          onClose={() => setShowTakeSurvey(false)}
          onSubmit={async (updatedSurvey) => {
            try {
              const refreshed = await surveyService.updateSurvey(survey.id, updatedSurvey);
              setSurvey(refreshed || updatedSurvey);
              setShowTakeSurvey(false);
              //alert('Survey submitted successfully.');
            } catch (err) {
              console.error(err);
              //alert('Failed to submit survey responses.');
            }
          }}
        />
      )}
    </div>
  );
}
