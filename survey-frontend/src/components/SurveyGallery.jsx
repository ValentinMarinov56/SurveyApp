import { useEffect, useState } from "react";
import surveyService from "../services/surveys";
import { Survey } from "./Survey";

export function SurveyGallery({ user }) {
  const [surveys, setSurveys] = useState([]);
  
  useEffect(() => {
    const fetchSurveys = async () => {
      const fetchedSurveys = await surveyService.getAll();
      setSurveys(fetchedSurveys);
    };
    fetchSurveys();
  }, []);
    return (
      <div className="survey-gallery">
        <h2 className="mb-4 text-center">Survey Gallery</h2>
        {surveys.map(survey => (
          <div key={survey.id} className="mb-3 w-100">
            <Survey survey={survey} user={user} onRemoved={(id) => setSurveys(surveys.filter(s => s.id !== id))} />
          </div>
        ))}
      </div>
    );
}