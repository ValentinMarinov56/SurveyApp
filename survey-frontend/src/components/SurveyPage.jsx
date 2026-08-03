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
  const [shareLabel, setShareLabel] = useState('Share');

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

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/surveys/${survey?.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: survey?.title,
          text: `Check out this survey: ${survey?.title}`,
          url: shareUrl,
        });
        setShareLabel('Shared');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareLabel('Copied');
      } else {
        window.prompt('Copy this link:', shareUrl);
        setShareLabel('Ready');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error(err);
        setShareLabel('Share');
      }
    }
    window.setTimeout(() => setShareLabel('Share'), 1500);
  };

  if (!survey) return <div>Loading...</div>;

  return (
    <div className="survey-page container">
      <div className="mt-3 mb-3 d-flex justify-content-center">
        <Link to="/" className="btn btn-outline-light">Back to gallery</Link>
      </div>

      <h2 className="text-center">{survey.title}</h2>
      <h5 className="text-center text-muted">
        By <Link to={`/users/${survey.creator?.id}`}>{survey.creator?.username}</Link>
      </h5>
      <p className="text-center">{survey.description}</p>

      <div className="mt-3 mb-3 d-flex justify-content-center gap-2">
        <button className="btn btn-accent" onClick={() => setShowTakeSurvey(true)}>Take Survey</button>
        <button className="btn btn-outline-light" onClick={handleShare}>{shareLabel}</button>
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
