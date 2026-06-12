import {useState} from 'react';

export default function ShowSurvey({survey, onClose}) {
    return (
        <div className="survey-view">
            <h2>{survey.title}</h2>
            <h4 className="survey-creator">made by {survey.creator?.username}</h4>
            <p className="survey-description">{survey.description}</p>
            {survey.questions?.map((q, qi) => (
                <fieldset key={qi} style={{ marginBottom: "1rem" }}>
                    <legend style={{ fontWeight: "bold" }}>{q.text}</legend>
                    {q.options?.map((opt, oi) => (
                        <label key={oi} style={{ display: "block", margin: "0.25rem 0" }}>
                            {opt.text} - answered {opt.timesAnswered} times
                        </label>
                     ))}
                </fieldset>
            ))}
            {onClose && (
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-outline-light" onClick={onClose}>
                    Close Survey
                </button>
              </div>
            )}
        </div>
    );
}