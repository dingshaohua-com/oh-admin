import axios from 'axios'

const BASE_URL = 'https://695cb2fd79f2f34749d5108e.mockapi.io/api'
export default axios.create({
  baseURL: BASE_URL,
})
