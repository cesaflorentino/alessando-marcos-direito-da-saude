export function isQuestionnaireConfigured(questions) {
  return Array.isArray(questions) && questions.length === 4 &&
    questions.every(question => typeof question.id === "string" && question.id.trim() &&
      typeof question.label === "string" && question.label.trim() &&
      Array.isArray(question.options) && question.options.length >= 2 &&
      question.options.every(option => typeof option === "string" && option.trim()) &&
      new Set(question.options).size === question.options.length) &&
    new Set(questions.map(question => question.id)).size === questions.length;
}

export function isQuestionnaireComplete(questions, answers) {
  return isQuestionnaireConfigured(questions) &&
    questions.every(question => question.options.includes(answers[question.id]));
}

export function buildWhatsappMessage(questions, answers) {
  if (!isQuestionnaireComplete(questions, answers)) {
    throw new Error("Responda todas as perguntas com uma alternativa válida.");
  }
  return [
    "Olá! Preenchi o formulário do site e gostaria de receber orientação sobre meu caso.",
    ...questions.map(question => `${question.label}\n${answers[question.id]}`),
  ].join("\n\n");
}

// O evento indica apenas preenchimento e direcionamento. Não confirma envio,
// recebimento, qualificação, contratação ou integração com a planilha/CRM.
// Não enviar respostas sobre saúde nem dados pessoais às plataformas de anúncios.
export function recordWhatsappRedirect(dataLayer) {
  dataLayer.push({ event: "whatsapp_form_redirect", form_id: "contato_site" });
}
