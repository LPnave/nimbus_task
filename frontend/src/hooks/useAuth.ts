import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api, getErrorMessage, type ApiResponse } from '@/lib/api'
import { useAuthStore, type User } from '@/store/authStore'
import { toast } from '@/hooks/useToast'

interface LoginPayload { email: string; password: string }
interface RegisterPayload { name: string; email: string; password: string }
interface AuthResponse { user: User; accessToken: string }

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', payload)
      return res.data.data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      navigate('/map')
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Login failed', description: getErrorMessage(error) })
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', payload)
      return res.data.data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      navigate('/map')
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Registration failed', description: getErrorMessage(error) })
    },
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/logout')
    },
    onSettled: () => {
      logout()
      navigate('/login')
    },
  })
}
