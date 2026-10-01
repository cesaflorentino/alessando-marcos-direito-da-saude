import { LeadForm } from "../form/LeadForm";
import { ArrowRight, Building2, Check, Clock3, FileCheck2, Globe2, GraduationCap, MapPin, MessageCircle, Scale, ShieldCheck } from "lucide-react";
import { templateConfig as site } from "../../../config/template.config";
import lawyerPhoto from "../../../assets/Images/Sobre.png";
import heroImage from "../../../assets/hero.jpg";
import teamAlessandro from "../../../assets/equipe/Alessandro-PARALEGAL-2.png";
import teamMaria from "../../../assets/equipe/Alessandro-PARALEGAL-7.png";
import teamAline from "../../../assets/equipe/WhatsApp-Image-2025-03-31-at-20.29.58-1.jpeg";
import teamRafael from "../../../assets/equipe/WhatsApp-Image-2025-03-31-at-20.29.58-2.jpeg";
import teamGabrielaDezan from "../../../assets/equipe/WhatsApp-Image-2025-03-31-at-20.29.58-3.jpeg";
import teamMarilia from "../../../assets/equipe/WhatsApp-Image-2025-03-31-at-20.29.58.jpeg";
import teamGabrielaCampelo from "../../../assets/equipe/WhatsApp-Image-2025-04-07-at-11.23.37-1.jpeg";

const situations = ["O plano de saúde negou um medicamento de alto custo.", "O SUS não fornece o medicamento prescrito pelo médico.", "Recebeu a negativa para uma cirurgia.", "O plano recusou um exame importante para o tratamento.", "Teve um tratamento ou uma terapia negados.", "O plano negou Home Care.", "A cobertura foi recusada alegando que o procedimento não faz parte do rol da ANS.", "Seu pedido foi negado por questões contratuais ou administrativas."];
const areas = ["Medicamentos de alto custo", "Cirurgias", "Tratamentos médicos", "Terapias especializadas", "Home Care", "Exames", "Internações", "Próteses e órteses", "Medicamentos importados", "Tratamentos oncológicos", "Tratamentos para doenças raras", "Outras negativas do plano ou do SUS"];
const benefits = ["Atendimento humanizado", "Análise individual de cada caso", "Comunicação clara durante todo o atendimento", "Atuação voltada ao Direito da Saúde", "Acompanhamento jurídico em todas as etapas"];
const credentials = [
  { icon: GraduationCap, title: "Formação especializada", text: "Mestre em Direito da Saúde, com atuação direcionada às questões jurídicas do setor." },
  { icon: Building2, title: "Atuação institucional", text: "Presidente da ASSOLADEME/RJ e conselheiro da ANADEM." },
  { icon: Scale, title: "Direito Médico e Hospitalar", text: "Experiência jurídica integrada às particularidades de pacientes, profissionais e instituições de saúde." },
  { icon: Globe2, title: "Atendimento nacional", text: "Estrutura preparada para orientação e atuação jurídica em diferentes regiões do Brasil." },
];
const team = [
  { name: "Alessandro Marcos Gonçalves", role: "Fundador e advogado", image: teamAlessandro },
  { name: "Maria de Fátima de Oliveira", role: "Sócia e gestora", image: teamMaria },
  { name: "Aline de Bragança", role: "Advogada", image: teamAline },
  { name: "Rafael Oliveira", role: "Advogado", image: teamRafael },
  { name: "Gabriela Dezan", role: "Paralegal", image: teamGabrielaDezan },
  { name: "Marília Adad", role: "Advogada", image: teamMarilia },
  { name: "Gabriela Campelo", role: "Controladoria jurídica", image: teamGabrielaCampelo },
];
const faqs = [
  ["Meu plano de saúde negou o tratamento. Ainda posso buscar orientação?", "Sim. Cada negativa possui características próprias e pode ser analisada juridicamente."],
  ["O SUS não fornece o medicamento prescrito pelo meu médico. O que posso fazer?", "É possível realizar uma análise jurídica para verificar quais medidas podem ser cabíveis conforme a documentação e a legislação aplicável."],
  ["Preciso ter a negativa por escrito?", "Sempre que possível, esse documento auxilia na análise. Caso não possua, nossa equipe poderá orientar sobre a documentação necessária."],
  ["Quais documentos são importantes?", "Normalmente são analisados documentos pessoais, prescrição médica, laudos, exames, relatório do médico assistente e a negativa do plano de saúde ou do SUS, quando existente."],
];

