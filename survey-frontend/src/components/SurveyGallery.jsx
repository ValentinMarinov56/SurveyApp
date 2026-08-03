import { useEffect, useState } from "react";
import surveyService from "../services/surveys";
import { Survey } from "./Survey";

export function SurveyGallery({ user, searchQuery = '' }) {
  const [surveys, setSurveys] = useState([]);
  
  useEffect(() => {
    const fetchSurveys = async () => {
      const fetchedSurveys = await surveyService.getAll();
      setSurveys(fetchedSurveys);
    };
    fetchSurveys();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredSurveys = normalizedQuery
    ? surveys.filter((survey) => {
        const title = survey.title?.toLowerCase() ?? '';
        const creatorName = survey.creator?.username?.toLowerCase() ?? '';
        return title.includes(normalizedQuery) || creatorName.includes(normalizedQuery);
      })
    : surveys;

  const hasActiveSearch = normalizedQuery.length > 0;

  return (
    <div className="survey-gallery">
      <h2 className="mb-4 text-center">Survey Gallery</h2>
      {hasActiveSearch && filteredSurveys.length === 0 ? (
        <p className="text-center text-muted">Nothing found</p>
      ) : !hasActiveSearch && surveys.length === 0 ? (
        <p className="text-center text-muted">Searching...</p>
      ) : hasActiveSearch ? (
        filteredSurveys.map((survey) => (
          <div key={survey.id} className="mb-3 w-100">
            <Survey survey={survey} user={user} onRemoved={(id) => setSurveys(surveys.filter((s) => s.id !== id))} />
          </div>
        ))
      ) : (
        surveys.map((survey) => (
          <div key={survey.id} className="mb-3 w-100">
            <Survey survey={survey} user={user} onRemoved={(id) => setSurveys(surveys.filter((s) => s.id !== id))} />
          </div>
        ))
      )}
    </div>
  );
}