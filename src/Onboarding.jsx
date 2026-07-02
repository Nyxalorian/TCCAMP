import { useEffect, useMemo, useState } from 'react'
import './Onboarding.css'
import API_CONFIG from './config'

const API_BASE_URL = API_CONFIG.BASE_URL
const NO_COMORBIDITIES = 'Nao possuo comorbidades'

const comorbidityOptions = [
  'Diabetes',
  'Hipertensao',
  'Asma',
  'Bronquite',
  'Rinite alergica',
  'Sinusite cronica',
  'DPOC',
  'Hipotireoidismo',
  'Hipertireoidismo',
  'Colesterol alto',
  'Triglicerides altos',
  'Doenca cardiaca',
  'Arritmia',
  'Insuficiencia cardiaca',
  'Doenca renal cronica',
  'Gastrite',
  'Refluxo gastroesofagico',
  'Doenca hepatica',
  'Artrite',
  'Artrose',
  'Osteoporose',
  'Fibromialgia',
  'Enxaqueca',
  'Epilepsia',
  'AVC previo',
  'Ansiedade',
  'Depressao',
  'TDAH',
  'Autismo',
  'Anemia',
  'Obesidade',
  'Apneia do sono',
  'Glaucoma',
  'Catarata',
  'Cancer em tratamento',
  'Doenca autoimune',
  'Lupus',
  'Psoriase',
  'HIV',
  'Alergias medicamentosas',
  'Outra',
  NO_COMORBIDITIES
]

const parseComorbidities = (value) => {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function StepIcon({ type }) {
  const icons = {
    welcome: (
      <>
        <path d="M12 3l1.7 4.6L18 9.3l-4.3 1.8L12 16l-1.7-4.9L6 9.3l4.3-1.7L12 3Z" />
        <path d="M19 14v4" />
        <path d="M21 16h-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 9h16" />
        <rect x="4" y="5" width="16" height="16" rx="3" />
      </>
    ),
    heart: (
      <>
        <path d="M20.4 5.6a5.2 5.2 0 0 0-7.4 0L12 6.7l-1-1.1a5.2 5.2 0 0 0-7.4 7.4L12 21l8.4-8a5.2 5.2 0 0 0 0-7.4Z" />
      </>
    ),
    success: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    )
  }

  return (
    <span className="onboarding-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {icons[type]}
      </svg>
    </span>
  )
}

