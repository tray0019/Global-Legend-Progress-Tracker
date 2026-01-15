import axios from 'axios';

const BASE_URL = 'http://localhost:8080/users';

export const oauthRegister = async (email, provider, providerUserId) => {
  const response = await axios.post(`${BASE_URL}/oauth-register`, {
    email,
    provider,
    providerUserId,
  });
  return response.data;
};

export const completeProfile = async (userId, profileData) => {
  const response = await axios.post(`${BASE_URL}/complete-profile/${userId}`, profileData);
  return response.data;
};
