import axios from 'axios';

// prevents hardcoding the backend address
// also don't need upload your api to github
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Request Interceptor: 在发送请求之前自动塞入 Authorization Header
// add bearer token to the request
api.interceptors.request.use((config) => {
  // Get token from local storage to make sure user is logged in and get the token
  const token = localStorage.getItem('token');
  // if got 
  if (token) {
    // put the token into the request header
    config.headers.Authorization = `Bearer ${token}`;
  }
  // and continue send to backend not matter got or no token
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: 自动拦截 JWT Token 过期并重定向回 Home Page
api.interceptors.response.use(
  // If success, do nothing
  (response) => response, 

  // if error
  (error) => {
    // .response is to make sure is 后端明确报错了
    if (error.response) {
      const { status, data } = error.response;
      
      // If unauthorized or token expired
      if (
        status === 401 || 
        (status === 400 && data?.error === "jwt expired") ||
        data?.error === "invalid token"
      ) {
        // 清空 LocalStorage 中存储的过期 token 和 user 信息
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // back to Home Page
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;