import { useState } from "react";
import surveyService from "../services/surveys";

export function CreateSurveyForm({ onCreated }) {
  const [survey, setSurvey] = useState({
    Title: "",
    Questions: [],
  });

  const getQuestionType = (question) => {
    const rawType = question.QuestionType ?? question.questionType ?? "Single";
    return String(rawType).toLowerCase() === "multiple" ? "Multiple" : "Single";
  };

  const getMaxSelections = (question) => {
    const rawValue = question.MaxSelections ?? question.maxSelections;
    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return 1;
    }
    return Number(rawValue);
  };
  
  const addQuestion = () => {
    setSurvey({
      ...survey,
      Questions: [...survey.Questions, { Text: "", Options: [], QuestionType: "Single", MaxSelections: 1 }],
    });
  };

  const addOption = (questionIndex, optionText) => {
    const updatedQuestions = survey.Questions.map((question, index) =>
      index === questionIndex
        ? { ...question, Options: [...question.Options, { Text: optionText, timesAnswered: 0 }] }
        : question
    );
    setSurvey({ ...survey, Questions: updatedQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = survey.Questions.map((question, i) =>
      i === index ? { ...question, [field]: value } : question
    );
    setSurvey({ ...survey, Questions: updatedQuestions });
  };

  const handleQuestionTypeChange = (index, value) => {
    const updatedQuestions = survey.Questions.map((question, i) => {
      if (i !== index) {
        return question;
      }

      return {
        ...question,
        QuestionType: value,
        MaxSelections: value === "Multiple" ? (question.MaxSelections ?? question.maxSelections ?? 1) : 1,
      };
    });

    setSurvey({ ...survey, Questions: updatedQuestions });
  };

  const handleSurveySumbission = async () => {
    if (!validateSurvey()) {
      return;
    }
    try {
      await surveyService.createSurvey(survey);
      if (onCreated) {
        onCreated();
      } else {
        window.location.reload();
      }
    } catch (err) {
        console.error(err);
    }
  }

  const validateSurvey = () => {
    if (!survey.Title.trim() || survey.Title.length > 100) {
      alert('Survey title cannot be empty and must be at most 100 characters.');
      return;
    }
    if (survey.Questions.length === 0 || survey.Questions.length > 20) {
      alert('Survey must have at least 1 question and at most 20 questions.');
      return;
    }
    for (const question of survey.Questions) {
      if (!question.Text.trim() || question.Text.length > 200) {
        alert('Question text cannot be empty and must be at most 200 characters.');
        return;
      }
      if (question.Options.length === 0 || question.Options.length > 10) {
        alert('Each question must have at least one option and at most 10 options.');
        return;
      }

      const questionType = getQuestionType(question);
      if (questionType === 'Multiple') {
        const maxSelections = Number(getMaxSelections(question));
        if (!Number.isInteger(maxSelections) || maxSelections < 1 || maxSelections > question.Options.length) {
          alert('For multiple-answer questions, max selections must be a whole number between 1 and the number of options.');
          return;
        }
      }

      for (const option of question.Options) {
        if (!option.Text.trim() || option.Text.length > 100) {
          alert('Option text cannot be empty and must be at most 100 characters.');
          return;
        }
      }
    }
    return true;
  }
    return (
        <div>
            <h2>Create Survey</h2>
            <label>
                Title:
                <input
                    type="text"
                    value={survey.Title}
                    onChange={(e) => setSurvey({ ...survey, Title: e.target.value })}
                />
            </label>
            <h3>Questions</h3>
            {survey.Questions.map((question, index) => (
                <div key={index} className="question-container">
                    <label>
                        Question Text:
                        <input
                            type="text"
                            value={question.Text}
                            onChange={(e) => handleQuestionChange(index, "Text", e.target.value)}
                        />
                    </label>
                    
                    <br />
                    <label>
                        Answer Type:
                        <select value={getQuestionType(question)} onChange={(e) => handleQuestionTypeChange(index, e.target.value)}>
                            <option value="Single">Single answer</option>
                            <option value="Multiple">Multiple answers</option>
                        </select>
                    </label>

                    {getQuestionType(question) === "Multiple" && (
                        <label>
                            Max selections:
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={getMaxSelections(question)}
                                onChange={(e) => handleQuestionChange(index, "MaxSelections", Number(e.target.value))}
                            />
                        </label>
                    )}
                    <br />
                    <label>
                        Options:
                        <input
                            type="text"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addOption(index, e.target.value);
                                    e.target.value = "";
                                }
                            }}
                        />
                        Press Enter to add option
                    </label>
                    <ul>
                        {question.Options.map((option, optIndex) => (
                            <li 
                                key={optIndex} className="option-item">
                                <span>{option.Text}</span>
                                <button className="btn-delete-option" onClick={() => {
                                    const updatedQuestions = survey.Questions.map((q, i) => 
                                        i === index ? { ...q, Options: q.Options.filter((_, j) => j !== optIndex) } : q
                                    );
                                    setSurvey({ ...survey, Questions: updatedQuestions });
                                }}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <button className="btn-delete-question" onClick={() => {
                        const updatedQuestions = survey.Questions.filter((_, i) => i !== index);
                        setSurvey({ ...survey, Questions: updatedQuestions });
                    }}>Delete Question</button>
                </div>            
            ))}
            <button onClick={addQuestion}>Add Question</button>
            <button onClick={handleSurveySumbission}>Submit Survey</button>
        </div>
    );
}
