import axios from 'axios'

const BASE_URL = 'https://json.dingshaohua.com'
const instance = axios.create({
  baseURL: BASE_URL,
})

instance.interceptors.response.use(response => response.data)

export default instance;
