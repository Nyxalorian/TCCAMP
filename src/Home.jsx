import { useState, useEffect } from 'react'
import './Home.css'
import './Adicionar.css'
import './Accessibility.css'
import Sobre from './Sobre'
import pharmalifeLogo from './assets/pharmalife-logo.png'
import API_CONFIG from './config'


const API_BASE_URL = API_CONFIG.BASE_URL

const accessibilityScales = {
  normal: { font: 1, spacing: 1, icon: 1, tap: 1 },
  medium: { font: 1.25, spacing: 1.15, icon: 1.18, tap: 1.12 },
  large: { font: 1.5, spacing: 1.32, icon: 1.35, tap: 1.25 },
  xlarge: { font: 1.75, spacing: 1.5, icon: 1.55, tap: 1.38 }
}

const colorVisionModes = {
  protanopia: 'Protanopia',
  deuteranopia: 'Deuteranopia',
  tritanopia: 'Tritanopia',
  'high-contrast': 'Alto Contraste'
}

const ignoreReasonOptions = [
  'Médico orientou suspensão',
  'Estou sem o medicamento',
  'Não preciso tomar hoje',
  'Exame ou procedimento médico',
  'Outro motivo'
]

const widgetLabels = {
  add: '+',
  bell: 'NL',
  chart: '%',
  checklist: 'OK',
  delete: 'EXC',
  doctor: 'DR',
  edit: 'ED',
  list: 'HR',
  logout: 'SAIR',
  search: 'BUS',
  sparkle: 'AN',
  target: 'PM',
  time: 'PD',
  trend: 'AD',
  users: 'USU',
  warning: '!'
}

const widgetIcons = {
  add: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M10 5a2 2 0 0 1 4 0 7 7 0 0 1 4 6v3l2 3H4l2-3v-3a7 7 0 0 1 4-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 3v9h9" />
      <path d="M21 12a9 9 0 1 1-9-9" />
    </svg>
  ),
  pill: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M10 21 3 14a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" focusable="false">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  ),
  time: (
    <svg viewBox="0 0 24 24" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5" />
      <path d="M12 12h5" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 14 4-4 3 3 5-6" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <path d="M4 6h.01" />
      <path d="M4 12h.01" />
      <path d="M4 18h.01" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M10.3 4.3 11 2h2l.7 2.3 1.7.7 2.1-1.1 1.4 1.4-1.1 2.1.7 1.7L21 10v2l-2.3.7-.7 1.7 1.1 2.1-1.4 1.4-2.1-1.1-1.7.7L13 22h-2l-.7-2.3-1.7-.7-2.1 1.1-1.4-1.4 1.1-2.1-.7-1.7L3 12v-2l2.3-.7.7-1.7-1.1-2.1 1.4-1.4L8.6 5l1.7-.7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 3 14 9l6 3-6 3-2 6-2-6-6-3 6-3 2-6Z" />
      <path d="M19 3v4" />
      <path d="M21 5h-4" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
      <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      <path d="M21 21v-2a6 6 0 0 0-4-5.65" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  ),
  checklist: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  delete: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="m13 7 4 4" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M10 17 15 12l-5-5" />
      <path d="M15 12H3" />
      <path d="M14 4h5v16h-5" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function Widget({ type, className = '' }) {
  return (
    <span className={`ui-widget ui-widget--${type} ${className}`.trim()} aria-hidden="true">
      {widgetIcons[type] || widgetLabels[type] || type.toUpperCase()}
    </span>
  )
}

