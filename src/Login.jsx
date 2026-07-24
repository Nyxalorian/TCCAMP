import { useState, useEffect } from 'react'
import { signInWithRedirect } from 'firebase/auth'
import { auth, provider } from './firebase'
import './Login.css'
import API_CONFIG from './config'

const API_BASE_URL = API_CONFIG.BASE_URL

function Login({ onGoToCadastro, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
  document.title = 'PharmaLife - Login'
}, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha
        })
      })

      if (!response.ok) throw new Error('Credenciais inválidas')

      const data = await response.json()
      localStorage.setItem('usuario', JSON.stringify(data))
      sessionStorage.setItem('userName', data.nome)
      sessionStorage.setItem('userEmail', data.email)
      sessionStorage.setItem('userId', data.id)
      onLogin(data)
    } catch (error) {
      console.error(error)
      alert(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider)
    } catch (error) {
      console.error(error)
      alert('Erro ao iniciar login com Google')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="auth-brand">
          <span className="auth-logo">+</span>
          <div>
            <h1 className="login-title">PharmaLife</h1>
            <p>Acesse sua conta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Login'}
          </button>

          <button
            type="button"
            className="login-btn google-login-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg
              className="google-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
              <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.42l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
              <path fill="#FBBC05" d="M6.39 13.87A6.02 6.02 0 0 1 6.07 12c0-.65.11-1.28.32-1.87V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.49l3.35-2.62Z" />
              <path fill="#EA4335" d="M12 6c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.51l3.35 2.62C7.18 7.76 9.39 6 12 6Z" />
            </svg>
            Entrar com Google
          </button>
        </form>

        <div className="signup-link">
          <span>Não tem conta? </span>
          <button type="button" onClick={onGoToCadastro}>
            Criar uma conta
          </button>
        </div>
      </div>
    </div>
    
  )
}


export default Login
