import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const refresh_token = ref(localStorage.getItem('refreshToken') || '')
  const current_user = ref<any>(null)
  const is_loading = ref(false)

  const is_authenticated = computed(() => !!token.value)

  const set_tokens = (accessToken: string, refreshToken?: string) => {
    token.value = accessToken
    localStorage.setItem('token', accessToken)
    if (refreshToken) {
      refresh_token.value = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  const set_user = (user: any) => {
    current_user.value = user
  }

  const logout = () => {
    token.value = ''
    refresh_token.value = ''
    current_user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  // Permission helper
  const has_permission = (subject: string, actions: string[]) => {
    if (!current_user.value?.user?.role) return false
    if (current_user.value.user.role.type === 'ADMIN') return true
    
    return current_user.value.user.role.permissions.some((p: any) => 
      p.subject === subject && (p.action.includes('manage') || actions.some(a => p.action.includes(a)))
    )
  }

  return {
    token,
    refresh_token,
    current_user,
    is_loading,
    is_authenticated,
    set_tokens,
    set_user,
    logout,
    has_permission
  }
})
