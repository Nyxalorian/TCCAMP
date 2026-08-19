import { useEffect, useState } from 'react'
import { apiFetch as fetch } from './api'
import API_CONFIG from './config'
import './EsqueciSenha.css'

const API_BASE_URL = API_CONFIG.BASE_URL

async function getMessage(response, fallback) {
  const text = await response.text()
  return text || fallback
}

function EsqueciSenha({ onGoToLogin }) {
  const [etapa, setEtapa] = useState(1)
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    document.title = 'PharmaLife - Recuperar senha'
  }, [])

  const executar = async (acao) => {
    setLoading(true)
    setErro('')
    setMensagem('')
    try {
      await acao()
    } catch (error) {
      setErro(error.name === 'AbortError'
        ? 'O servidor demorou demais para responder. Tente novamente.'
        : error.message || 'Não foi possível concluir a solicitação.')
    } finally {
      setLoading(false)
    }
  }

  const solicitarCodigo = (event) => {
    event.preventDefault()
    executar(async () => {
      const response = await fetch(`${API_BASE_URL}/recuperar-senha/solicitar-codigo?email=${encodeURIComponent(email.trim())}`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error(await getMessage(response, 'Não foi possível enviar o código.'))
      setEmail(email.trim())
      setMensagem('Enviamos um código de 6 dígitos para o seu e-mail.')
      setEtapa(2)
    })
  }

  const validarCodigo = (event) => {
    event.preventDefault()
    executar(async () => {
      const response = await fetch(`${API_BASE_URL}/recuperar-senha/validar-codigo?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigo)}`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error(await getMessage(response, 'Código inválido ou expirado.'))
      setEtapa(3)
    })
  }

  const redefinirSenha = (event) => {
    event.preventDefault()
    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    executar(async () => {
      const response = await fetch(`${API_BASE_URL}/recuperar-senha/redefinir-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo, novaSenha })
      })
      if (!response.ok) throw new Error(await getMessage(response, 'Não foi possível redefinir a senha.'))
      setMensagem('Senha redefinida com sucesso. Você já pode entrar.')
      setEtapa(4)
    })
  }

  const reenviarCodigo = () => executar(async () => {
    const response = await fetch(`${API_BASE_URL}/recuperar-senha/solicitar-codigo?email=${encodeURIComponent(email)}`, { method: 'POST' })
    if (!response.ok) throw new Error(await getMessage(response, 'Não foi possível reenviar o código.'))
    setMensagem('Um novo código foi enviado.')
    setCodigo('')
  })

  const formularios = {
    1: (
      <form onSubmit={solicitarCodigo} className="login-form recovery-form">
        <label htmlFor="recovery-email">E-mail cadastrado</label>
        <div className="input-group">
          <input id="recovery-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu e-mail" autoComplete="email" required autoFocus />
        </div>
        <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar código'}</button>
      </form>
    ),
    2: (
      <form onSubmit={validarCodigo} className="login-form recovery-form">
        <label htmlFor="recovery-code">Código de verificação</label>
        <div className="input-group">
          <input id="recovery-code" className="recovery-code" inputMode="numeric" autoComplete="one-time-code" maxLength="6" pattern="[0-9]{6}" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))} placeholder="000000" required autoFocus />
        </div>
        <button type="submit" className="login-btn" disabled={loading || codigo.length !== 6}>{loading ? 'Validando...' : 'Continuar'}</button>
        <button type="button" className="recovery-link" onClick={reenviarCodigo} disabled={loading}>Reenviar código</button>
      </form>
    ),
    3: (
      <form onSubmit={redefinirSenha} className="login-form recovery-form">
        <label htmlFor="new-password">Nova senha</label>
        <div className="input-group"><input id="new-password" type="password" minLength="6" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Mínimo de 6 caracteres" autoComplete="new-password" required autoFocus /></div>
        <label htmlFor="confirm-password">Confirme a nova senha</label>
        <div className="input-group"><input id="confirm-password" type="password" minLength="6" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Digite a senha novamente" autoComplete="new-password" required /></div>
        <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Salvando...' : 'Redefinir senha'}</button>
      </form>
    ),
    4: <button type="button" className="login-btn recovery-success-button" onClick={onGoToLogin}>Ir para o login</button>
  }

  return (
    <div className="login-container">
      <main className="login-card" aria-live="polite">
        <div className="auth-brand"><span className="auth-logo">+</span><div><h1 className="login-title">Recuperar senha</h1><p>{etapa === 1 ? 'Informe seu e-mail para começar' : etapa < 4 ? `Etapa ${etapa} de 3` : 'Tudo pronto'}</p></div></div>
        {mensagem && <p className="recovery-message recovery-message-success">{mensagem}</p>}
        {erro && <p className="recovery-message recovery-message-error" role="alert">{erro}</p>}
        {formularios[etapa]}
        {etapa < 4 && <button type="button" className="recovery-back" onClick={onGoToLogin}>Voltar para o login</button>}
      </main>
    </div>
  )
}

export default EsqueciSenha
