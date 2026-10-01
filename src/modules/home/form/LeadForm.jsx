import { useRef, useState } from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { leadFormQuestions } from "../../../config/lead-form.config";
import { whatsappUrl } from "../../../config/template.config";
import { buildWhatsappMessage, isQuestionnaireComplete, isQuestionnaireConfigured, recordWhatsappRedirect } from "./lead-form";

export function LeadForm({ questions = leadFormQuestions }) {
  const [answers, setAnswers] = useState({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const tracked = useRef(false);
  const configured = isQuestionnaireConfigured(questions);
  const complete = isQuestionnaireComplete(questions, answers);
  const answered = questions.filter(question => question.options.includes(answers[question.id])).length;

  function submit(event) {
    event.preventDefault();
    if (!complete || !acknowledged) {
      setError("Responda às quatro perguntas e confirme o envio das respostas ao escritório.");
      return;
    }
    const destination = whatsappUrl(buildWhatsappMessage(questions, answers));
    if (!tracked.current) {
      window.dataLayer = window.dataLayer || [];
      recordWhatsappRedirect(window.dataLayer);
      tracked.current = true;
    }
    // A mensagem fica preenchida no WhatsApp. O visitante ainda precisa enviá-la.
    window.location.assign(destination);
  }

  return <section className="qualification-section" id="contato" aria-labelledby="lead-form-heading">
    <div className="container qualification-layout">
      <header className="qualification-intro">
        <span className="eyebrow">Orientação inicial</span>
        <h2 id="lead-form-heading">Conte um pouco sobre sua situação.</h2>
        <p>Responda às perguntas abaixo para contextualizar seu contato com o escritório.</p>
        <p>Depois, você será direcionado ao WhatsApp com as respostas preenchidas. Para concluir o contato, envie a mensagem por lá.</p>
        <div className="qualification-note"><ShieldCheck /><span>As informações ajudam no atendimento inicial. Cada caso depende de análise individual e da documentação disponível.</span></div>
      </header>
      <form className="qualification-form" onSubmit={submit}>
        {!configured && <p className="form-configuration-notice" role="status">Prévia em preparação: as alternativas do formulário da Meta ainda precisam ser confirmadas. O envio está indisponível.</p>}
        <p className="form-progress" aria-live="polite">{answered} de {questions.length} perguntas respondidas · Todas são obrigatórias</p>
        {questions.map((question, index) => <div key={question.id} className="qualification-question">
          <label className="qualification-label" htmlFor={question.id}><span>{String(index + 1).padStart(2, "0")}</span>{question.label}</label>
          <select className="qualification-select" id={question.id} name={question.id} required value={answers[question.id] || ""} onChange={event => { setAnswers(previous => ({ ...previous, [question.id]: event.target.value })); setError(""); }}>
            <option value="" disabled>Selecione uma resposta</option>
            {question.options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>)}
        <label className="form-acknowledgement"><input type="checkbox" required checked={acknowledged} onChange={event => { setAcknowledged(event.target.checked); setError(""); }} /><span>Concordo em compartilhar estas respostas com o escritório pelo WhatsApp para o atendimento solicitado.</span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button form-submit" type="submit" disabled={!complete || !acknowledged}><MessageCircle /> Continuar no WhatsApp <ArrowRight /></button>
        <p className="form-help">O botão será liberado após o preenchimento das quatro perguntas e a confirmação acima.</p>
      </form>
    </div>
  </section>;
}
