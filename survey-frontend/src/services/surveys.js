import axios from "axios";
const baseUrl = '/api/survey';
let token = null;

const setToken = (newToken) => {
    token = 'Bearer ' + newToken;
}

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
}

const getSurveyById = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
}

const createSurvey = async (surveyData) => {
    const config = token ? { headers: { Authorization: token } } : undefined
    const response = await axios.post(baseUrl, surveyData, config);
    return response.data;
}

const updateSurvey = async (id, surveyData) => {
    const response = await axios.put(`${baseUrl}/${id}`, surveyData);
    return response.data;
} // non-logged in users can take surveys, that's intentional

const deleteSurvey = async (id) => {
    const config = token ? { headers: { Authorization: token } } : undefined
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.status === 204;
}

export default { getAll, getSurveyById, createSurvey, updateSurvey, deleteSurvey, setToken }