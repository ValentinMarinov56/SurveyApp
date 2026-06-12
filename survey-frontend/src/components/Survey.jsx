import { useState } from "react";
import surveyService from "../services/surveys";
import TakeSurvey from "./TakeSurvey";
import ShowSurvey from "./ShowSurvey";

const Survey = ({ survey, user, onRemoved }) => {
    const [showTakeSurvey, setShowTakeSurvey] = useState(false);
    const [surveyToTake, setSurveyToTake] = useState(null);

    const [showViewResults, setShowViewResults] = useState(false);
    const [surveyToView, setSurveyToView] = useState(null);

    const HandleSurveyViewing = async () => {
        try {
            const fetched = await surveyService.getSurveyById(survey.id);
            setSurveyToView(fetched);
            setShowViewResults(true);
        }
        catch (error) {
            //console.log('failed to view survey results'); // remove later
            //console.log(error);
            alert('Failed to load survey results.');
        }
    };
    const HandleSurveyTaking = async () => {
        try {
            const fetched = await surveyService.getSurveyById(survey.id);
            setSurveyToTake(fetched);
            setShowTakeSurvey(true);
        }
        catch (error) {
            //console.log('failed to take survey'); // remove later
            //console.log(error);
            alert('Failed to load survey.');
        }
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

            {showTakeSurvey && surveyToTake && (
                <TakeSurvey survey={surveyToTake} onClose={handleCloseTakeSurvey} onSubmit={handleSubmitResponses} />
            )}       
            {showViewResults && surveyToView && (
                <ShowSurvey survey={surveyToView} onClose={handleCloseViewResults}/>
            )}
        </div>
    );
}

export { Survey };