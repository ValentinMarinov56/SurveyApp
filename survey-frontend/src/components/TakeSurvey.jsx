import { useState } from "react";

export default function TakeSurvey({ survey, onClose, onSubmit }) {
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex | optionIndex[] }

  const getQuestionType = (question) => {
    const rawType = question?.QuestionType ?? question?.questionType ?? "Single";
    return String(rawType).toLowerCase() === "multiple" ? "Multiple" : "Single";
  };

  const getMaxSelections = (question) => {
    const rawValue = question?.MaxSelections ?? question?.maxSelections;
    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return null;
    }
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const handleSingleChange = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleMultipleChange = (qIndex, optIndex, question) => {
    const maxSelections = getMaxSelections(question);

    setAnswers((prev) => {
      const currentSelection = Array.isArray(prev[qIndex]) ? prev[qIndex] : [];
      const isSelected = currentSelection.includes(optIndex);

      if (!isSelected && maxSelections && currentSelection.length >= maxSelections) {
        alert(`You can only select up to ${maxSelections} options for this question.`);
        return prev;
      }

      const nextSelection = isSelected
        ? currentSelection.filter((value) => value !== optIndex)
        : [...currentSelection, optIndex];

      return { ...prev, [qIndex]: nextSelection };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = JSON.parse(JSON.stringify(survey));

      Object.entries(answers).forEach(([qIdxStr, selectedValues]) => {
        const qIdx = Number(qIdxStr);
        if (!Number.isFinite(qIdx)) {
          return;
        }

        const selectedOptions = Array.isArray(selectedValues) ? selectedValues : [selectedValues];
        selectedOptions.forEach((optIdx) => {
          const option = updated.questions?.[qIdx]?.options?.[optIdx];
          if (option) {
            option.timesAnswered += 1;
          }
        });
      });

      await onSubmit(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to submit responses.");
    }
  };

  return (
    <div className="take-survey" style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "1rem" }}>
      <h3>Take: {survey.title}</h3>
      <form onSubmit={handleSubmit}>
        {survey.questions?.map((q, qi) => {
          const questionType = getQuestionType(q);
          const selectedValues = answers[qi];

          return (
            <fieldset key={qi} style={{ marginBottom: "1rem" }}>
              <legend style={{ fontWeight: "bold" }}>{q.text}</legend>
              {q.options?.map((opt, oi) => (
                <label key={oi} style={{ display: "block", margin: "0.25rem 0" }}>
                  <input
                    type={questionType === "Multiple" ? "checkbox" : "radio"}
                    name={`q-${qi}`}
                    value={oi}
                    checked={questionType === "Multiple"
                      ? Array.isArray(selectedValues) && selectedValues.includes(oi)
                      : selectedValues === oi}
                    onChange={() => questionType === "Multiple"
                      ? handleMultipleChange(qi, oi, q)
                      : handleSingleChange(qi, oi)}
                  />
                  {' '}
                  {opt.text}
                </label>
              ))}
            </fieldset>
          );
        })}

        <button type="submit">
          Submit
        </button>
        <button type="button" style={{ marginLeft: "0.5rem" }} onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}
