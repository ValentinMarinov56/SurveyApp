import { useState } from "react";

export default function TakeSurvey({ survey, onClose, onSubmit }) {
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }

  const handleChange = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
    //console.log(answers)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a deep copy so we don't mutate props
      const updated = JSON.parse(JSON.stringify(survey));

      Object.entries(answers).forEach(([qIdxStr, optIdx]) => {
        const qIdx = Number(qIdxStr);
        if (Number.isFinite(qIdx)) {
          const option = updated.questions[qIdx]?.options?.[optIdx];
          if (option) {
            option.timesAnswered += 1;
          }
        }
      });

      await onSubmit(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to submit responses.");
  };
}

  return (
    <div className="take-survey" style={{ border: "1px solid #ddd", padding: "1rem", marginTop: "1rem" }}>
      <h3>Take: {survey.title}</h3>
      <form onSubmit={handleSubmit}>
        {survey.questions?.map((q, qi) => (
          <fieldset key={qi} style={{ marginBottom: "1rem" }}>
            <legend style={{ fontWeight: "bold" }}>{q.text}</legend>
            {q.options?.map((opt, oi) => (
              <label key={oi} style={{ display: "block", margin: "0.25rem 0" }}>
                <input
                  type="radio"
                  name={`q-${qi}`}
                  value={oi}
                  checked={answers[qi] === oi}
                  onChange={() => handleChange(qi, oi)}
                />
                {' '}
                {opt.text}
              </label>
            ))}
          </fieldset>
        ))}

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
