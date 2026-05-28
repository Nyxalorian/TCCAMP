import './Sobre.css'

function Sobre() {
  const integrantes = [
    { nome: 'Maycon', papel: 'Programador' },
    { nome: 'Adriel', papel: 'Documentação' },
    { nome: 'Felipe', papel: 'Design' },
    { nome: 'Caio', papel: 'Documentação' },
    { nome: 'Murilo', papel: 'Gerente' }
  ]

  return (
    <div className="sobre-container">
      <div className="sobre-content">
        <div className="sobre-header">
          <h1>Sobre Nós</h1>
          <div className="logo-sobre">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path d="M10 21 3 14a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" stroke="#1A3A6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m8.5 8.5 7 7" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className="projeto-info">
          <h2>Sobre o Projeto</h2>
          <p>
            O <strong>PharmaLife</strong> é um projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) 
            com o objetivo de criar uma solução digital inovadora para o gerenciamento de medicamentos.
          </p>
          <p>
            Nossa plataforma foi desenvolvida para auxiliar usuários no controle de seus medicamentos, 
            oferecendo funcionalidades como agenda de horários, histórico de medicamentos, localização 
            de farmácias próximas e lembretes personalizados.
          </p>
          <p>
            O projeto visa melhorar a adesão ao tratamento medicamentoso e proporcionar maior qualidade 
            de vida aos usuários através de uma interface intuitiva e moderna.
          </p>
        </div>

        <div className="equipe-info">
          <h2>Nossa Equipe</h2>
          <div className="integrantes-grid">
            {integrantes.map((integrante, index) => (
              <div key={index} className="integrante-card">
                <div className="integrante-avatar">
                  {integrante.nome.charAt(0)}
                </div>
                <h3>{integrante.nome}</h3>
                <p>{integrante.papel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="tecnologias">
          <h2>Tecnologias Utilizadas</h2>
          <div className="tech-list">
            <span className="tech-item">React</span>
            <span className="tech-item">JavaScript</span>
            <span className="tech-item">CSS</span>
            <span className="tech-item">HTML</span>
            <span className="tech-item">Vite</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sobre
