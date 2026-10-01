import { useRef, useState } from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { leadFormQuestions } from "../../../config/lead-form.config";
import { whatsappUrl } from "../../../config/template.config";
import { buildWhatsappMessage, isQuestionnaireComplete, isQuestionnaireConfigured, recordWhatsappRedirect } from "./lead-form";
import { collectAttribution, createLeadPayload, isContactComplete, saveLead } from "./lead-submission";

export function LeadForm({ questions = leadFormQuestions }) {
  const [answers, setAnswers] = useState({});
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const attempt = useRef(null);
  const submitting = useRef(false);
  const tracked = useRef(false);
  const configured = isQuestionnaireConfigured(questions);
  const complete = isQuestionnaireComplete(questions, answers) && isContactComplete(contact);
  const answered = questions.filter(question => question.options.includes(answers[question.id])).length;

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    if (!complete || !acknowledged) {
      setError("Preencha nome, WhatsApp e as quatro perguntas. Confirme o compartilhamento das informações.");
      return;
    }
    submitting.current = true;
    setSaving(true);
    setError("");
    const signature = JSON.stringify({ contact, answers });
    try {
      if (attempt.current?.signature !== signature) attempt.current = { signature, id: crypto.randomUUID() };
      const payload = createLeadPayload({ id: attempt.current.id, contact, questions, answers, attribution: collectAttribution(window.location.href) });
      await saveLead(payload);
      const destination = whatsappUrl(`Nome: ${payload.name}\nWhatsApp: +${payload.phone}\n\n${buildWhatsappMessage(questions, answers)}`);
      if (!tracked.current) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "lead_form_received", form_id: "contato_site", event_id: payload.lead_id });
        recordWhatsappRedirect(window.dataLayer);
        tracked.current = true;
      }
      // O visitante ainda precisa enviar a mensagem no WhatsApp.
      window.location.assign(destination);
    } catch {
      setError("Não foi possível confirmar o recebimento das informações. Tente novamente. Suas respostas continuam preenchidas.");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return <section className="qualification-section" id="contato" aria-labelledby="lead-form-heading">
    <div className="container qualification-layout">
      <header className="qualification-intro">
        <span className="eyebrow">Orientação inicial</span>
        <h2 id="lead-form-heading">Conte um pouco sobre sua situação.</h2>
        <p>Responda às perguntas abaixo para contextualizar seu contato com o escritório.</p>
        <p>Após enviar suas informações ao escritório, você será direcionado ao WhatsApp com as respostas preenchidas. Para iniciar a conversa, envie a mensagem por lá.</p>
        <div className="qualification-note"><ShieldCheck /><span>As informações ajudam no atendimento inicial. Cada caso depende de análise individual e da documentação disponível.</span></div>
      </header>
      <form className="qualification-form" onSubmit={submit}>
        {!configured && <p className="form-configuration-notice" role="status">Prévia em preparação: as alternativas do formulário da Meta ainda precisam ser confirmadas. O envio está indisponível.</p>}
        <p className="form-progress" aria-live="polite">{answered} de {questions.length} perguntas respondidas · Todas são obrigatórias</p>
        <fieldset className="qualification-fields" disabled={saving}>
        <div className="qualification-question"><label className="qualification-label" htmlFor="lead-name">Seu nome</label><input className="qualification-select" id="lead-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={120} value={contact.name} onChange={event => setContact(previous => ({ ...previous, name: event.target.value }))} /></div>
        <div className="qualification-question"><label className="qualification-label" htmlFor="lead-phone">WhatsApp com DDD</label><input className="qualification-select" id="lead-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={20} placeholder="(21) 99999-9999" value={contact.phone} onChange={event => setContact(previous => ({ ...previous, phone: event.target.value }))} /><p className="form-help">Informe um número brasileiro com DDD.</p></div>
        {questions.map((question, index) => <div key={question.id} className="qualification-question">
          <label className="qualification-label" htmlFor={question.id}><span>{String(index + 1).padStart(2, "0")}</span>{question.label}</label>
          <select className="qualification-select" id={question.id} name={question.id} required value={answers[question.id] || ""} onChange={event => { setAnswers(previous => ({ ...previous, [question.id]: event.target.value })); setError(""); }}>
            <option value="" disabled>Selecione uma resposta</option>
            {question.options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>)}
        <label className="form-acknowledgement"><input type="checkbox" required checked={acknowledged} onChange={event => { setAcknowledged(event.target.checked); setError(""); }} /><span>Concordo com o envio do meu nome, WhatsApp e respostas ao escritório, com registro para o atendimento solicitado e continuidade pelo WhatsApp.</span></label>
        </fieldset>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button form-submit" type="submit" disabled={!complete || !acknowledged || saving} aria-busy={saving}><MessageCircle /> {saving ? "Enviando informações…" : "Enviar e continuar no WhatsApp"} <ArrowRight /></button>
        <p className="form-help">Preencha seus dados, responda às quatro perguntas e confirme acima. O WhatsApp será aberto após o recebimento das informações.</p>
      </form>
    </div>
  </section>;
}
