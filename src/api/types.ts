export interface AsyncResponse<T> {
  status: number | string
  data: T | null
  success: boolean
  error: string
  errorBody?: any
}

export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'