function Onboarding({ userData, onComplete, onLogout }) {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const initialComorbidities = parseComorbidities(userData?.comorbidade || '')
  const [profile, setProfile] = useState({
    nome: userData?.nome || '',
    dataNascimento: userData?.dataNascimento === '1900-01-01' ? '' : userData?.dataNascimento || '',
    comorbidades: initialComorbidities,
    outraComorbidade: initialComorbidities.find((item) => !comorbidityOptions.includes(item)) || ''
  })

  const totalQuestions = 3
  const progress = useMemo(() => {
    if (step === 0) return 8
    if (step >= 4) return 100
    return Math.round((step / totalQuestions) * 100)
  }, [step])

  useEffect(() => {
    document.title = 'PharmaLife - Onboarding'
  }, [])

  const handleChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value
    }))
  }

  const toggleComorbidity = (option) => {
    setProfile((current) => {
      if (option === NO_COMORBIDITIES) {
        return {
          ...current,
          comorbidades: current.comorbidades.includes(NO_COMORBIDITIES) ? [] : [NO_COMORBIDITIES],
          outraComorbidade: ''
        }
      }

      const withoutNone = current.comorbidades.filter((item) => item !== NO_COMORBIDITIES)
      const selected = withoutNone.includes(option)
        ? withoutNone.filter((item) => item !== option)
        : [...withoutNone, option]

      return {
        ...current,
        comorbidades: selected
      }
    })
  }

  const getComorbidityValue = () => {
    const selected = profile.comorbidades.filter((item) => item !== 'Outra')
    const custom = profile.outraComorbidade.trim()

    if (profile.comorbidades.includes(NO_COMORBIDITIES)) {
      return NO_COMORBIDITIES
    }

    return [...selected, custom].filter(Boolean).join(', ') || NO_COMORBIDITIES
  }

  const goNext = () => {
    if (step === 1 && !profile.nome.trim()) {
      alert('Informe como voce gostaria de ser chamado.')
      return
    }

    if (step === 2 && !profile.dataNascimento) {
      alert('Informe sua data de nascimento.')
      return
    }

    setStep((current) => Math.min(current + 1, 4))
  }

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0))
  }

  const finishOnboarding = async () => {
    const comorbidade = getComorbidityValue()
    setSaving(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userData.id}/onboarding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: profile.nome.trim(),
          dataNascimento: profile.dataNascimento,
          comorbidade
        })
      })

      if (!response.ok) {
        throw new Error('Nao foi possivel concluir o perfil.')
      }

      const updatedUser = await response.json()
      sessionStorage.setItem('usuario', JSON.stringify(updatedUser))
      sessionStorage.setItem('userName', updatedUser.nome)
      sessionStorage.setItem('userEmail', updatedUser.email)
      setStep(4)
    } catch (error) {
      console.error(error)
      alert(error.message || 'Erro ao finalizar onboarding')
    } finally {
      setSaving(false)
    }
  }

  const finishAndEnter = () => {
    onComplete({
      ...userData,
      ...profile,
      comorbidade: getComorbidityValue()
    })
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-background" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <main className="onboarding-card" aria-live="polite">
        <header className="onboarding-topbar">
          <div className="onboarding-brand">
            <span className="onboarding-logo">
              <img src="/favicon.png" alt="" />
            </span>
            <div>
              <strong>PharmaLife</strong>
              <span>Configuracao inicial</span>
            </div>
          </div>

          <button type="button" className="onboarding-link" onClick={onLogout}>
            Sair
          </button>
        </header>

        <div className="onboarding-progress" aria-label={`Progresso ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>

        <section key={step} className="onboarding-step">
          {step === 0 && (
            <>
              <StepIcon type="welcome" />
              <p className="onboarding-kicker">Sua conta foi criada!</p>
              <h1>Bem-vindo ao PharmaLife.</h1>
              <p className="onboarding-copy">
                Agora queremos conhecer um pouco mais sobre voce para personalizar sua experiencia.
              </p>
              <button type="button" className="onboarding-primary" onClick={goNext}>
                Comecar
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <StepIcon type="user" />
              <p className="onboarding-kicker">Etapa 1 de 3</p>
              <h1>Como voce gostaria de ser chamado?</h1>
              <label className="onboarding-field">
                <span>Nome de exibicao</span>
                <input
                  type="text"
                  value={profile.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Ex: Ana, Carlos, Dona Maria"
                  autoFocus
                />
              </label>
              <p className="onboarding-hint">Esse sera o nome utilizado dentro do aplicativo.</p>
            </>
          )}

          {step === 2 && (
            <>
              <StepIcon type="calendar" />
              <p className="onboarding-kicker">Etapa 2 de 3</p>
              <h1>Qual e sua data de nascimento?</h1>
              <label className="onboarding-field">
                <span>Data de nascimento</span>
                <input
                  type="date"
                  value={profile.dataNascimento}
                  onChange={(e) => handleChange('dataNascimento', e.target.value)}
                  autoFocus
                />
              </label>
              <p className="onboarding-hint">Utilizamos essa informacao para personalizar sua experiencia.</p>
            </>
          )}

          {step === 3 && (
            <>
              <StepIcon type="heart" />
              <p className="onboarding-kicker">Etapa 3 de 3</p>
              <h1>Voce possui alguma comorbidade?</h1>
              <p className="onboarding-hint">Selecione quantas opcoes quiser. Essa etapa e opcional.</p>
              <div className="onboarding-options">
                {comorbidityOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={profile.comorbidades.includes(option) ? 'selected' : ''}
                    onClick={() => toggleComorbidity(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <label className="onboarding-field onboarding-field--compact">
                <span>Ou descreva outra opcao</span>
                <input
                  type="text"
                  value={profile.outraComorbidade}
                  onChange={(e) => handleChange('outraComorbidade', e.target.value)}
                  disabled={profile.comorbidades.includes(NO_COMORBIDITIES)}
                  placeholder="Digite aqui, se preferir"
                />
              </label>
            </>
          )}

          {step === 4 && (
            <>
              <StepIcon type="success" />
              <p className="onboarding-kicker">Perfil concluido!</p>
              <h1>Agora voce ja pode utilizar todos os recursos do PharmaLife.</h1>
              <p className="onboarding-copy">
                Sua agenda esta pronta para receber medicamentos, lembretes e historico de tomadas.
              </p>
              <button type="button" className="onboarding-primary" onClick={finishAndEnter}>
                Ir para a Agenda
              </button>
            </>
          )}
        </section>

        {step > 0 && step < 4 && (
          <footer className="onboarding-actions">
            <button type="button" className="onboarding-secondary" onClick={goBack}>
              Voltar
            </button>
            {step < 3 ? (
              <button type="button" className="onboarding-primary" onClick={goNext}>
                Continuar
              </button>
            ) : (
              <button type="button" className="onboarding-primary" onClick={finishOnboarding} disabled={saving}>
                {saving ? 'Salvando...' : 'Finalizar'}
              </button>
            )}
          </footer>
        )}
      </main>
    </div>
  )
}

export default Onboarding
