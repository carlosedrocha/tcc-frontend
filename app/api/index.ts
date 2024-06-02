import axios from 'axios';

// Define types for the token and formatted token
let api = axios.create({
  baseURL: 'http://localhost:3333/api'
});

// Function to format the token
const formatToken = (token: string | null): string | undefined => {
  if (!token) return undefined; // Handle null token
  return token.replace(/"/g, '').trim(); // Remove quotes and trim whitespace
};

// Axios interceptor to add authorization header
api.interceptors.request.use(async (config: any) => {
  // Clone the config object to avoid mutating it
  const newConfig = { ...config };

  // Verify if we are in a browser environment before accessing sessionStorage
  if (typeof window !== 'undefined') {
    // Get token from sessionStorage
    const token = sessionStorage.getItem('token');
    // console.log(token)
    // Format the token
    const formattedToken = formatToken(token);
    // Add authorization header if token is available
    if (formattedToken) {
      newConfig.headers = {
        ...newConfig.headers,
        Authorization: `Bearer ${formattedToken}`
      };
    }
  }

  // Ensure headers is not undefined
  newConfig.headers = newConfig.headers || {};

  return newConfig;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to the login page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    // return Promise.reject(error);
  }
);

//module.exports = api;
export default api;
