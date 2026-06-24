import { useState, useEffect } from 'react'
import { getRedirectResult } from 'firebase/auth'
import { auth } from './firebase'
import Login from './Login'
import Cadastro from './Cadastro'
import Home from './Home'
import './App.css'
import './Accessibility.css'
import API_CONFIG from './config'

const API_BASE_URL = API_CONFIG.BASE_URL

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
  const [currentPage, setCurrentPage] = useState('cadastro')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true'
  })
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    return localStorage.getItem('accessibilityMode') === 'true'
  })

  useEffect(() => {
    const checkRedirect = async () => {
      console.log('🔍 Verificando redirect...')
      try {
        const result = await getRedirectResult(auth)
        console.log('📦 Resultado do redirect:', result)
        if (!result) {
          console.log('❌ Nenhum resultado de redirect encontrado')
          return
        }

        console.log('✅ Usuário Google:', result.user.email)
        const token = await result.user.getIdToken()
        console.log('🎫 Token gerado:', token.substring(0, 20) + '...')

        const response = await fetch(`${API_BASE_URL}/api/usuarios/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        console.log('📡 Resposta do backend:', response.status)

        if (!response.ok) throw new Error('Erro ao autenticar com Google')

        const data = await response.json()
        localStorage.setItem('usuario', JSON.stringify(data))
        sessionStorage.setItem('userName', data.nome)
        sessionStorage.setItem('userEmail', data.email)
        sessionStorage.setItem('userId', data.id)
        handleLogin(data)
      } catch (error) {
        console.error('💥 Erro:', error)
        alert(error.message || 'Erro no login Google')
      }
    }

    checkRedirect()
  }, [])

  const handleLogin = (userData) => {
    setIsLoggedIn(true)
    sessionStorage.setItem('isLoggedIn', 'true')
    if (userData && userData.nome) {
      sessionStorage.setItem('userName', userData.nome)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('isLoggedIn')
  }

  const toggleAccessibilityMode = () => {
    const newMode = !accessibilityMode
    setAccessibilityMode(newMode)
    localStorage.setItem('accessibilityMode', newMode.toString())
  }

  if (isLoggedIn) {
    return <Home onLogout={handleLogout} />
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
      <Cadastro onGoToLogin={() => setCurrentPage('login')} />
    </div>
  )
}

export default App