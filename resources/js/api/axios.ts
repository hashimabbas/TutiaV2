import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL; // Use environment variables!
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios;
