import './Landing.css'
import './LandingActions.css'
import medicamentoHero from './assets/medicamento-hero.jpeg'
import pharmalifeLogo from './assets/pharmalife-logo.png'

const integrantes = [['Maycon', 'Programador'], ['Adriel', 'Programador'], ['Felipe', 'Design'], ['Caio', 'Documentação'], ['Murilo', 'Gerente']]

function Landing({ onStart, onLogin }) {
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return <main className="landing-page"><div className="landing-shell">
    <header className="landing-header">
      <a className="landing-brand" href="#inicio"><img src={pharmalifeLogo} alt="" /><span>PharmaLife</span></a>
      <nav className="landing-nav" aria-label="Navegação principal"><button onClick={() => goTo('sobre')}>Sobre nós</button><button onClick={() => goTo('como-funciona')}>Como funciona</button><button onClick={() => goTo('contato')}>Contato</button></nav>
      <div className="landing-header-actions">
        <button className="landing-login" onClick={onLogin}>Entrar</button>
        <button className="landing-start landing-header-start" onClick={onStart}>Começar agora</button>
      </div>
    </header>
    <section className="landing-hero" id="inicio"><div className="landing-copy"><h1>Sua rotina de medicamentos, <em>organizada.</em></h1><p>PharmaLife te ajuda a lembrar, acompanhar e nunca mais esquecer seus medicamentos e lembretes importantes.</p><div className="landing-actions"><button className="landing-start" onClick={onStart}>Começar agora <b>→</b></button><button className="landing-link" onClick={() => goTo('sobre')}>Saiba mais</button></div></div><div className="landing-visual" aria-hidden="true"><div className="visual-blob" /><div className="visual-note visual-done"><b>✓</b><span>Todos os<br />medicamentos<br />em dia!</span></div><div className="visual-note visual-next"><b>▣</b><span>Próximo lembrete<br /><strong>10:00</strong></span></div><img src={medicamentoHero} alt="" /></div></section>
    <section className="landing-highlights"><article><i>♧</i><div><h2>Lembretes inteligentes</h2><p>Receba alertas na hora certa.</p></div></article><article><i>♢</i><div><h2>Seus dados seguros</h2><p>Privacidade e segurança em primeiro lugar.</p></div></article><article><i>▥</i><div><h2>Acompanhe seu histórico</h2><p>Veja seu progresso e nunca perca o controle.</p></div></article><article><i>◌</i><div><h2>Acessibilidade</h2><p>Recursos pensados para todos.</p></div></article></section>
    <section className="landing-section landing-how" id="como-funciona"><span>SIMPLES E PRÁTICO</span><h2>Como o PharmaLife funciona</h2><div className="landing-steps"><article><b>1</b><h3>Cadastre seus medicamentos</h3><p>Registre o que você usa e os horários recomendados.</p></article><article><b>2</b><h3>Programe lembretes</h3><p>Defina alertas para manter sua rotina em dia.</p></article><article><b>3</b><h3>Acompanhe seu cuidado</h3><p>Consulte o histórico e tenha mais segurança no tratamento.</p></article></div></section>
    <section className="landing-section landing-about" id="sobre"><div><span>SOBRE NÓS</span><h2>Tecnologia a favor do seu bem-estar.</h2><p>O <strong>PharmaLife</strong> é um projeto de Trabalho de Conclusão de Curso criado para tornar o gerenciamento de medicamentos mais simples, seguro e acessível.</p><p>Nossa plataforma reúne agenda de horários, histórico de medicamentos, localização de farmácias e lembretes personalizados em uma interface clara e moderna.</p></div><div className="landing-team"><h3>Nossa equipe</h3>{integrantes.map(([nome, papel]) => <article key={nome}><b>{nome[0]}</b><div><strong>{nome}</strong><small>{papel}</small></div></article>)}</div></section>
    <footer className="landing-footer" id="contato"><div><a className="landing-brand" href="#inicio"><img src={pharmalifeLogo} alt="" /><span>PharmaLife</span></a><p>Mais organização e tranquilidade para a sua saúde.</p></div><div><h2>Contato</h2><a href="mailto:tccamp123@gmail.com">tccamp123@gmail.com</a></div><button className="landing-start" onClick={onStart}>Criar minha conta</button></footer>
  </div></main>
}
export default Landing
