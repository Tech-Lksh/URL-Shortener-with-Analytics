import axios from 'axios';

const api = axios.create({
  baseURL: 'https://url-shortener-with-analytics-pjt8.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Fetch new access token
          const response = await axios.post('https://url-shortener-with-analytics-pjt8.onrender.com/api/v1/auth/refresh', {
            refreshToken
          });
          
          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // Retry the original request
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear storage and trigger logout event or redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Trigger a custom event to notify AuthContext of logout
          window.dispatchEvent(new Event('auth-logout'));
          
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
