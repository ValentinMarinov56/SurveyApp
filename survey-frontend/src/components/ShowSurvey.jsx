import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const chartColors = ['#64b5f6', '#ffd479', '#4dd0a5', '#ff8a65', '#b388ff', '#f06292'];

export default function ShowSurvey({ survey, onClose }) {
    const [showCharts, setShowCharts] = useState(false);

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

            {survey.questions?.length > 0 && (
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-accent" onClick={() => setShowCharts((prev) => !prev)}>
                        {showCharts ? 'Hide pie charts' : 'Show pie charts'}
                    </button>
                </div>
            )}

            {showCharts && (
                <div className="mt-4">
                    {survey.questions?.map((q, qi) => {
                        const chartData = (q.options || []).map((opt, index) => ({
                            name: opt.text,
                            value: Number(opt.timesAnswered || 0),
                            color: chartColors[index % chartColors.length]
                        }));

                        return (
                            <div key={qi} className="question-chart-card">
                                <h5>{q.text}</h5>
                                <div style={{ width: '100%', height: 240 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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