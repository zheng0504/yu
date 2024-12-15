import axios from 'axios';

export const getUniversities = async (params) => {
  try {
    const response = await axios.get('/api/universities', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUniversityDetails = async (id) => {
  try {
    const response = await axios.get(`/api/universities/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const predictAdmission = async (data) => {
  try {
    const response = await axios.post('/api/predict/admission', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const analyzeStatement = async (data) => {
  try {
    const response = await axios.post('/api/analyze/statement', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get('/api/users/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await axios.put('/api/users/profile', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPredictions = async () => {
  try {
    const response = await axios.get('/api/users/predictions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserStatements = async () => {
  try {
    const response = await axios.get('/api/users/statements');
    return response.data;
  } catch (error) {
    throw error;
  }
};
