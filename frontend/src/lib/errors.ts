import axios from 'axios'

export type ApiErrorKind = 'not-found' | 'network'

export function getApiErrorKind(error: unknown): ApiErrorKind {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 404 || status === 400) return 'not-found'
  }
  return 'network'
}
