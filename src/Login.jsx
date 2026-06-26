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
            className="login-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
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