import axios from 'axios'

export const apiClient = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://database-623k.onrender.com',
=======
  baseURL: 'http://localhost:3000',
>>>>>>> 52efccdae5face0a835120ee71438b3cb28218ba
  headers: {
    'Content-Type': 'application/json'
  }
})