function CTA({ children = "Quero analisar meu caso" }) { return <a className="primary-button" href="#contato"><MessageCircle />{children}<ArrowRight /></a>; }

export function HomePage() {
  const query = encodeURIComponent(site.office.mapsQuery);
  return <>
    <section className="health-hero" id="inicio"><img className="hero-background" src={heroImage} alt="Ambiente hospitalar com paciente aguardando atendimento" /><div className="hero-overlay" /><div className="hero-grid-pattern" /><div className="container hero-layout"><div className="hero-content"><span className="eyebrow">Advocacia em Direito da Saúde</span><h1>Seu tratamento foi <em>negado</em> pelo plano de saúde ou pelo SUS?</h1><p>Medicamentos, cirurgias, exames e tratamentos de alto custo exigem atenção. Receba uma análise jurídica individual para compreender as possibilidades do seu caso.</p><div className="hero-actions"><CTA /><a className="text-link" href="#situacoes">Conheça sua situação <ArrowRight /></a></div><div className="hero-trust"><ShieldCheck /><span><b>Atuação jurídica desde 2016</b><small>Atendimento ético, humanizado e comunicação clara</small></span></div></div></div><div className="hero-scroll"><span>Role para conhecer</span><i /></div></section>

    <section className="light-section cases-section" id="situacoes"><div className="container"><header className="section-heading"><span className="eyebrow">Entenda a sua situação</span><h2>Você passou por alguma dessas situações?</h2><p>Negativas podem ocorrer por diferentes motivos. Identifique abaixo os casos mais recorrentes.</p></header><div className="situation-grid">{situations.map(item => <div key={item}><span><Check /></span><p>{item}</p></div>)}</div><div className="section-conclusion"><p>Se você se identificou com uma dessas situações, uma análise jurídica pode esclarecer as possibilidades para o seu caso.</p><CTA /></div></div></section>

    <section className="dark-section expertise-section" id="atuacao"><div className="container"><header className="section-heading"><span className="eyebrow">Áreas de atuação</span><h2>Em quais casos podemos ajudar?</h2><p>Nossa atuação é voltada a demandas relacionadas ao Direito da Saúde.</p></header><div className="area-grid">{areas.map(area => <article key={area}><Check /><p>{area}</p></article>)}</div><p className="individual-note"><ShieldCheck /> Cada caso é analisado individualmente.</p></div></section>

    <section className="urgency-section"><div className="container urgency-card"><div className="urgency-icon"><Clock3 /></div><div><span className="eyebrow">Atenção ao tempo</span><h2>Em muitos casos, o tempo faz diferença.</h2><p>Quando um medicamento, cirurgia ou tratamento é negado, o atraso pode comprometer a continuidade do atendimento indicado pelo médico.</p><p>Buscar orientação jurídica o quanto antes permite avaliar a documentação e entender quais caminhos podem ser adotados conforme a sua situação.</p><CTA /></div></div></section>

    <section className="light-section process-section" id="processo"><div className="container"><header className="section-heading"><span className="eyebrow">Etapas do atendimento</span><h2>Como funciona?</h2><p>Um processo simples, transparente e direcionado às particularidades do seu caso.</p></header><div className="steps"><article><span>01</span><MessageCircle /><h3>Entre em contato</h3><p>Preencha o formulário e continue o atendimento pelo WhatsApp.</p></article><article><span>02</span><FileCheck2 /><h3>Envie sua documentação</h3><p>Analisaremos prescrição, laudos, exames e a negativa, quando houver.</p></article><article><span>03</span><ShieldCheck /><h3>Receba uma análise jurídica</h3><p>Avaliamos o caso e orientamos sobre as possibilidades previstas na legislação.</p></article></div></div></section>

    <section className="dark-section why-section"><div className="container why-layout"><header className="section-heading"><span className="eyebrow">Atuação responsável</span><h2>Por que escolher nosso escritório?</h2><p>Orientação próxima, linguagem acessível e atenção à realidade de cada cliente.</p></header><div className="why-grid">{benefits.map((item, index) => <div key={item}><span>0{index + 1}</span><Check /><p>{item}</p></div>)}</div></div></section>

    <section className="light-section about-section" id="profissional"><div className="container about-grid"><div className="lawyer-photo"><div className="photo-accent" /><img src={lawyerPhoto} alt={`${site.brand.lawyer}, advogado com atuação em Direito da Saúde`} /></div><div className="about-copy"><span className="eyebrow">Quem somos</span><h2>{site.brand.lawyer}</h2><strong>{site.brand.oab}</strong><p>Fundado em 2016, o escritório A.M. Gonçalves Advogados desenvolve atuação jurídica dedicada ao setor da saúde. Sob a liderança do Dr. Alessandro Marcos Gonçalves, atende pacientes, familiares, profissionais e instituições em questões de Direito da Saúde, Direito Médico e Direito Hospitalar.</p><p>O Dr. Alessandro é mestre em Direito da Saúde, presidente da ASSOLADEME/RJ, conselheiro da ANADEM e membro da Sociedade Brasileira de Direito Médico e Bioética.</p><p>Nosso compromisso é oferecer uma atuação ética, transparente e personalizada, buscando compreender as particularidades de cada caso para orientar nossos clientes da melhor forma possível.</p><CTA>Falar com o advogado</CTA></div></div></section>

    <section className="credentials-section"><div className="container"><header className="section-heading"><span className="eyebrow">Experiência que inspira confiança</span><h2>Conhecimento jurídico conectado à realidade da saúde.</h2><p>Uma atuação construída com formação técnica, experiência institucional e compreensão das particularidades do setor.</p></header><div className="credentials-grid">{credentials.map(item => <article key={item.title}><item.icon /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><p className="credentials-disclaimer">As credenciais profissionais apresentadas têm caráter informativo e não representam garantia de resultado.</p></div></section>

    <section className="team-section" id="equipe"><div className="container"><header className="section-heading"><span className="eyebrow">Nossa equipe</span><h2>Profissionais comprometidos com uma atuação próxima e responsável.</h2><p>Uma equipe multidisciplinar preparada para oferecer suporte jurídico com técnica, organização e atendimento humanizado.</p></header><div className="team-grid">{team.map(member => <article className="team-card" key={member.name}><img src={member.image} alt={`${member.name}, ${member.role}`} loading="lazy" /><div className="team-caption"><strong>{member.name}</strong><span>{member.role}</span></div></article>)}</div></div></section>

    <section className="faq-section" id="faq"><div className="container faq-layout"><header className="section-heading"><span className="eyebrow">Dúvidas frequentes</span><h2>Informação para o seu próximo passo.</h2><p>Respostas objetivas para dúvidas comuns sobre negativas de tratamento.</p></header><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></div></section>

    <LeadForm />

    <section className="location-section" id="localizacao"><div className="container location-grid"><div><span className="eyebrow">Localização</span><h2>Atendimento presencial e on-line.</h2><p>Entre em contato para receber orientações sobre o atendimento e agendar um horário.</p><div className="location-details"><span><MapPin /><span><small>ENDEREÇO</small>{site.office.address}<br />{site.office.district}</span></span><span><Clock3 /><span><small>ATENDIMENTO</small>{site.office.hours}</span></span></div><a className="outline-button" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Abrir no Google Maps <ArrowRight /></a></div><div className="map-frame"><iframe title={`Localização de ${site.brand.name}`} src={`https://www.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div></section>

    <div className="floating-group"><a className="floating-whatsapp" href="#contato" aria-label="Preencher formulário para continuar no WhatsApp"><MessageCircle /><span>{site.contact.phoneLabel}</span></a></div>
  </>;
}

