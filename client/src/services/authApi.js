const API_BASE_URL = 'http://localhost:5010/api/auth';

const handleFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || response.statusText);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await handleFetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    throw new Error(`Error registering user: ${error.message}`);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await handleFetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Ensure the response contains both token and user data
    if (!response.token || !response.user) {
      throw new Error('Invalid response from server');
    }

    return {
      token: response.token,
      user: response.user,
    };
  } catch (error) {
    throw new Error(`Error logging in user: ${error.message}`);
  }
};
