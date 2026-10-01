// Alternativas propostas para a landing page a partir das perguntas do histórico.
// Não representam uma cópia verificada do último formulário da Meta.
// Conferir essa equivalência antes da publicação.
export const leadFormQuestions = [
  { id: "beneficiario", label: "Quem teve o medicamento negado?", options: ["Eu", "Um familiar", "Uma pessoa de quem cuido"] },
  { id: "documentacao", label: "Você já tem a prescrição médica e a negativa por escrito do plano ou SUS?", options: ["Tenho a prescrição e a negativa por escrito", "Tenho a prescrição, aguardando resposta", "Tenho a prescrição, mas a negativa foi apenas verbal", "Ainda não tenho a prescrição médica"] },
  { id: "origem", label: "A negativa foi de plano de saúde particular ou SUS?", options: ["Plano de saúde particular", "SUS", "Ambos", "Ainda estou aguardando uma resposta", "Não sei informar"] },
  { id: "risco", label: "Existe risco à saúde documentado em caso de demora no tratamento?", options: ["Sim, tenho um documento médico que informa esse risco", "Não", "Não sei informar"] },
];
