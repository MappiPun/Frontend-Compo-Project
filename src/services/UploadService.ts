import axios from 'axios'

export default {
  /** uploads an image to the backend, which saves it in the Supabase Storage bucket and returns the public url */
  async uploadImage(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const response = await axios.post<{ url: string }>(import.meta.env.VITE_UPLOAD_URL, form)
    return response.data.url
  },
}
