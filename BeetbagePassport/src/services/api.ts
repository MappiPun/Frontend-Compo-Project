import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://database-623k.onrender.com/',
  headers: {
    'Content-Type': 'application/json'
  }
})