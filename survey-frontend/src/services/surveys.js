import axios from "axios";
const baseUrl = '/api/survey';

let token = null;

const setToken = (newToken) => {
    token = newToken ? `${newToken}`.replace(/^Bearer\s+/i, '') : null;
}

const getAuthHeader = () => {
    const storedUser = window.localStorage.getItem('loggedSurveyappUser');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const currentToken = token || parsedUser?.token || parsedUser?.Token || parsedUser?.accessToken;

    if (!currentToken) {
        return undefined;
    }

    return { Authorization: `Bearer ${currentToken}`.replace(/^Bearer\s+/i, 'Bearer ') };
}

const getConfig = () => {
    const headers = getAuthHeader();
    return headers ? { headers } : undefined;
}

const getAll = async () => {
    const response = await axios.get(baseUrl, getConfig());
    return response.data;
}

const getSurveyById = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`, getConfig());
    return response.data;
}

const createSurvey = async (surveyData) => {
    const headers = getAuthHeader();
    const config = headers ? { headers } : undefined;
    const response = await axios.post(baseUrl, surveyData, config);
    return response.data;
}

const updateSurvey = async (id, surveyData) => {
    const response = await axios.put(`${baseUrl}/${id}`, surveyData, getConfig());
    return response.data;
} // non-logged in users can take surveys, that's intentional

const deleteSurvey = async (id) => {
    const headers = getAuthHeader();
    const config = headers ? { headers } : undefined;
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.status === 204;
}

export default { getAll, getSurveyById, createSurvey, updateSurvey, deleteSurvey, setToken }