import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import surveyService from "../services/surveys";
import TakeSurvey from "./TakeSurvey";
import ShowSurvey from "./ShowSurvey";

const Survey = ({ survey, user, onRemoved }) => {
    const [showTakeSurvey, setShowTakeSurvey] = useState(false);
    const [surveyToTake, setSurveyToTake] = useState(null);

    const [showViewResults, setShowViewResults] = useState(false);
    const [surveyToView, setSurveyToView] = useState(null);

    const navigate = useNavigate();

    const HandleSurveyViewing = () => {
        navigate(`/surveys/${survey.id}`);
    };
    const HandleSurveyTaking = () => {
        navigate(`/surveys/${survey.id}`);
    };

    const handleCloseTakeSurvey = () => {
        setShowTakeSurvey(false);
        setSurveyToTake(null);
    }

    const handleCloseViewResults = () => {
        setShowViewResults(false);
        setSurveyToView(null);
    }

    const handleSubmitResponses = async (updatedSurvey) => {
        try {
            await surveyService.updateSurvey(survey.id, updatedSurvey);
            alert('Thanks for your responses!');
            handleCloseTakeSurvey();
        } catch (err) {
            console.error(err);
            alert('Failed to submit responses.');
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this survey? This action cannot be undone.')) return;
        try {
            const success = await surveyService.deleteSurvey(survey.id);
            if (success) {
                alert('Survey deleted.');
                if (onRemoved) onRemoved(survey.id);
            } else {
                alert('Failed to delete survey. You may not be the creator.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete survey.');
        }
    }

    return (
        <div className="card card-survey">
            <div className="card-body">
                <h5 className="card-title survey-title">{survey.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted survey-creator">Made by {survey.creator.username}</h6>
                <div className="survey-actions mt-3">
                    <button className="btn btn-accent me-2" onClick={HandleSurveyTaking}>Take Survey</button>
                    <button className="btn btn-outline-light me-2" onClick={HandleSurveyViewing}>View Results</button>
                    {user && user.userId === survey.creator.id && (
                        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    )}
                </div>
            </div>

            {/* navigation-based page now handles viewing and taking */}
        </div>
    );
}

export { Survey };