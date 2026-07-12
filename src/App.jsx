import { useState, useEffect } from 'react'
import { getRedirectResult } from 'firebase/auth'
import { auth } from './firebase'
import Login from './Login'
import Cadastro from './Cadastro'
import Home from './Home'
import Onboarding from './Onboarding'
import './App.css'
import './Accessibility.css'
import API_CONFIG from './config'
import {
  solicitarPermissaoNotificacao,
  escutarMensagens,
  normalizeNotificationType,
  NOTIFICATION_TYPES
} from './notificationService'

const API_BASE_URL = API_CONFIG.BASE_URL
const ONBOARDING_PENDING_DATE = '1900-01-01'

function isProfileComplete(usuario) {
  return Boolean(
    usuario?.nome &&
    usuario?.dataNascimento &&
    usuario.dataNascimento !== ONBOARDING_PENDING_DATE &&
    usuario?.comorbidade
  )
}

function normalizeUser(data) {
  return {
    nome: data?.nome || '',
    email: data?.email || '',
    id: data?.id || '',
    foto: data?.foto || '',
    dataNascimento: data?.dataNascimento || '',
    comorbidade: data?.comorbidade || '',
    tipoNotificacao: normalizeNotificationType(data?.tipoNotificacao),
  }
}

function saveUserSession(usuario) {
  sessionStorage.setItem('isLoggedIn', 'true')
  sessionStorage.setItem('usuario', JSON.stringify(usuario))
  sessionStorage.setItem('userId', String(usuario.id))
  sessionStorage.setItem('userName', usuario.nome)
  sessionStorage.setItem('userEmail', usuario.email)
  sessionStorage.setItem('userPhoto', usuario.foto || '')
  sessionStorage.setItem('notificationType', normalizeNotificationType(usuario.tipoNotificacao))
}

function Widget({ className = '' }) {
  return (
    <span className={`ui-widget ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </span>
  )
}

function App() {
  const storedUser = () => {
    const stored = sessionStorage.getItem('usuario')
    return stored ? JSON.parse(stored) : null
  }

  const [currentPage, setCurrentPage] = useState('cadastro')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true'
  })
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    return localStorage.getItem('accessibilityMode') === 'true'
  })
  const [userData, setUserData] = useState(() => storedUser())
  const [needsOnboarding, setNeedsOnboarding] = useState(() => {
    const usuario = storedUser()
    return usuario ? !isProfileComplete(usuario) : false
  })

  useEffect(() => {
    escutarMensagens()
  }, [])

  const ativarNotificacoesSistema = async (usuario) => {
    if (normalizeNotificationType(usuario?.tipoNotificacao) !== NOTIFICATION_TYPES.SYSTEM) {
      sessionStorage.removeItem('fcmToken')
      return
    }

    const token = await solicitarPermissaoNotificacao()

    if (token) {
      sessionStorage.setItem('fcmToken', token)

      await fetch(`${API_BASE_URL}/api/usuarios/${usuario.id}/fcm-token`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token
        })
      })
    }
  }

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (!result) return

        const token = await result.user.getIdToken()
        const response = await fetch(`${API_BASE_URL}/api/usuarios/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        if (!response.ok) throw new Error('Erro ao autenticar com Google')

        const data = await response.json()
        data.foto = result.user.photoURL || data.foto || ''
        handleLogin(data)
      } catch (error) {
        console.error(error)
        alert(error.message || 'Erro no login Google')
      }
    }

    checkRedirect()
  }, [])

  const handleLogin = async (data) => {
    const usuario = normalizeUser(data)
    const profileComplete = isProfileComplete(usuario)

    saveUserSession(usuario)
    setIsLoggedIn(true)
    setUserData(usuario)
    setNeedsOnboarding(!profileComplete)

    if (profileComplete) {
      await ativarNotificacoesSistema(usuario)
    }
  }

  const handleCadastroSuccess = async (data) => {
    const usuario = normalizeUser(data)

    saveUserSession(usuario)
    setUserData(usuario)
    setIsLoggedIn(true)
    setNeedsOnboarding(true)
  }

  const handleOnboardingComplete = async (data) => {
    const usuario = normalizeUser({
      ...userData,
      ...data
    })

    saveUserSession(usuario)
    setUserData(usuario)
    setNeedsOnboarding(false)

    await ativarNotificacoesSistema(usuario)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserData(null)
    setNeedsOnboarding(false)
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('usuario')
  }

  const toggleAccessibilityMode = () => {
    const newMode = !accessibilityMode
    setAccessibilityMode(newMode)
    localStorage.setItem('accessibilityMode', newMode.toString())
  }

  if (isLoggedIn) {
    if (needsOnboarding) {
      return <Onboarding userData={userData} onComplete={handleOnboardingComplete} onLogout={handleLogout} />
    }

    return <Home onLogout={handleLogout} userData={userData} />
  }

  if (currentPage === 'login') {
    return (
      <div className={`auth-shell ${accessibilityMode ? 'accessibility-mode' : ''}`.trim()}>
        <div className="accessibility-header">
          <button
            className="accessibility-toggle-login"
            onClick={toggleAccessibilityMode}
            title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade - Letras maiores'}
          >
            <Widget className="btn-icon" />
            {accessibilityMode ? 'Modo Normal' : 'Letras Grandes'}
          </button>
        </div>
        <Login onGoToCadastro={() => setCurrentPage('cadastro')} onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className={`auth-shell ${accessibilityMode ? 'accessibility-mode' : ''}`.trim()}>
      <div className="accessibility-header">
        <button
          className="accessibility-toggle-login"
          onClick={toggleAccessibilityMode}
          title={accessibilityMode ? 'Desativar modo de acessibilidade' : 'Ativar modo de acessibilidade - Letras maiores'}
        >
          <Widget className="btn-icon" />
          {accessibilityMode ? 'Modo Normal' : 'Letras Grandes'}
        </button>
      </div>
      <Cadastro onGoToLogin={() => setCurrentPage('login')} onCadastroSuccess={handleCadastroSuccess} />
    </div>
  )
}

export default App