function TablerIcon({ name }) {
  const paths = {
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 14 2-6 2 2-2 6-2-2Z" />
      </>
    ),
    pill: (
      <>
        <path d="M10 21 3 14a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
        <path d="m8.5 8.5 7 7" />
      </>
    ),
    history: (
      <>
        <path d="M12 8v4l2 2" />
        <path d="M3.05 11a9 9 0 1 1 .5 4" />
        <path d="M3 4v7h7" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    settings: (
      <>
        <path d="M10.3 4.3 11 2h2l.7 2.3 1.7.7 2.1-1.1 1.4 1.4-1.1 2.1.7 1.7L21 10v2l-2.3.7-.7 1.7 1.1 2.1-1.4 1.4-2.1-1.1-1.7.7L13 22h-2l-.7-2.3-1.7-.7-2.1 1.1-1.4-1.4 1.1-2.1-.7-1.7L3 12v-2l2.3-.7.7-1.7-1.1-2.1 1.4-1.4L8.6 5l1.7-.7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )
  }

  return (
    <svg className="tabler-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Home({ onLogout, userData }) {

    console.count("Home render");

  console.log("userData:", userData)
  console.log("foto:", userData?.foto)

  const [activeSection, setActiveSection] = useState('dashboard')
  const [isAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true')

  const [novoMedicamento, setNovoMedicamento] = useState({
    nome: '',
    dosagem: '',
    horario: '',
    frequencia: 'diario',
    duracao: '1-semana',
    observacoes: ''
  })

  // restante do código...

  
  const [medicamentosTomados, setMedicamentosTomados] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [helpSearchTerm, setHelpSearchTerm] = useState('')
  const [historyFilter, setHistoryFilter] = useState('week')
  const [medicamentos, setMedicamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [, setEstatisticas] = useState({ adesao: 0, tomados: 0, total: 0 })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [perfil, setPerfil] = useState({
    nome: '',
    senha: '',
    email: '',
    dataNascimento: '',
    comorbidade: '',
    foto: ''
  })
  const [darkMode, setDarkMode] = useState(false)
  const [accessibilityLevel, setAccessibilityLevel] = useState(() => {
    const savedLevel = localStorage.getItem('accessibilityLevel')
    if (['normal', 'medium', 'large', 'xlarge'].includes(savedLevel)) {
      return savedLevel
    }
    return localStorage.getItem('accessibilityMode') === 'true' ? 'medium' : 'normal'
  })
  const accessibilityMode = accessibilityLevel !== 'normal'
  const [colorVisionMode, setColorVisionMode] = useState(() => {
    const savedMode = localStorage.getItem('colorVisionMode')
    return Object.keys(colorVisionModes).includes(savedMode) ? savedMode : ''
  })

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [editMedicamento, setEditMedicamento] = useState({
    nome: '',
    dosagem: '',
    horario: '',
    frequencia: 'Diário',
    observacao: ''
  })
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [editProfile, setEditProfile] = useState({
    nome: '',
    senhaAtual: '',
    novaSenha: ''
  })
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [deleteAccountData, setDeleteAccountData] = useState({
    senhaAtual: ''
  })
  const [showIgnoreModal, setShowIgnoreModal] = useState(false)
  const [ignoreTarget, setIgnoreTarget] = useState(null)
  const [ignoreReason, setIgnoreReason] = useState(ignoreReasonOptions[0])
  const [ignoreOtherReason, setIgnoreOtherReason] = useState('')
  const [savingIgnore, setSavingIgnore] = useState(false)
  const [novoLembrete, setNovoLembrete] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horario: ''
  })
  const [lembretes, setLembretes] = useState([])
  const [historicoCompleto, setHistoricoCompleto] = useState([])

  useEffect(() => {
    const scale = accessibilityScales[accessibilityLevel] || accessibilityScales.normal
    const root = document.documentElement
    root.style.setProperty('--font-scale', scale.font)
    root.style.setProperty('--spacing-scale', scale.spacing)
    root.style.setProperty('--icon-scale', scale.icon)
    root.style.setProperty('--tap-scale', scale.tap)
  }, [accessibilityLevel])

  useEffect(() => {
    if (colorVisionMode) {
      document.documentElement.setAttribute('data-colorblind', colorVisionMode)
    } else {
      document.documentElement.removeAttribute('data-colorblind')
    }
  }, [colorVisionMode])

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const getApiErrorMessage = async (response, fallback = 'Erro ao comunicar com o servidor') => {
    const text = await response.text()
    if (!text) return fallback

    try {
      const data = JSON.parse(text)
      return data.erro || data.message || text
    } catch {
      return text
    }
  }

  const toBackendDateTime = (date) => {
    const pad = (value) => String(value).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  const getTreatmentEndDate = (duration) => {
    const endDate = new Date()
    const durations = {
      '1 dia': 1,
      '3 dias': 3,
      '5 dias': 5,
      '1-semana': 7,
      '2 semanas': 14,
      '1 mês': 30,
      '3 meses': 90,
      '6 meses': 180
    }

    endDate.setDate(endDate.getDate() + (durations[duration] || 365))
    return endDate
  }

  const normalizeFrequency = (frequency) => {
    const frequencies = {
      diario: 'Diário',
      'Diário': 'Diário',
      '12h': 'A cada 12h',
      '8h': 'A cada 8h',
      Semanal: 'Semanal'
    }

    return frequencies[frequency] || frequency || 'Diário'
  }

  const formatHorario = (horario) => {
    return typeof horario === 'string' ? horario.slice(0, 5) : ''
  }

  const isTakenStatus = (status) => ['TOMADO', 'CONFIRMADO', 'tomado'].includes(status)

  const getHistoricoDate = (item) => {
    if (!item) return null
    if (item.dataConfirmacao) return new Date(item.dataConfirmacao)
    if (item.dataHoraIgnorado) return new Date(item.dataHoraIgnorado)
    if (item.dataHora) return new Date(item.dataHora)
    if (item.horario) {
      const [hour = '0', minute = '0'] = String(item.horario).split(':')
      const date = new Date()
      date.setHours(Number(hour), Number(minute), 0, 0)
      return date
    }
    return null
  }

  const isSameDay = (left, right) => {
    return left.getFullYear() === right.getFullYear()
      && left.getMonth() === right.getMonth()
      && left.getDate() === right.getDate()
  }

  const isPendingMissed = (item) => {
    if (!item) return false
    if (item.status !== 'PENDENTE' || !item.horario) return false
    const scheduledDate = getHistoricoDate(item)
    return scheduledDate && scheduledDate < new Date()
  }

  const getMedicationStatusToday = (med) => {
    if (!med) return 'PENDENTE'
    const today = new Date()
    const historicoHoje = Array.isArray(historicoCompleto)
      ? historicoCompleto
          .filter((item) => {
            const itemMedId = item?.medicamento?.id || item?.medicamentoId
            const itemDate = getHistoricoDate(item)
            return itemMedId === med.id && itemDate && isSameDay(itemDate, today)
          })
          .sort((a, b) => (getHistoricoDate(b) || new Date(0)) - (getHistoricoDate(a) || new Date(0)))
      : []

    const latest = historicoHoje[0]
    if (latest?.status === 'IGNORADO') return 'IGNORADO'
    if (latest && isTakenStatus(latest.status)) return 'TOMADO'
    if (latest?.status === 'PERDIDO' || isPendingMissed(latest)) return 'PERDIDO'
    if (latest?.status === 'PENDENTE') return 'PENDENTE'

    const scheduledDate = getHistoricoDate({ horario: med.horario })
    if (scheduledDate && scheduledDate < new Date()) return 'PERDIDO'

    return 'PENDENTE'
  }

  const getDailyMedicationStats = () => {
    const stats = { tomados: 0, pendentes: 0, perdidos: 0, ignorados: 0, total: 0, adesao: 0 }

    agendaMedicamentos.filter(Boolean).forEach((med) => {
      const status = getMedicationStatusToday(med)
      if (status === 'TOMADO') stats.tomados += 1
      else if (status === 'IGNORADO') stats.ignorados += 1
      else if (status === 'PERDIDO') stats.perdidos += 1
      else stats.pendentes += 1
    })

    stats.total = stats.tomados + stats.pendentes + stats.perdidos
    stats.adesao = stats.total > 0 ? Math.round((stats.tomados / stats.total) * 100) : 0
    return stats
  }

  const updateAccessibilityLevel = (level) => {
    setAccessibilityLevel(level)
    localStorage.setItem('accessibilityLevel', level)
    localStorage.setItem('accessibilityMode', (level !== 'normal').toString())
    const levelLabels = {
      normal: 'Normal (100%)',
      medium: 'Médio (125%)',
      large: 'Grande (150%)',
      xlarge: 'Extra Grande (175%)'
    }
    showToastMessage(`Acessibilidade visual: ${levelLabels[level]}`)
  }

  const updateColorVisionMode = (mode) => {
    setColorVisionMode(mode)
    if (mode) {
      localStorage.setItem('colorVisionMode', mode)
      showToastMessage(`Modo para daltonismo: ${colorVisionModes[mode]}`)
    } else {
      localStorage.removeItem('colorVisionMode')
      showToastMessage('Modo para daltonismo desativado')
    }
  }

  const marcarComoTomado = async (med) => {
    const agendaId = med.agenda?.id
    const medicamentoId = med.id
    try {
      const now = new Date()
      const response = await fetch(`${API_BASE_URL}/api/agenda/${agendaId}/medicamentos/${medicamentoId}/historico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: med.nome,
          dosagem: med.descricao || med.dosagem || med.agenda?.dosagem || '',
          observacoes: med.complemento || med.agenda?.observacoes || '',
          horario: now.toTimeString().slice(0, 5),
          status: 'PENDENTE'
        })
      })
      if (response.ok) {
        const historicoCriado = await response.json()
        if (historicoCriado?.id) {
          await fetch(`${API_BASE_URL}/api/historico/${historicoCriado.id}/confirmar`, { method: 'PATCH' })
        }
        setMedicamentosTomados([...medicamentosTomados, medicamentoId])
        showToastMessage('Medicamento marcado como tomado!')
        await carregarHistoricoCompleto()
        carregarEstatisticas()
      } else {
        throw new Error('Erro no backend')
      }
    } catch {
      const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
      medicamentosTomadosLocal.push({ medicamentoId, dataHora: new Date().toISOString(), usuario: sessionStorage.getItem('userName') })
      localStorage.setItem('medicamentosTomados', JSON.stringify(medicamentosTomadosLocal))
      setMedicamentosTomados([...medicamentosTomados, medicamentoId])
      showToastMessage('Medicamento marcado como tomado!')
      carregarEstatisticas()
    }
  }

  const abrirModalIgnorar = (target) => {
    setIgnoreTarget(target)
    setIgnoreReason(ignoreReasonOptions[0])
    setIgnoreOtherReason('')
    setShowIgnoreModal(true)
  }

  const fecharModalIgnorar = () => {
    setShowIgnoreModal(false)
    setIgnoreTarget(null)
    setIgnoreReason(ignoreReasonOptions[0])
    setIgnoreOtherReason('')
  }

  const getMotivoIgnorado = () => {
    if (ignoreReason === 'Outro motivo') {
      return ignoreOtherReason.trim() || 'Outro motivo'
    }
    return ignoreReason
  }

  const criarHistoricoPendente = async (med) => {
    const agendaId = med.agenda?.id || med.agendaId
    if (!agendaId) throw new Error('Agenda do medicamento não encontrada')

    const response = await fetch(`${API_BASE_URL}/api/agenda/${agendaId}/medicamentos/${med.id}/historico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: med.nome,
        dosagem: med.descricao || med.dosagem || med.agenda?.dosagem || '',
        observacoes: med.complemento || med.agenda?.observacoes || '',
        horario: new Date().toTimeString().slice(0, 5),
        status: 'PENDENTE'
      })
    })

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response, 'Erro ao registrar histórico'))
    }

    return response.json()
  }

  const confirmarIgnorarMedicamento = async () => {
    if (!ignoreTarget) return

    const motivoIgnorado = getMotivoIgnorado()
    setSavingIgnore(true)

    try {
      let historicoId = ignoreTarget.historicoId

      if (!historicoId && ignoreTarget.med) {
        const historicoCriado = await criarHistoricoPendente(ignoreTarget.med)
        historicoId = historicoCriado.id
      }

      if (!historicoId) throw new Error('Histórico não encontrado para ignorar')

      const response = await fetch(`${API_BASE_URL}/api/historico/${historicoId}/ignorar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivoIgnorado })
      })

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, 'Erro ao ignorar medicamento'))
      }

      showToastMessage('Medicamento ignorado com sucesso.')
      fecharModalIgnorar()
      await carregarHistoricoCompleto()
      carregarEstatisticas()
    } catch (error) {
      const med = ignoreTarget.med
      if (med) {
        const registroIgnorado = {
          id: `ignored-${Date.now()}`,
          medicamentoId: med.id,
          nome: med.nome,
          dosagem: med.dosagem || med.descricao || '',
          horario: new Date().toTimeString().slice(0, 5),
          status: 'IGNORADO',
          motivoIgnorado,
          dataHoraIgnorado: new Date().toISOString(),
          usuario: sessionStorage.getItem('userName')
        }
        const medicamentosIgnorados = JSON.parse(localStorage.getItem('medicamentosIgnorados') || '[]')
        medicamentosIgnorados.push(registroIgnorado)
        localStorage.setItem('medicamentosIgnorados', JSON.stringify(medicamentosIgnorados))
        setHistoricoCompleto((current) => [...current, registroIgnorado])
        showToastMessage('Medicamento ignorado com sucesso.')
        fecharModalIgnorar()
      } else {
        console.error(error)
        alert(error.message || 'Erro ao ignorar medicamento')
      }
    } finally {
      setSavingIgnore(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      tomado: { tone: 'confirmed', icon: 'OK', text: 'Tomado' },
      pendente: { tone: 'pending', icon: 'PD', text: 'Pendente' },
      atrasado: { tone: 'missed', icon: '!', text: 'Atrasado' },
      ATIVO: { tone: 'confirmed', icon: 'OK', text: 'Ativo' },
      INATIVO: { tone: 'neutral', icon: '-', text: 'Inativo' },
      PENDENTE: { tone: 'pending', icon: 'PD', text: 'Pendente' },
      TOMADO: { tone: 'confirmed', icon: 'OK', text: 'Tomado' },
      CONFIRMADO: { tone: 'confirmed', icon: 'OK', text: 'Tomado' },
      PERDIDO: { tone: 'missed', icon: '!', text: 'Perdido' },
      IGNORADO: { tone: 'neutral', icon: 'IG', text: 'Ignorado' },
      próximo: { tone: 'info', icon: 'PM', text: 'Próximo' },
      aberta: { tone: 'confirmed', icon: 'OK', text: 'Aberta' },
      fechada: { tone: 'neutral', icon: '-', text: 'Fechada' }
    }
    return badges[status] || { tone: 'neutral', icon: '-', text: 'N/A' }
  }

  const carregarEstatisticas = () => {
    const userName = sessionStorage.getItem('userName')
    let totalMedicamentos = 0
    let tomados = 0
    let perdidos = 0
    let ignorados = 0
    let pendentes = 0

    if (Array.isArray(historicoCompleto) && historicoCompleto.length > 0) {
      tomados = historicoCompleto.filter(h => isTakenStatus(h?.status)).length
      ignorados = historicoCompleto.filter(h => h?.status === 'IGNORADO').length
      perdidos = historicoCompleto.filter(h => h?.status === 'PERDIDO' || isPendingMissed(h)).length
      pendentes = historicoCompleto.filter(h => h?.status === 'PENDENTE' && !isPendingMissed(h)).length
      totalMedicamentos = tomados + perdidos + pendentes
    } else {
      const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
      const medicamentosUsuario = medicamentosTomadosLocal.filter(mt => mt.usuario === userName)
      totalMedicamentos = medicamentos.length * 7 // 7 dias
      tomados = medicamentosUsuario.length
    }

    const adesao = totalMedicamentos > 0 ? Math.round((tomados / totalMedicamentos) * 100) : 0
    
    setEstatisticas({ adesao, tomados, total: totalMedicamentos, perdidos, pendentes, ignorados })
  }
  
  const renderAjuda = () => {
    const helpTopics = [
      { icon: 'compass', title: 'Primeiros passos', text: 'Entrar, entender o painel e localizar as áreas principais.' },
      { icon: 'pill', title: 'Gerenciar medicamentos', text: 'Cadastrar, revisar horários e confirmar tomadas.' },
      { icon: 'history', title: 'Histórico', text: 'Acompanhar registros e manter lembretes ativos.' },
      { icon: 'shield', title: 'Segurança', text: 'Editar dados, trocar senha e sair com segurança.' },
      { icon: 'settings', title: 'Configurações', text: 'Ativar modo escuro, letras grandes e preferências.' }
    ]

    const faqs = [
      {
        question: 'Como cadastro um medicamento?',
        answer: 'Acesse Novo Medicamento, preencha nome, dosagem, horário e frequência. Depois salve para aparecer na Agenda.'
      },
      {
        question: 'Como marco um medicamento como tomado?',
        answer: 'Na Página Inicial ou Agenda, use o botão de confirmação ao lado do medicamento no horário correto.'
      },
      {
        question: 'Onde vejo meu histórico?',
        answer: 'Entre em Histórico para consultar medicamentos confirmados, pendentes ou ignorados.'
      },
      {
        question: 'Como aumento o tamanho das letras?',
        answer: 'Use o botão Grande no menu lateral ou ative Modo de Acessibilidade em Configurações.'
      }
    ]

    const searchText = helpSearchTerm.trim().toLowerCase()
    const filteredTopics = searchText
      ? helpTopics.filter(topic => `${topic.title} ${topic.text}`.toLowerCase().includes(searchText))
      : helpTopics
    const filteredFaqs = searchText
      ? faqs.filter(faq => `${faq.question} ${faq.answer}`.toLowerCase().includes(searchText))
      : faqs
    const historicoBackend = Array.isArray(historicoCompleto) ? historicoCompleto : []
    const medicamentosBackend = Array.isArray(medicamentos) ? medicamentos : []
    const lembretesUsuario = Array.isArray(lembretes) ? lembretes : []
    const onboardingSteps = [
      {
        title: 'Cadastrar primeiro medicamento',
        done: medicamentosBackend.length > 0
      },
      {
        title: 'Ter um horário definido na agenda',
        done: medicamentosBackend.some(med => med.agenda?.horario || med.horario)
      },
      {
        title: 'Gerar o primeiro registro no histórico',
        done: historicoBackend.length > 0
      },
      {
        title: 'Confirmar uma tomada',
        done: historicoBackend.some(item => isTakenStatus(item?.status)) || medicamentosTomados.length > 0
      },
      {
        title: 'Criar um lembrete de saúde',
        done: lembretesUsuario.length > 0
      }
    ]
    const completedOnboardingSteps = onboardingSteps.filter(step => step.done).length
    const onboardingPercent = Math.round((completedOnboardingSteps / onboardingSteps.length) * 100)

    return (
      <section className="help-page" aria-labelledby="help-title">
        <header className="help-hero">
          <div className="help-hero__content">
            <nav className="help-breadcrumb" aria-label="Caminho da página">
              <span>PharmaLife</span>
              <span aria-hidden="true">/</span>
              <strong>Ajuda</strong>
            </nav>

            <div className="help-title-row">
              <span className="help-title-icon" aria-hidden="true">?</span>
              <div>
                <p className="help-eyebrow">Central de suporte</p>
                <h2 id="help-title">Como usar o PharmaLife</h2>
              </div>
            </div>

            <p className="help-subtitle">
              Guia rápido e acessível para cadastrar medicamentos, acompanhar sua rotina e ajustar sua conta.
            </p>

            <label className="help-search">
              <span className="sr-only">Buscar tópico de ajuda</span>
              <span aria-hidden="true">Buscar</span>
              <input
                type="search"
                placeholder="Busque por agenda, histórico, senha..."
                value={helpSearchTerm}
                onChange={(e) => setHelpSearchTerm(e.target.value)}
              />
            </label>
          </div>

          <div className="help-hero__visual" aria-hidden="true">
            <svg viewBox="0 0 220 180" role="img">
              <rect x="28" y="28" width="164" height="124" rx="24" fill="#EFF6FF" />
              <rect x="48" y="52" width="124" height="16" rx="8" fill="#BFDBFE" />
              <rect x="48" y="84" width="72" height="12" rx="6" fill="#93C5FD" />
              <rect x="48" y="110" width="100" height="12" rx="6" fill="#D1FAE5" />
              <circle cx="168" cy="116" r="30" fill="#10B981" opacity="0.18" />
              <path d="M168 98v36M150 116h36" stroke="#059669" strokeWidth="10" strokeLinecap="round" />
            </svg>
          </div>
        </header>

        <div className="help-progress" aria-label="Progresso sugerido de primeiros passos">
          <div>
            <span>Onboarding</span>
            <strong>{completedOnboardingSteps} de {onboardingSteps.length} passos essenciais</strong>
          </div>
          <div className="help-progress__bar">
            <span style={{ width: `${onboardingPercent}%` }} />
          </div>
          <ul className="help-progress__steps" aria-label="Checklist de progresso">
            {onboardingSteps.map((step) => (
              <li key={step.title} className={step.done ? 'is-done' : ''}>
                <input
                  type="checkbox"
                  checked={step.done}
                  readOnly
                  aria-label={step.title}
                />
                {step.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="help-layout">
          <div className="help-main">
            <div className="help-topic-grid" aria-label="Tópicos de ajuda">
              {filteredTopics.length > 0 ? filteredTopics.map((topic) => (
                <article className="help-topic-card" key={topic.title} tabIndex="0">
                  <span className="help-topic-icon" aria-hidden="true"><TablerIcon name={topic.icon} /></span>
                  <h3>{topic.title}</h3>
                  <p>{topic.text}</p>
                </article>
              )) : (
                <div className="help-empty-state" role="status">
                  Nenhum tópico encontrado. Tente buscar por agenda, senha, histórico ou acessibilidade.
                </div>
              )}
            </div>

            <article className="help-panel">
              <div className="help-section-heading">
                <span className="help-section-icon" aria-hidden="true">RX</span>
                <div>
                  <p>Fluxo recomendado</p>
                  <h3>Primeiros passos no tratamento</h3>
                </div>
              </div>

              <ol className="help-timeline">
                <li>
                  <span>1</span>
                  <div>
                    <h4>Acesse sua conta</h4>
                    <p>Faça login para manter medicamentos, lembretes e histórico salvos.</p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <h4>Cadastre medicamentos</h4>
                    <p>Informe dose, horário e frequência na área Novo Medicamento.</p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <h4>Confirme cada tomada</h4>
                    <p>Use a Agenda ou a Página Inicial para registrar o medicamento tomado.</p>
                  </div>
                </li>
              </ol>
            </article>

            <article className="help-panel">
              <div className="help-section-heading">
                <span className="help-section-icon" aria-hidden="true">FAQ</span>
                <div>
                  <p>Respostas rápidas</p>
                  <h3>Perguntas frequentes</h3>
                </div>
              </div>

              <div className="help-faq-list">
                {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
                  <details className="help-faq" key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                )) : (
                  <div className="help-empty-state" role="status">
                    Nenhuma pergunta encontrada para esta busca.
                  </div>
                )}
              </div>
            </article>
          </div>

          <aside className="help-sidebar" aria-label="Ajuda complementar">
            <div className="help-alerts">
              <h3>Dicas rápidas</h3>
              <div className="help-alert help-alert--success">
                <strong>Horários atualizados</strong>
                <span>Revise a agenda quando houver mudança na receita.</span>
              </div>
              <div className="help-alert help-alert--info">
                <strong>Letras maiores</strong>
                <span>Ative o modo de acessibilidade para melhorar a leitura.</span>
              </div>
              <div className="help-alert help-alert--warning">
                <strong>Dúvida médica</strong>
                <span>Procure um profissional antes de alterar dose ou frequência.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    )
  }

  useEffect(() => {
    carregarEstatisticas()
  }, [medicamentos, historicoCompleto])

  const carregarMedicamentos = async () => {
    const userName = sessionStorage.getItem('userName')
    if (!userName) return
    setLoading(true)
    try {
      let usuarioId = sessionStorage.getItem('userId')
      if (!usuarioId) { usuarioId = 1; sessionStorage.setItem('userId', usuarioId) }

      // 1. Busca agendas do usuário
      const agendaResp = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/agenda`)
      if (!agendaResp.ok) throw new Error('Erro ao buscar agendas')
      const agendas = await agendaResp.json()
      const agendasArray = Array.isArray(agendas) ? agendas : []

      // 2. Para cada agenda, busca medicamentos
      const todasPromises = agendasArray.map(ag =>
        fetch(`${API_BASE_URL}/api/agenda/${ag.id}/medicamentos`)
          .then(r => r.ok ? r.json() : [])
          .then(meds => (Array.isArray(meds) ? meds : []).map(m => ({ ...m, agenda: ag })))
      )
      const resultados = await Promise.all(todasPromises)
      const todosMedicamentos = resultados.flat()
      setMedicamentos(todosMedicamentos)
      localStorage.setItem('medicamentos', JSON.stringify(todosMedicamentos))
    } catch {
      console.log('Usando localStorage como fallback')
      const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
      const medicamentosUsuario = Array.isArray(medicamentosExistentes)
        ? medicamentosExistentes.filter(med => med.usuario === userName)
        : []
      setMedicamentos(medicamentosUsuario)
    }
    setLoading(false)
  }
  
  useEffect(() => {
    carregarMedicamentos()
  }, [])
  
  // Medicamento do backend: { id, nome, descricao (dosagem), tipo (frequencia), complemento, agenda: { horario } }
  const agendaMedicamentos = Array.isArray(medicamentos) ? medicamentos.filter(Boolean).map(med => ({
    ...med,
    dosagem: med.descricao || med.dosagem || med.agenda?.dosagem || '',
    horario: formatHorario(med.agenda?.horario || med.horario || ''),
    frequencia: normalizeFrequency(med.tipo || med.frequencia || ''),
    status: med.statusMedicamento || 'ATIVO'
  })) : []

  const renderDashboard = () => {
    const dailyStats = getDailyMedicationStats()
    const adesao = dailyStats.adesao
    const agora = new Date()
    const hora = agora.getHours()
    const userName = sessionStorage.getItem('userName') || 'Usuário'
    let saudacao = 'Bom dia'
    if (hora >= 12 && hora < 18) saudacao = 'Boa tarde'
    else if (hora >= 18) saudacao = 'Boa noite'

    const medicamentosOrdenados = [...agendaMedicamentos].sort((a, b) => {
      const dateA = getHistoricoDate({ horario: a.horario }) || new Date(0)
      const dateB = getHistoricoDate({ horario: b.horario }) || new Date(0)
      return dateA - dateB
    })
    const proximoMedicamento = medicamentosOrdenados.find((med) => {
      const statusHoje = getMedicationStatusToday(med)
      const horario = getHistoricoDate({ horario: med.horario })
      return horario && horario >= agora && !['TOMADO', 'IGNORADO'].includes(statusHoje)
    }) || medicamentosOrdenados.find((med) => !['TOMADO', 'IGNORADO'].includes(getMedicationStatusToday(med)))

    const proximosMedicamentos = medicamentosOrdenados
      .filter((med) => !['TOMADO', 'IGNORADO'].includes(getMedicationStatusToday(med)))
      .slice(0, 4)

    const heroStatus = dailyStats.perdidos > 0
      ? {
          tone: 'danger',
          icon: 'warning',
          title: `Você possui ${dailyStats.perdidos} medicamento${dailyStats.perdidos > 1 ? 's' : ''} atrasado${dailyStats.perdidos > 1 ? 's' : ''}.`,
          subtitle: 'Revise sua agenda e registre a ação necessária.'
        }
      : dailyStats.pendentes > 0
        ? {
            tone: 'attention',
            icon: 'time',
            title: `Você possui ${dailyStats.pendentes} medicamento${dailyStats.pendentes > 1 ? 's' : ''} próximo${dailyStats.pendentes > 1 ? 's' : ''} do horário.`,
            subtitle: 'Tudo certo, só fique atento ao próximo horário.'
          }
        : {
            tone: 'success',
            icon: 'checklist',
            title: 'Todos os medicamentos estão em dia.',
            subtitle: 'Sua rotina de hoje está organizada.'
          }
    
    return (
      <div className="dashboard-container">
        <section className={`home-hero home-hero--${heroStatus.tone}`} aria-labelledby="home-status-title">
          <div className="home-hero__status">
            <Widget type={heroStatus.icon} className="home-hero__icon" />
            <div>
              <p>{saudacao}, {userName}</p>
              <h2 id="home-status-title">{heroStatus.title}</h2>
              <span>{heroStatus.subtitle}</span>
            </div>
          </div>

          <div className="home-hero__next">
            <span>Próximo medicamento</span>
            {proximoMedicamento ? (
              <strong>{proximoMedicamento.nome} {proximoMedicamento.dosagem} às {proximoMedicamento.horario}</strong>
            ) : (
              <strong>Nenhum medicamento pendente hoje</strong>
            )}
          </div>
        </section>

        <section className="home-summary" aria-label="Resumo do dia">
          <div className="home-summary__item">
            <span>Tomados Hoje</span>
            <strong>{dailyStats.tomados}</strong>
          </div>
          <div className="home-summary__item">
            <span>Pendentes</span>
            <strong>{dailyStats.pendentes}</strong>
          </div>
          <div className="home-summary__item">
            <span>Adesão</span>
            <strong>{adesao}%</strong>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section__header">
            <div>
              <p>Agenda de hoje</p>
              <h3>Próximos medicamentos</h3>
            </div>
            <button className="btn-link" onClick={() => setActiveSection('agenda')}>Ver agenda</button>
          </div>

          <div className="home-med-list">
            {loading ? (
              <div className="home-empty-state">Carregando medicamentos...</div>
            ) : agendaMedicamentos.length === 0 ? (
              <div className="home-empty-state">
                <span>Nenhum medicamento cadastrado ainda.</span>
                <button onClick={() => setActiveSection('adicionar-medicamento')} className="empty-action">
                  Adicionar primeiro medicamento
                </button>
              </div>
            ) : proximosMedicamentos.length === 0 ? (
              <div className="home-empty-state">Nenhum medicamento pendente para hoje.</div>
            ) : (
              proximosMedicamentos.map((med) => {
                const statusHoje = getMedicationStatusToday(med)
                const badge = getStatusBadge(statusHoje)
                const jaTomado = statusHoje === 'TOMADO' || medicamentosTomados.includes(med.id)
                const jaIgnorado = statusHoje === 'IGNORADO'

                return (
                  <article key={med.id} className={`home-med-card home-med-card--${statusHoje.toLowerCase()}`}>
                    <div className="home-med-card__time">{med.horario}</div>
                    <div className="home-med-card__body">
                      <strong>{med.nome}</strong>
                      <span>{med.dosagem || 'Dosagem não informada'}</span>
                    </div>
                    <span className={`badge status-badge status-badge--${badge.tone}`}>
                      <span className="status-badge__icon" aria-hidden="true">{badge.icon}</span>
                      {badge.text}
                    </span>
                    <div className="home-med-card__actions">
                      {!jaTomado && !jaIgnorado && (
                        <>
                          <button className="btn-take" onClick={() => marcarComoTomado(med)}>
                            <Widget type="checklist" /> Tomado
                          </button>
                          <button className="btn-ignore" onClick={() => abrirModalIgnorar({ med })}>
                            <Widget type="delete" /> Ignorar
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </section>

        <div className="home-quick-actions">
          <button onClick={() => setActiveSection('agenda')}>
            <Widget type="list" />
            Agenda
          </button>
          <button onClick={() => setActiveSection('historico')}>
            <Widget type="list" />
            Histórico
          </button>
        </div>
      </div>
    )
  }

  const handleAddMedicamento = async () => {
    if (novoMedicamento.nome && novoMedicamento.dosagem && novoMedicamento.horario) {
      try {
        let usuarioId = sessionStorage.getItem('userId')
        if (!usuarioId) { usuarioId = 1; sessionStorage.setItem('userId', usuarioId) }

        // 1. Cria ou reutiliza agenda do usuário
        sessionStorage.removeItem('agendaId')
        let agendaId = sessionStorage.getItem('agendaId')
        if (!agendaId) {
          const agendas = []
          if (Array.isArray(agendas) && agendas.length > 0) {
            agendaId = agendas[0].id
            sessionStorage.setItem('agendaId', agendaId)
          } else {
            // Cria agenda padrão
            const novaAgendaResp = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/agenda`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nome: novoMedicamento.nome,
                dosagem: novoMedicamento.dosagem,
                horario: novoMedicamento.horario || '08:00',
                dataInicio: toBackendDateTime(new Date()),
                dataFim: toBackendDateTime(getTreatmentEndDate(novoMedicamento.duracao)),
                observacoes: novoMedicamento.observacoes || ''
              })
            })
            if (!novaAgendaResp.ok) {
              const errText = await novaAgendaResp.text()
              console.error('Erro ao criar agenda:', errText)
              throw new Error(`Erro ao criar agenda: ${errText}`)
            }
            const novaAgenda = await novaAgendaResp.json()
            agendaId = novaAgenda.id
            sessionStorage.setItem('agendaId', agendaId)
          }
        }

        // 2. Cria medicamento vinculado à agenda
        const response = await fetch(`${API_BASE_URL}/api/agenda/${agendaId}/medicamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: novoMedicamento.nome,
            descricao: novoMedicamento.dosagem,
            tipo: normalizeFrequency(novoMedicamento.frequencia),
            complemento: novoMedicamento.observacoes || novoMedicamento.duracao || '',
            statusMedicamento: 'ATIVO'
          })
        })
        if (response.ok) {
          showToastMessage('Medicamento adicionado com sucesso!')
          setNovoMedicamento({ nome: '', dosagem: '', horario: '', frequencia: 'diario', duracao: '1-semana', observacoes: '' })
          await carregarMedicamentos()
          carregarHistoricoCompleto()
        } else {
          const errText = await response.text()
          console.error('Erro ao salvar medicamento:', errText)
          showToastMessage(`Erro ao salvar: ${errText}`)
        }
      } catch (error) {
        console.error('Erro de conexão ao salvar medicamento:', error)
        showToastMessage(`Erro de conexão: ${error.message}`)
      }
    } else {
      showToastMessage('Preencha todos os campos obrigatórios!')
    }
  }

  const handleAddLembrete = (e) => {
    e.preventDefault()
    if (novoLembrete.titulo && novoLembrete.data && novoLembrete.horario) {
      const lembretesExistentes = JSON.parse(localStorage.getItem('lembretes') || '[]')
      const novoLembreteObj = {
        id: Date.now(),
        ...novoLembrete,
        usuario: sessionStorage.getItem('userName')
      }
      lembretesExistentes.push(novoLembreteObj)
      localStorage.setItem('lembretes', JSON.stringify(lembretesExistentes))
      
      showToastMessage('Lembrete adicionado com sucesso!')
      setNovoLembrete({ titulo: '', descricao: '', data: '', horario: '' })
      carregarLembretes()
    }
  }
  
  const carregarLembretes = () => {
    const userName = sessionStorage.getItem('userName')
    if (!userName) return
    
    const lembretesExistentes = JSON.parse(localStorage.getItem('lembretes') || '[]')
    const lembretesUsuario = lembretesExistentes.filter(l => l.usuario === userName)
    setLembretes(lembretesUsuario)
  }
  
  const carregarHistoricoCompleto = async () => {
    try {
      let usuarioId = sessionStorage.getItem('userId')
      if (!usuarioId) { usuarioId = 1; sessionStorage.setItem('userId', usuarioId) }

      const response = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/historico`)
      if (response.ok) {
        const historico = await response.json()
        const historicoArray = Array.isArray(historico) ? historico : []
        setHistoricoCompleto(historicoArray)
      } else {
        throw new Error('Backend não disponível')
      }
    } catch {
      // Fallback para localStorage
      const userName = sessionStorage.getItem('userName')
      const medicamentosTomadosLocal = JSON.parse(localStorage.getItem('medicamentosTomados') || '[]')
      const medicamentosIgnorados = JSON.parse(localStorage.getItem('medicamentosIgnorados') || '[]')
      const historicoExclusoes = JSON.parse(localStorage.getItem('historicoExclusoes') || '[]')
      const medicamentosLocal = JSON.parse(localStorage.getItem('medicamentos') || '[]')
      
      // Histórico de medicamentos tomados
      const historicoTomados = medicamentosTomadosLocal
        .filter(mt => mt.usuario === userName)
        .map(mt => {
          const medicamento = medicamentosLocal.find(m => m.id === mt.medicamentoId)
          return {
            nomeMedicamento: medicamento ? medicamento.nome : 'Medicamento',
            dosagem: medicamento ? medicamento.dosagem : '',
            acao: 'TOMADO',
            dataHora: mt.dataHora,
            detalhes: `Medicamento tomado conforme programado`
          }
        })

      const historicoIgnorados = medicamentosIgnorados
        .filter(mi => mi.usuario === userName)
        .map(mi => ({
          ...mi,
          nome: mi.nome || 'Medicamento',
          dosagem: mi.dosagem || '',
          status: 'IGNORADO'
        }))
      
      // Histórico de exclusões
      const historicoExcluidos = historicoExclusoes
        .filter(he => he.usuario === userName)
        .map(he => ({
          nomeMedicamento: he.nomeMedicamento,
          dosagem: he.dosagem,
          acao: 'EXCLUIDO',
          dataHora: he.dataHora,
          detalhes: `Medicamento removido da agenda`
        }))
      
      // Combinar e ordenar todos os históricos
      const historicoLocal = [
        ...(Array.isArray(historicoTomados) ? historicoTomados : []),
        ...(Array.isArray(historicoIgnorados) ? historicoIgnorados : []),
        ...(Array.isArray(historicoExcluidos) ? historicoExcluidos : [])
      ]
        .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
      
      setHistoricoCompleto(Array.isArray(historicoLocal) ? historicoLocal : [])
    }
  }
  
  const carregarPerfilUsuario = async () => {
    try {
      const userId = sessionStorage.getItem('userId')
      if (userId) {
        const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}`)
        if (response.ok) {
          const usuario = await response.json()

console.log("Usuário do backend:", usuario)
console.log("Foto da sessão:", sessionStorage.getItem("userPhoto"))

setPerfil({
    nome: usuario.nome,
    senha: '******',
    email: usuario.email,
    dataNascimento: usuario.dataNascimento || '',    
    comorbidade: usuario.comorbidade || '',
    foto: usuario.foto || sessionStorage.getItem('userPhoto') || ''
})
          // Atualizar sessionStorage com dados do backend
          sessionStorage.setItem('userName', usuario.nome)
          sessionStorage.setItem('userEmail', usuario.email)
          return
        }
      }
    } catch {
      console.log('Usando dados do sessionStorage')
    }
    
    // Fallback para sessionStorage e localStorage
    const userName = sessionStorage.getItem('userName')
    let userEmail = sessionStorage.getItem('userEmail')
    let userDataNascimento = ''
    let userComorbidade = ''
    
    // Buscar dados completos do localStorage
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
    const usuarioEncontrado = usuariosCadastrados.find(u => u.nome === userName || u.email === userEmail)
    
    if (usuarioEncontrado) {
      userEmail = usuarioEncontrado.email
      userDataNascimento = usuarioEncontrado.dataNascimento || ''
      userComorbidade = usuarioEncontrado.comorbidade || ''
      sessionStorage.setItem('userEmail', userEmail)
    }
    
    // Também verificar se há dados salvos no perfil local
    const perfilLocal = JSON.parse(localStorage.getItem('perfilUsuario') || '{}')
    if (perfilLocal.nome === userName) {
      userDataNascimento = perfilLocal.dataNascimento  || userDataNascimento
      userComorbidade = perfilLocal.comorbidade || userComorbidade
    }
    
    setPerfil({
  nome: userName || 'Usuário',
  senha: '******',
  email: userEmail || 'Não informado',
  dataNascimento: userDataNascimento || '',
  comorbidade: userComorbidade || '',
  foto: sessionStorage.getItem('userPhoto') || userData?.foto || ''
})
  }
  
  useEffect(() => {
    carregarLembretes()
    carregarHistoricoCompleto()
    carregarPerfilUsuario()
  }, [])

  const handleEditMedicamento = (med) => {
    setEditingMed(med)
    setEditMedicamento({
      nome: med.nome,
      dosagem: med.descricao || med.dosagem || '',
      horario: formatHorario(med.agenda?.horario || med.horario || ''),
      frequencia: med.tipo || med.frequencia || 'Diário',
      observacao: med.complemento || med.observacao || ''
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      if (editingMed.agenda?.id) {
        const agendaResponse = await fetch(`${API_BASE_URL}/api/agenda/${editingMed.agenda.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: editMedicamento.nome,
            dosagem: editMedicamento.dosagem,
            horario: editMedicamento.horario || editingMed.agenda.horario || '08:00',
            dataInicio: editingMed.agenda.dataInicio || toBackendDateTime(new Date()),
            dataFim: editingMed.agenda.dataFim || toBackendDateTime(getTreatmentEndDate(editingMed.complemento)),
            observacoes: editMedicamento.observacao || editingMed.agenda.observacoes || ''
          })
        })
        if (!agendaResponse.ok) {
          showToastMessage(await getApiErrorMessage(agendaResponse, 'Erro ao atualizar agenda'))
          return
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/medicamentos/${editingMed.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: editMedicamento.nome,
          descricao: editMedicamento.dosagem,
          tipo: normalizeFrequency(editMedicamento.frequencia),
          complemento: editMedicamento.observacao || '',
          statusMedicamento: editingMed.statusMedicamento || 'ATIVO'
        })
      })
      
      if (response.ok) {
        showToastMessage('Medicamento atualizado com sucesso!')
        setShowEditModal(false)
        setEditingMed(null)
        await carregarMedicamentos()
        carregarHistoricoCompleto()
      } else {
        showToastMessage(await getApiErrorMessage(response, 'Erro ao atualizar medicamento'))
      }
    } catch {
      console.log('Usando localStorage para edição')
      // Fallback para localStorage se backend não disponível
      const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
      const medicamentosAtualizados = medicamentosExistentes.map(med => 
        med.id === editingMed.id ? { ...med, ...editMedicamento } : med
      )
      localStorage.setItem('medicamentos', JSON.stringify(medicamentosAtualizados))
      
      showToastMessage('Medicamento atualizado com sucesso!')
      setShowEditModal(false)
      setEditingMed(null)
      await carregarMedicamentos()
    }
  }

  const handleDeleteMedicamento = async (medId) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/medicamentos/${medId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          showToastMessage('Medicamento excluído com sucesso!')
          await carregarMedicamentos()
          setTimeout(() => carregarHistoricoCompleto(), 500)
        } else {
          showToastMessage(await getApiErrorMessage(response, 'Erro ao excluir medicamento'))
        }
      } catch {
        const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
        const medicamento = medicamentosExistentes.find(med => med.id === medId)
        
        // Registrar exclusão no histórico
        if (medicamento) {
          const historicoExclusao = JSON.parse(localStorage.getItem('historicoExclusoes') || '[]')
          historicoExclusao.push({
            medicamentoId: medId,
            nomeMedicamento: medicamento.nome,
            dosagem: medicamento.dosagem,
            acao: 'EXCLUIDO',
            dataHora: new Date().toISOString(),
            usuario: sessionStorage.getItem('userName')
          })
          localStorage.setItem('historicoExclusoes', JSON.stringify(historicoExclusao))
        }
        
        const medicamentosAtualizados = medicamentosExistentes.filter(med => med.id !== medId)
        localStorage.setItem('medicamentos', JSON.stringify(medicamentosAtualizados))
        
        showToastMessage('Medicamento excluído com sucesso!')
        await carregarMedicamentos()
        await carregarHistoricoCompleto()
      }
    }
  }

  const handleDeleteMedicamentoModal = async () => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/medicamentos/${editingMed.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          showToastMessage('Medicamento excluído com sucesso!')
          setShowEditModal(false)
          setEditingMed(null)
          await carregarMedicamentos()
          setTimeout(() => carregarHistoricoCompleto(), 500)
        } else {
          showToastMessage(await getApiErrorMessage(response, 'Erro ao excluir medicamento'))
        }
      } catch {
        // Registrar exclusão no histórico
        const historicoExclusao = JSON.parse(localStorage.getItem('historicoExclusoes') || '[]')
        historicoExclusao.push({
          medicamentoId: editingMed.id,
          nomeMedicamento: editingMed.nome,
          dosagem: editingMed.dosagem,
          acao: 'EXCLUIDO',
          dataHora: new Date().toISOString(),
          usuario: sessionStorage.getItem('userName')
        })
        localStorage.setItem('historicoExclusoes', JSON.stringify(historicoExclusao))
        
        const medicamentosExistentes = JSON.parse(localStorage.getItem('medicamentos') || '[]')
        const medicamentosAtualizados = medicamentosExistentes.filter(med => med.id !== editingMed.id)
        localStorage.setItem('medicamentos', JSON.stringify(medicamentosAtualizados))
        
        showToastMessage('Medicamento excluído com sucesso!')
        setShowEditModal(false)
        setEditingMed(null)
        await carregarMedicamentos()
        await carregarHistoricoCompleto()
      }
    }
  }



  const renderAgenda = () => {
    const medicamentosFiltrados = agendaMedicamentos.filter(med => 
      med.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return (
      <>
        <h2 className="section-title">Agenda de medicamentos</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar medicamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="btn-add-med"
            onClick={() => setActiveSection('adicionar-medicamento')}
          >
            <Widget type="add" className="btn-icon" />
            Adicionar Medicamento
          </button>
        </div>
        <div className="agenda">
          {loading ? (
            <div style={{textAlign: 'center', padding: '40px'}}>Carregando medicamentos...</div>
          ) : medicamentosFiltrados.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
              {searchTerm ? 'Nenhum medicamento encontrado com esse nome.' : 'Nenhum medicamento cadastrado ainda.'}
              <br />
              <button 
                onClick={() => setActiveSection('adicionar-medicamento')}
                className="empty-action"
              >
                Adicionar Medicamento
              </button>
            </div>
          ) : medicamentosFiltrados.map((med, index) => {
            const statusHoje = getMedicationStatusToday(med)
            const badge = getStatusBadge(statusHoje)
            const jaTomado = statusHoje === 'TOMADO' || medicamentosTomados.includes(med.id)
            const jaIgnorado = statusHoje === 'IGNORADO'
            return (
              <div key={index} className={`med-row med-row--${statusHoje.toLowerCase()} ${jaTomado ? 'med-row--taken' : ''}`}>
                <div className="med-row__info">
                  <span className="med-row__name">{med.nome}</span>
                  <span className="med-row__meta">{med.dosagem} · {med.horario} · {med.frequencia}</span>
                </div>
                <span className={`badge status-badge status-badge--${badge.tone}`}>
                  <span className="status-badge__icon" aria-hidden="true">{badge.icon}</span>
                  {badge.text}
                </span>
                <div className="med-row__actions">
                  {!jaTomado && !jaIgnorado && med.status !== 'tomado' && (
                    <button className="btn-take" onClick={() => marcarComoTomado(med)} title="Marcar como tomado"><Widget type="checklist" /> Tomado</button>
                  )}
                  {!jaTomado && !jaIgnorado && (
                    <button className="btn-ignore" onClick={() => abrirModalIgnorar({ med })} title="Ignorar medicamento"><Widget type="delete" /> Ignorar</button>
                  )}
                  <button className="btn-edit" onClick={() => handleEditMedicamento(med)} title="Editar"><Widget type="edit" /></button>
                  <button className="btn-delete-small" onClick={() => handleDeleteMedicamento(med.id)} title="Excluir"><Widget type="delete" /></button>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const renderMedicamentoForm = () => (
    <div className="add-card medicamento-card add-card--single">
      <div className="form-modern">
        <div className="add-form-heading">
          <Widget type="pill" className="add-form-heading__icon" />
          <div>
            <h2>Novo Medicamento</h2>
            <p>Preencha as informacoes do medicamento.</p>
          </div>
        </div>

        <div className="input-group">
          <label>Nome do medicamento</label>
          <input
            type="text"
            placeholder="Ex: Paracetamol, Dipirona, Ibuprofeno..."
            value={novoMedicamento.nome}
            onChange={(e) => setNovoMedicamento({...novoMedicamento, nome: e.target.value})}
            className="input-modern"
            required
          />
        </div>

        <div className="input-row input-row--three">
          <div className="input-group">
            <label>Dosagem</label>
            <input
              type="text"
              placeholder="Ex: 500mg, 1 comprimido"
              value={novoMedicamento.dosagem}
              onChange={(e) => setNovoMedicamento({...novoMedicamento, dosagem: e.target.value})}
              className="input-modern"
              required
            />
          </div>

          <div className="input-group">
            <label>Horario</label>
            <input
              type="time"
              value={novoMedicamento.horario}
              onChange={(e) => setNovoMedicamento({...novoMedicamento, horario: e.target.value})}
              className="input-modern"
              required
            />
          </div>

          <div className="input-group">
            <label>Frequencia</label>
            <select
              value={novoMedicamento.frequencia}
              onChange={(e) => setNovoMedicamento({...novoMedicamento, frequencia: e.target.value})}
              className="select-modern"
            >
              <option value="diario">Diario</option>
              <option value="12h">A cada 12h</option>
              <option value="8h">A cada 8h</option>
              <option value="Semanal">Semanal</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Duracao do tratamento</label>
          <select
            value={novoMedicamento.duracao}
            onChange={(e) => setNovoMedicamento({...novoMedicamento, duracao: e.target.value})}
            className="select-modern"
          >
            <option value="1-semana">1 semana</option>
            <option value="1 dia">1 dia</option>
            <option value="3 dias">3 dias</option>
            <option value="5 dias">5 dias</option>
            <option value="2 semanas">2 semanas</option>
            <option value="1 mês">1 mes</option>
            <option value="3 meses">3 meses</option>
            <option value="6 meses">6 meses</option>
            <option value="Contínuo">Continuo</option>
          </select>
        </div>

        <div className="input-group">
          <label>Observacoes (opcional)</label>
          <textarea
            placeholder="Ex: Tomar apos as refeicoes, com bastante agua..."
            value={novoMedicamento.observacoes}
            onChange={(e) => setNovoMedicamento({...novoMedicamento, observacoes: e.target.value})}
            className="textarea-modern"
            rows="3"
          />
        </div>

        <button
          onClick={handleAddMedicamento}
          className="btn-add-modern medicamento"
          type="button"
        >
          <Widget type="add" className="btn-icon" />
          Adicionar Medicamento
        </button>
      </div>
    </div>
  )

  const renderLembreteForm = () => (
    <div className="add-card lembrete-card add-card--single">
      <div className="form-modern">
        <div className="add-form-heading">
          <Widget type="bell" className="add-form-heading__icon" />
          <div>
            <h2>Novo Lembrete</h2>
            <p>Preencha as informacoes do lembrete.</p>
          </div>
        </div>

        <div className="input-group">
          <label>Titulo do lembrete</label>
          <input
            type="text"
            placeholder="Ex: Consulta medica, exame de sangue..."
            value={novoLembrete.titulo}
            onChange={(e) => setNovoLembrete({...novoLembrete, titulo: e.target.value})}
            className="input-modern"
            required
          />
        </div>

        <div className="input-group">
          <label>Descricao (opcional)</label>
          <textarea
            placeholder="Adicione detalhes sobre o lembrete..."
            value={novoLembrete.descricao}
            onChange={(e) => setNovoLembrete({...novoLembrete, descricao: e.target.value})}
            className="textarea-modern"
            rows="3"
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Data</label>
            <input
              type="date"
              value={novoLembrete.data}
              onChange={(e) => setNovoLembrete({...novoLembrete, data: e.target.value})}
              className="input-modern"
              required
            />
          </div>

          <div className="input-group">
            <label>Horario</label>
            <input
              type="time"
              value={novoLembrete.horario}
              onChange={(e) => setNovoLembrete({...novoLembrete, horario: e.target.value})}
              className="input-modern"
              required
            />
          </div>
        </div>

        <button
          onClick={handleAddLembrete}
          className="btn-add-modern lembrete"
          type="button"
        >
          <Widget type="bell" className="btn-icon" />
          Adicionar Lembrete
        </button>
      </div>
    </div>
  )

  const renderAdicionar = (tipo = 'medicamento') => {
    const isLembrete = tipo === 'lembrete'
    const addOptions = [
      {
        type: 'medicamento',
        icon: 'pill',
        title: 'Medicamento',
        description: 'Adicione um novo medicamento ao seu tratamento',
        section: 'adicionar-medicamento'
      },
      {
        type: 'lembrete',
        icon: 'bell',
        title: 'Lembrete',
        description: 'Adicione um lembrete para consultas, exames ou cuidados',
        section: 'adicionar-lembrete'
      }
    ]

    return (
      <div className="adicionar-container add-flow">
        <div className="adicionar-header add-flow__header">
          <div className="header-content">
            <div className="add-flow__breadcrumb">
              <button type="button" onClick={() => setActiveSection('dashboard')}>Dashboard</button>
              <span>&gt;</span>
              <strong>Adicionar</strong>
            </div>
            <h1 className="page-title">Adicionar</h1>
            <p className="page-subtitle">Escolha o que deseja adicionar a sua agenda de tratamento.</p>
          </div>
        </div>

        <div className="add-flow__type-grid" role="tablist" aria-label="Tipo de cadastro">
          {addOptions.map((option) => {
            const selected = option.type === tipo
            return (
              <button
                key={option.type}
                type="button"
                className={`add-type-card add-type-card--${option.type} ${selected ? 'is-selected' : ''}`}
                onClick={() => setActiveSection(option.section)}
                aria-pressed={selected}
              >
                <Widget type={option.icon} className="add-type-card__icon" />
                <span className="add-type-card__body">
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
                {selected && <Widget type="checklist" className="add-type-card__check" />}
              </button>
            )
          })}
        </div>

        <div className="add-flow__form">
          {isLembrete ? renderLembreteForm() : renderMedicamentoForm()}
        </div>
      </div>
    )
  }

  const confirmarHistorico = async (id) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/historico/${id}/confirmar`, { method: 'PATCH' })
      if (resp.ok) { showToastMessage('Uso confirmado!'); carregarHistoricoCompleto() }
    } catch { showToastMessage('Erro ao confirmar') }
  }

  const renderHistorico = () => {
    const getStatusIcon = (status) => {
      switch(status) {
        case 'TOMADO': return <Widget type="checklist" />
        case 'CONFIRMADO': return <Widget type="checklist" />
        case 'IGNORADO': return <Widget type="delete" />
        case 'PERDIDO': return <Widget type="warning" />
        case 'PENDENTE': return <Widget type="time" />
        default: return <Widget type="list" />
      }
    }

    const getHistoricoDate = (item) => {
      if (!item) return null
      if (item.dataConfirmacao) return new Date(item.dataConfirmacao)
      if (item.dataHoraIgnorado) return new Date(item.dataHoraIgnorado)
      if (item.dataHora) return new Date(item.dataHora)
      if (item.horario) {
        const [hour = '0', minute = '0'] = String(item.horario).split(':')
        const date = new Date()
        date.setHours(Number(hour), Number(minute), 0, 0)
        return date
      }
      return null
    }

    const isSameDay = (left, right) => {
      return left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate()
    }

    const isPendingMissed = (item) => {
      if (!item) return false
      if (item.status !== 'PENDENTE' || !item.horario) return false
      const scheduledDate = getHistoricoDate(item)
      return scheduledDate && scheduledDate < new Date()
    }

    const hasHistoricoToday = (med) => {
      if (!med) return false
      const today = new Date()
      return Array.isArray(historicoCompleto) && historicoCompleto.some((item) => {
        const itemMedId = item?.medicamento?.id || item?.medicamentoId
        const itemDate = getHistoricoDate(item)
        return itemMedId === med.id && itemDate && isSameDay(itemDate, today)
      })
    }

    const missedFromAgenda = agendaMedicamentos
      .filter((med) => {
        if (!med) return false
        if (!med.horario || med.status === 'INATIVO') return false
        const scheduledDate = getHistoricoDate({ horario: med.horario })
        return scheduledDate && scheduledDate < new Date() && !hasHistoricoToday(med)
      })
      .map((med) => ({
        id: `missed-${med.id}`,
        nome: med.nome,
        dosagem: med.dosagem,
        horario: med.horario,
        status: 'PERDIDO',
        virtualMissed: true,
        observacoes: 'Horario passou e o medicamento nao foi marcado como tomado.'
      }))

    const historicoComPerdidos = [
      ...(Array.isArray(historicoCompleto) ? historicoCompleto.filter(Boolean) : []).map((item) => ({
        ...item,
        statusVisual: isPendingMissed(item) ? 'PERDIDO' : item.status
      })),
      ...missedFromAgenda
    ].sort((a, b) => {
      const dateA = getHistoricoDate(a) || new Date(0)
      const dateB = getHistoricoDate(b) || new Date(0)
      return dateB - dateA
    })

    const filteredHistorico = historicoComPerdidos.filter((item) => {
      if (historyFilter === 'all') return true
      const date = getHistoricoDate(item)
      if (!date || Number.isNaN(date.getTime())) return false
      const diffDays = (new Date() - date) / (1000 * 60 * 60 * 24)
      return historyFilter === 'week' ? diffDays <= 7 : diffDays <= 31
    })
    return (
      <>
        <h2 className="section-title">Histórico de Medicamentos</h2>
        <div className="history-tabs" aria-label="Filtrar histórico por período">
          <button className={historyFilter === 'week' ? 'active' : ''} onClick={() => setHistoryFilter('week')}>Esta semana</button>
          <button className={historyFilter === 'month' ? 'active' : ''} onClick={() => setHistoryFilter('month')}>Este mês</button>
          <button className={historyFilter === 'all' ? 'active' : ''} onClick={() => setHistoryFilter('all')}>Todos</button>
        </div>
        <div className="historico">
          {filteredHistorico.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
              <h3><Widget type="list" className="title-widget" />Nenhum histórico ainda</h3>
              <p>Marque medicamentos como tomados para ver o histórico aqui.</p>
            </div>
          ) : (
            filteredHistorico.map((item, index) => {
              const dataConfirmacao = getHistoricoDate(item)
              const statusVisual = item.statusVisual || item.status
              const statusLabel = isTakenStatus(statusVisual) ? 'TOMADO' : statusVisual
              const hoje = new Date()
              const ontem = new Date(hoje); ontem.setDate(hoje.getDate() - 1)
              let dataTexto = dataConfirmacao ? dataConfirmacao.toLocaleDateString('pt-BR') : '—'
              if (dataConfirmacao) {
                if (dataConfirmacao.toDateString() === hoje.toDateString()) dataTexto = 'Hoje'
                else if (dataConfirmacao.toDateString() === ontem.toDateString()) dataTexto = 'Ontem'
              }
              const observacaoTexto = typeof item.observacoes === 'string' ? item.observacoes.trim().toLowerCase() : ''
              const isDurationOnly = ['1 semana', '1semana', '1-semana'].includes(observacaoTexto)
              return (
                <div key={index} className="card historico-item">
                  <div className="historico-header">
                    <div className={`historico-icon historico-icon--${(statusLabel || 'default').toLowerCase()}`}>
                      {getStatusIcon(statusLabel)}
                    </div>
                    <div className="historico-info">
                      <h4>{item.nome} {item.dosagem}</h4>
                      <span className="historico-acao">{statusLabel}{item.duracao ? ` · ${item.duracao}` : ' · 1 semana'}</span>
                    </div>
                    <div className="historico-time">
                      <span>{dataTexto}</span>
                      {dataConfirmacao && <span>{dataConfirmacao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  </div>
                  {item.status === 'PENDENTE' && !item.virtualMissed && (
                    <div className="pending-actions">
                      <button onClick={() => confirmarHistorico(item.id)} className="btn-status btn-status--confirm"><Widget type="checklist" /> Confirmar</button>
                      <button onClick={() => abrirModalIgnorar({ historicoId: item.id, med: item })} className="btn-status btn-status--ignore"><Widget type="delete" /> Ignorar</button>
                    </div>
                  )}
                  {item.observacoes && !isDurationOnly && <div className="historico-detalhes"><p>{item.observacoes}</p></div>}
                  {item.motivoIgnorado && <div className="historico-detalhes"><p>Motivo: {item.motivoIgnorado}</p></div>}
                </div>
              )
            })
          )}
        </div>
      </>
    )
  }



  const handleSavePerfil = async (e) => {
    e.preventDefault()
    
    try {
      const userId = sessionStorage.getItem('userId')
      const usuarioAtualResp = await fetch(`${API_BASE_URL}/api/usuarios/${userId}`)
      const usuarioAtual = usuarioAtualResp.ok ? await usuarioAtualResp.json() : {}
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: perfil.nome,
          ...(perfil.senha !== '******' && perfil.senha ? { senha: perfil.senha } : {}),
          email: perfil.email,
          dataNascimento: perfil.dataNascimento || usuarioAtual.dataNascimento || null,
          comorbidade: perfil.comorbidade
        })
      })
      
      if (response.ok) {
        sessionStorage.setItem('userName', perfil.nome)
        sessionStorage.setItem('userEmail', perfil.email)
        
        // Salvar no localStorage como backup
        localStorage.setItem('perfilUsuario', JSON.stringify({
          nome: perfil.nome,
          email: perfil.email,
          dataNascimento: perfil.dataNascimento,
          comorbidade: perfil.comorbidade
        }))
        
        showToastMessage('Perfil atualizado com sucesso!')
        setShowProfileModal(false)
      } else {
        throw new Error('Erro no backend')
      }
    } catch {
      // Fallback para localStorage
      sessionStorage.setItem('userName', perfil.nome)
      sessionStorage.setItem('userEmail', perfil.email)
      
      // Salvar todos os dados no localStorage
      localStorage.setItem('perfilUsuario', JSON.stringify({
        nome: perfil.nome,
        email: perfil.email,
        dataNascimento: perfil.dataNascimento,
        comorbidade: perfil.comorbidade
      }))
      
      // Atualizar também o array de usuários cadastrados
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      const index = usuariosCadastrados.findIndex(u => u.nome === perfil.nome || u.email === perfil.email)
      if (index !== -1) {
        usuariosCadastrados[index] = {
          ...usuariosCadastrados[index],
          nome: perfil.nome,
          email: perfil.email,
          dataNascimento: perfil.dataNascimento,
          comorbidade: perfil.comorbidade
        }
        localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados))
      }
      
      showToastMessage('Perfil atualizado com sucesso!')
      setShowProfileModal(false)
    }
  }

  const hashSenha = async (senha) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(senha)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleSaveProfileEdit = async (e) => {
    e.preventDefault()
    
    if (!editProfile.nome || !editProfile.senhaAtual || !editProfile.novaSenha) {
      showToastMessage('Preencha todos os campos!')
      return
    }
    
    try {
      const userId = sessionStorage.getItem('userId')
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          nome: editProfile.nome,
          senhaAtual: editProfile.senhaAtual,
          novaSenha: editProfile.novaSenha
        })
      })
      
      if (response.ok) {
        sessionStorage.setItem('userName', editProfile.nome)
        setPerfil({...perfil, nome: editProfile.nome})
        showToastMessage('Nome e senha atualizados com sucesso!')
        setShowEditProfileModal(false)
        setEditProfile({ nome: '', senhaAtual: '', novaSenha: '' })
      } else {
        showToastMessage(await getApiErrorMessage(response, 'Senha atual incorreta'))
      }
    } catch {
      // Fallback para localStorage
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      const currentUser = sessionStorage.getItem('userName')
      const userIndex = usuariosCadastrados.findIndex(u => u.nome === currentUser)
      
      if (userIndex !== -1) {
        const user = usuariosCadastrados[userIndex]
        const senhaAtualHash = await hashSenha(editProfile.senhaAtual)
        const novaSenhaHash = await hashSenha(editProfile.novaSenha)
        
        if (user.senha === senhaAtualHash || user.senha === editProfile.senhaAtual) {
          usuariosCadastrados[userIndex] = {
            ...user,
            nome: editProfile.nome,
            senha: novaSenhaHash
          }
          localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados))
          sessionStorage.setItem('userName', editProfile.nome)
          setPerfil({...perfil, nome: editProfile.nome})
          showToastMessage('Nome e senha atualizados com sucesso!')
          setShowEditProfileModal(false)
          setEditProfile({ nome: '', senhaAtual: '', novaSenha: '' })
        } else {
          showToastMessage('Senha atual incorreta!')
        }
      } else {
        showToastMessage('Usuário não encontrado!')
      }
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    
    if (!deleteAccountData.senhaAtual) {
      showToastMessage('Digite sua senha para confirmar!')
      return
    }
    
    if (!window.confirm('ATENÇÃO: Esta ação é irreversível! Todos os seus dados serão perdidos permanentemente. Tem certeza que deseja excluir sua conta?')) {
      return
    }
    
    try {
      const userId = sessionStorage.getItem('userId')
      console.log("userId:", userId)
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          senhaAtual: deleteAccountData.senhaAtual
        })
      })
      
      if (response.ok) {
        showToastMessage('Conta excluída com sucesso!')
        setTimeout(() => {
          sessionStorage.clear()
          localStorage.removeItem('medicamentos')
          localStorage.removeItem('medicamentosTomados')
          localStorage.removeItem('lembretes')
          localStorage.removeItem('perfilUsuario')
          onLogout()
           window.location.href = '/cadastro'
        }, 2000)
      } else {
        showToastMessage(await getApiErrorMessage(response, 'Senha incorreta'))
      }
    } catch {
      // Fallback para localStorage
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      const currentUser = sessionStorage.getItem('userName')
      const userIndex = usuariosCadastrados.findIndex(u => u.nome === currentUser)
      
      if (userIndex !== -1) {
        const user = usuariosCadastrados[userIndex]
        const senhaAtualHash = await hashSenha(deleteAccountData.senhaAtual)
        
        if (user.senha === senhaAtualHash || user.senha === deleteAccountData.senhaAtual) {
          // Remover usuário do localStorage
          usuariosCadastrados.splice(userIndex, 1)
          localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosCadastrados))
          
          showToastMessage('Conta excluída com sucesso!')
          setTimeout(() => {
            sessionStorage.clear()
            localStorage.removeItem('medicamentos')
            localStorage.removeItem('medicamentosTomados')
            localStorage.removeItem('lembretes')
            localStorage.removeItem('perfilUsuario')
            onLogout()
          }, 2000)
        } else {
          showToastMessage('Senha incorreta!')
        }
      } else {
        showToastMessage('Usuário não encontrado!')
      }
    }
  }

  const renderConfiguracoes = () => (
    <>
      <h2 className="section-title">Configurações</h2>
      <div className="configuracoes">
        <div className="card">

          <h4>Notificações</h4>
          <label>
            <span>Lembrete de medicamentos</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label>
            <span>Notificações push</span>
            <input type="checkbox" defaultChecked />
          </label>
          <label>
            <span>Modo escuro</span>
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </label>
          <label>
            <span>Modo de Acessibilidade (Letras Grandes)</span>
            <input 
              type="checkbox" 
              checked={accessibilityMode}
              onChange={(e) => updateAccessibilityLevel(e.target.checked ? 'medium' : 'normal')}
            />
          </label>
          <label>
            <span>Níveis de acessibilidade visual</span>
            <select
              value={accessibilityLevel}
              onChange={(e) => updateAccessibilityLevel(e.target.value)}
              className="select-modern accessibility-level-select"
            >
              <option value="normal">Normal (100%)</option>
              <option value="medium">Médio (125%)</option>
              <option value="large">Grande (150%)</option>
              <option value="xlarge">Extra Grande (175%)</option>
            </select>
          </label>

        </div>
        <div className="card accessibility-settings-card">
          <h4>Acessibilidade</h4>
          <fieldset className="color-vision-options">
            <legend>Modo para daltonismo</legend>
            {Object.entries(colorVisionModes).map(([mode, label]) => (
              <label key={mode} className="color-vision-option">
                <input
                  type="radio"
                  name="colorVisionMode"
                  value={mode}
                  checked={colorVisionMode === mode}
                  onChange={() => updateColorVisionMode(mode)}
                />
                <span className={`color-vision-swatch color-vision-swatch--${mode}`} aria-hidden="true"></span>
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            className="color-vision-reset"
            onClick={() => updateColorVisionMode('')}
            disabled={!colorVisionMode}
          >
            Voltar para configuração padrão
          </button>
        </div>
        <div className="card">
          <h4>Perfil</h4>
          <div className="perfil-info">
            <div className="item">
              <span>Nome:</span>
              <span>{perfil.nome || 'Carregando...'}</span>
            </div>
            <div className="item">
              <span>Email:</span>
              <span>{perfil.email || 'Não informado'}</span>
            </div>
            <div className="item">
  <span>Data de nascimento:</span>
  <span>
    {perfil.dataNascimento
      ? perfil.dataNascimento.split('-').reverse().join('/')
      : 'Não informado'}
  </span>
</div>
            <div className="item">
              <span>Comorbidade:</span>
              <span>{perfil.comorbidade || 'Nenhuma'}</span>
            </div>
            <div className="item">
              <span>Senha:</span>
              <span>******</span>
            </div>
          </div>
          <div className="settings-actions">
            <button 
              onClick={() => {
                setEditProfile({
                  nome: perfil.nome,
                  senhaAtual: '',
                  novaSenha: ''
                })
                setShowEditProfileModal(true)
              }}
              className="settings-action settings-action--primary"
            >
              <Widget type="edit" className="btn-icon" />
              Editar Senha e Nome
            </button>
            <button 
              onClick={() => {
                setDeleteAccountData({ senhaAtual: '' })
                setShowDeleteAccountModal(true)
              }}
              className="settings-action settings-action--danger"
            >
              <Widget type="delete" className="btn-icon" />
              Excluir Conta
            </button>
          </div>

        </div>
      </div>
      
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3><Widget type="edit" className="title-widget" />Editar Perfil</h3>
            <form onSubmit={handleSavePerfil} className="profile-form">
              <input
                type="text"
                placeholder="Nome completo"
                value={perfil.nome}
                onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={perfil.email}
                onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Nova senha (deixe vazio para manter atual)"
                value={perfil.senha === '******' ? '' : perfil.senha}
                onChange={(e) => setPerfil({...perfil, senha: e.target.value})}
              />
              <label htmlFor="dataNascimento">Data de nascimento</label>

<input
  id="dataNascimento"
  name="dataNascimento"
  type="date"
  value={perfil.dataNascimento}
  onChange={(e) =>
    setPerfil({
      ...perfil,
      dataNascimento: e.target.value
    })
  }
/>
              <input
                type="text"
                placeholder="Comorbidade (opcional)"
                value={perfil.comorbidade}
                onChange={(e) => setPerfil({...perfil, comorbidade: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowProfileModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEditModal && editingMed && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Medicamento</h3>
            <form onSubmit={handleSaveEdit} className="profile-form">
              <input
                type="text"
                placeholder="Nome do medicamento"
                value={editMedicamento.nome}
                onChange={(e) => setEditMedicamento({...editMedicamento, nome: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Dosagem"
                value={editMedicamento.dosagem}
                onChange={(e) => setEditMedicamento({...editMedicamento, dosagem: e.target.value})}
                required
              />
              <input
                type="time"
                value={editMedicamento.horario}
                onChange={(e) => setEditMedicamento({...editMedicamento, horario: e.target.value})}
                required
              />
              <select
                value={editMedicamento.frequencia}
                onChange={(e) => setEditMedicamento({...editMedicamento, frequencia: e.target.value})}
              >
                <option value="Diário">Diário</option>
                <option value="12h">A cada 12h</option>
                <option value="8h">A cada 8h</option>
                <option value="Semanal">Semanal</option>
              </select>
              <input
                type="text"
                placeholder="Observação"
                value={editMedicamento.observacao || ''}
                onChange={(e) => setEditMedicamento({...editMedicamento, observacao: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="button" className="btn-delete" onClick={handleDeleteMedicamentoModal}>Excluir</button>
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEditProfileModal && (
        <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3><Widget type="edit" className="title-widget" />Editar Senha e Nome</h3>
            <form onSubmit={handleSaveProfileEdit} className="profile-form">
              <input
                type="text"
                placeholder="Novo nome"
                value={editProfile.nome}
                onChange={(e) => setEditProfile({...editProfile, nome: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Senha atual"
                value={editProfile.senhaAtual}
                onChange={(e) => setEditProfile({...editProfile, senhaAtual: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={editProfile.novaSenha}
                onChange={(e) => setEditProfile({...editProfile, novaSenha: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowEditProfileModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Atualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )

  useEffect(() => {
    const titles = {
      'dashboard': 'PharmaLife - Home',
      'agenda': 'PharmaLife - Agenda',
      'historico': 'PharmaLife - Histórico',
      'adicionar': 'PharmaLife - Adicionar Medicamento',
      'adicionar-medicamento': 'PharmaLife - Adicionar Medicamento',
      'adicionar-lembrete': 'PharmaLife - Novo Lembrete',
      'configuracoes': 'PharmaLife - Configurações',
      'ajuda': 'PharmaLife - Ajuda'
    }
    document.title = titles[activeSection] || 'PharmaLife'
  }, [activeSection])

  const [adminData, setAdminData] = useState({ usuarios: [], estatisticas: {} })

  const carregarDadosAdmin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios`)
      if (response.ok) {
        const usuarios = await response.json()
        const agora = new Date()
        const novos = usuarios.filter(u => {
          const cadastro = new Date(u.dataCadastro || u.createdAt)
          const diasDiff = (agora - cadastro) / (1000 * 60 * 60 * 24)
          return diasDiff <= 7
        }).length
        
        setAdminData({
          usuarios,
          estatisticas: {
            total: usuarios.length,
            novos,
            comSenha: usuarios.filter(u => u.senha && u.senha !== '').length
          }
        })
      } else {
        throw new Error('Backend não disponível')
      }
    } catch {
      // Fallback para localStorage
      const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]')
      setAdminData({
        usuarios: usuariosCadastrados,
        estatisticas: {
          total: usuariosCadastrados.length,
          novos: 0,
          comSenha: usuariosCadastrados.filter(u => u.senha).length
        }
      })
    }
  }

  useEffect(() => {
    if (activeSection === 'admin') {
      carregarDadosAdmin()
    }
  }, [activeSection])

  const renderAdmin = () => (
    <>
      <h2 className="section-title">Painel Administrativo</h2>
        <div className="admin-panel">
          <div className="card">
            <h3><Widget type="users" className="title-widget" />Usuários Cadastrados ({adminData.usuarios.length})</h3>
            <div className="usuarios-list">
              <div className="usuario-item header">
                <span>Nome</span>
                <span>Email</span>
                <span>Data Cadastro</span>
                <span>Senha</span>
              </div>
              {adminData.usuarios.length === 0 ? (
                <div className="usuario-item">
                  <span colSpan="4" style={{textAlign: 'center', color: '#666'}}>Nenhum usuário cadastrado ainda</span>
                </div>
              ) : (
                adminData.usuarios.map((usuario, index) => (
                  <div key={index} className="usuario-item">
                    <span>{usuario.nome}</span>
                    <span>{usuario.email}</span>
                    <span>{new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}</span>
                    <span>******</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="card">
            <h3><Widget type="chart" className="title-widget" />Estatísticas</h3>
            <div className="item">
              <span>Total de usuários:</span>
              <span>{adminData.estatisticas.total || 0}</span>
            </div>
            <div className="item">
              <span>Novos cadastros (7 dias):</span>
              <span>{adminData.estatisticas.novos || 0}</span>
            </div>
            <div className="item">
              <span>Usuários com senha definida:</span>
              <span>{adminData.estatisticas.comSenha || 0}</span>
            </div>
          </div>
        </div>
      </>
    )

  const renderContent = () => {
    switch(activeSection) {
      case 'agenda': return renderAgenda()
      case 'historico': return renderHistorico()
      case 'configuracoes': return renderConfiguracoes()
      case 'adicionar': return renderAdicionar('medicamento')
      case 'adicionar-medicamento': return renderAdicionar('medicamento')
      case 'adicionar-lembrete': return renderAdicionar('lembrete')
      case 'ajuda': return renderAjuda()
      case 'sobre': return <Sobre />
      case 'admin': return renderAdmin()
      default: return renderDashboard()
    }
  }

  return (
    <div
      className={`home-container ${darkMode ? 'dark-mode' : ''} ${accessibilityMode ? 'accessibility-mode' : ''}`}
      data-accessibility-level={accessibilityLevel}
      data-colorblind={colorVisionMode || undefined}
    >
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <img className="logo-icon" src={pharmalifeLogo} alt="Logo PharmaLife" />
            <h1>PharmaLife</h1>
          </div>
        </div>
        <nav className="nav-buttons">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')}
          >
            <Widget type="chart" className="nav-icon" />
            Página Inicial
          </button>
          <button 
            className={activeSection === 'agenda' ? 'active' : ''} 
            onClick={() => setActiveSection('agenda')}
          >
            <Widget type="list" className="nav-icon" />
            Agenda
          </button>
          <button
            className={['adicionar', 'adicionar-medicamento'].includes(activeSection) ? 'active' : ''}
            onClick={() => setActiveSection('adicionar-medicamento')}
          >
            <Widget type="add" className="nav-icon" />
            Novo Medicamento
          </button>
          <button
            className={activeSection === 'adicionar-lembrete' ? 'active' : ''}
            onClick={() => setActiveSection('adicionar-lembrete')}
          >
            <Widget type="bell" className="nav-icon" />
            Novo Lembrete
          </button>
          <button 
            className={activeSection === 'historico' ? 'active' : ''} 
            onClick={() => setActiveSection('historico')}
          >
            <Widget type="time" className="nav-icon" />
            Histórico
          </button>

          <button 
            className={activeSection === 'configuracoes' ? 'active' : ''} 
            onClick={() => setActiveSection('configuracoes')}
          >
            <Widget type="settings" className="nav-icon" />
            Configurações
          </button>
          <button 
            className={activeSection === 'sobre' ? 'active' : ''} 
            onClick={() => setActiveSection('sobre')}
          >
            <Widget type="users" className="nav-icon" />
            Sobre Nós
          </button>
          <button 
            className={activeSection === 'ajuda' ? 'active' : ''} 
            onClick={() => setActiveSection('ajuda')}
          >
            <Widget type="bell" className="nav-icon" />
            Ajuda
          </button>
          {isAdmin && (
            <button 
              className={activeSection === 'admin' ? 'active' : ''} 
              onClick={() => setActiveSection('admin')}
            >
              <Widget type="users" className="nav-icon" />
              Admin
            </button>
          )}
        </nav>
<div className="sidebar-user">
  <div className="user-avatar">
    {(userData?.foto || perfil.foto || sessionStorage.getItem('userPhoto')) ? (
      <img
        src={userData?.foto || perfil.foto || sessionStorage.getItem('userPhoto')}
        alt="Avatar"
        referrerPolicy="no-referrer"
      />
    ) : (
      (perfil.nome || sessionStorage.getItem('userName') || 'U')
        .charAt(0)
        .toUpperCase()
    )}
  </div>

  <div className="user-summary">
    <span>{perfil.nome || sessionStorage.getItem('userName') || 'Usuário'}</span>

    <button onClick={onLogout}>
      Sair
    </button>
  </div>
</div>
</aside>


      
      
      <main className="main-content">
        {renderContent()}
        {showToast && (
          <div className="toast">
            {toastMessage}
          </div>
        )}
        
        {showEditModal && editingMed && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Editar Medicamento</h3>
              <form onSubmit={handleSaveEdit} className="profile-form">
                <input
                  type="text"
                  placeholder="Nome do medicamento"
                  value={editMedicamento.nome}
                  onChange={(e) => setEditMedicamento({...editMedicamento, nome: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Dosagem"
                  value={editMedicamento.dosagem}
                  onChange={(e) => setEditMedicamento({...editMedicamento, dosagem: e.target.value})}
                  required
                />
                <input
                  type="time"
                  value={editMedicamento.horario}
                  onChange={(e) => setEditMedicamento({...editMedicamento, horario: e.target.value})}
                  required
                />
                <select
                  value={editMedicamento.frequencia}
                  onChange={(e) => setEditMedicamento({...editMedicamento, frequencia: e.target.value})}
                >
                  <option value="Diário">Diário</option>
                  <option value="12h">A cada 12h</option>
                  <option value="8h">A cada 8h</option>
                  <option value="Semanal">Semanal</option>
                </select>
                <input
                  type="text"
                  placeholder="Observação"
                  value={editMedicamento.observacao || ''}
                  onChange={(e) => setEditMedicamento({...editMedicamento, observacao: e.target.value})}
                />
                <div className="modal-buttons">
                  <button type="button" className="btn-delete" onClick={handleDeleteMedicamentoModal}>Excluir</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {showEditProfileModal && (
          <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3><Widget type="edit" className="title-widget" />Editar Senha e Nome</h3>
              <form onSubmit={handleSaveProfileEdit} className="profile-form">
                <input
                  type="text"
                  placeholder="Novo nome"
                  value={editProfile.nome}
                  onChange={(e) => setEditProfile({...editProfile, nome: e.target.value})}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={editProfile.senhaAtual}
                  onChange={(e) => setEditProfile({...editProfile, senhaAtual: e.target.value})}
                  required
                />
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={editProfile.novaSenha}
                  onChange={(e) => setEditProfile({...editProfile, novaSenha: e.target.value})}
                  required
                />
                <div className="modal-buttons">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditProfileModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Atualizar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showIgnoreModal && (
          <div className="modal-overlay" onClick={fecharModalIgnorar}>
            <div className="modal ignore-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ignore-title">
              <h3 id="ignore-title"><Widget type="delete" className="title-widget" />Por que você deseja ignorar este medicamento?</h3>
              <p className="ignore-modal__subtitle">
                Medicamentos ignorados não contam como esquecidos e não reduzem sua taxa de adesão.
              </p>

              <div className="ignore-reasons" role="radiogroup" aria-label="Motivo para ignorar medicamento">
                {ignoreReasonOptions.map((reason) => (
                  <label key={reason} className={`ignore-reason ${ignoreReason === reason ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="ignoreReason"
                      value={reason}
                      checked={ignoreReason === reason}
                      onChange={(e) => setIgnoreReason(e.target.value)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {ignoreReason === 'Outro motivo' && (
                <label className="profile-form ignore-other-field">
                  <span>Descreva o motivo (opcional)</span>
                  <input
                    type="text"
                    placeholder="Ex: tive uma reação ou orientação específica"
                    value={ignoreOtherReason}
                    onChange={(e) => setIgnoreOtherReason(e.target.value)}
                  />
                </label>
              )}

              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={fecharModalIgnorar} disabled={savingIgnore}>Cancelar</button>
                <button type="button" className="btn-save" onClick={confirmarIgnorarMedicamento} disabled={savingIgnore}>
                  {savingIgnore ? 'Salvando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showDeleteAccountModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteAccountModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="danger-title"><Widget type="delete" className="title-widget" />Excluir Conta</h3>
              <div className="danger-panel">
                <p style={{color: '#dc2626', fontWeight: '600', margin: '0 0 10px 0'}}><Widget type="warning" className="title-widget" />ATENÇÃO:</p>
                <p style={{color: '#7f1d1d', margin: '0', fontSize: '14px'}}>Esta ação é irreversível! Todos os seus medicamentos, histórico e dados pessoais serão perdidos permanentemente.</p>
              </div>
              <form onSubmit={handleDeleteAccount} className="profile-form">
                <input
                  type="password"
                  placeholder="Digite sua senha atual para confirmar"
                  value={deleteAccountData.senhaAtual}
                  onChange={(e) => setDeleteAccountData({...deleteAccountData, senhaAtual: e.target.value})}
                  required
                  style={{borderColor: '#ef4444'}}
                />
                <div className="modal-buttons">
                  <button type="button" className="btn-cancel" onClick={() => setShowDeleteAccountModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-delete" style={{backgroundColor: '#ef4444'}}>Excluir Conta</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
