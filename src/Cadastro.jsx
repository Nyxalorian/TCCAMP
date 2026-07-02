import { useState, useEffect } from 'react'
import './Cadastro.css'
import API_CONFIG from './config'

const API_BASE_URL = API_CONFIG.BASE_URL
const ONBOARDING_PENDING_DATE = '1900-01-01'

function Cadastro({ onGoToLogin, onCadastroSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'PharmaLife - Cadastro'
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas nao coincidem!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          dataNascimento: ONBOARDING_PENDING_DATE,
          comorbidade: ''
        })
      })

      const responseText = await response.text()
      let data = {}
      try {
        data = responseText ? JSON.parse(responseText) : {}
      } catch {
        data = { erro: responseText }
      }

      if (response.ok) {
        onCadastroSuccess(data)
      } else {
        alert(data.erro || 'Erro ao criar conta')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro de conexao. Verifique se o servidor esta rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card cadastro-card--compact">
        <div className="auth-brand">
          <span className="auth-logo">+</span>
          <div>
            <h1 className="cadastro-title">PharmaLife</h1>
            <p>Criar conta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form cadastro-form--compact">
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#999"/>
              </svg>
            </div>
            <input
              type="text"
              name="nome"
              placeholder="Nome de usuario"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" fill="#999"/>
              </svg>
            </div>
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="cadastro-btn" disabled={loading}>
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="login-link">
          <span>Ja tem conta? </span>
          <button type="button" className="login-account-btn" onClick={onGoToLogin}>
            Fazer login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
