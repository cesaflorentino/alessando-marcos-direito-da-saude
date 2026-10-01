import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsappMessage, isQuestionnaireComplete, isQuestionnaireConfigured, recordWhatsappRedirect } from "../src/modules/home/form/lead-form.js";
import { leadFormQuestions } from "../src/config/lead-form.config.js";
import { whatsappUrl } from "../src/config/template.config.js";

// Fixture técnica; não representa as alternativas reais do formulário da Meta.
const questions = Array.from({ length: 4 }, (_, index) => ({ id: `q${index}`, label: `Pergunta ${index + 1}?`, options: ["Alternativa A", "Alternativa B"] }));
const answers = Object.fromEntries(questions.map(question => [question.id, question.options[0]]));

test("as opções propostas estão configuradas e respostas vazias continuam bloqueadas", () => {
  assert.equal(isQuestionnaireConfigured(leadFormQuestions), true);
  assert.equal(isQuestionnaireComplete(leadFormQuestions, {}), false);
  assert.equal(isQuestionnaireConfigured(leadFormQuestions.map(question => ({ ...question, options: [] }))), false);
});
test("uma pergunta ausente ou resposta fora das alternativas impede envio", () => {
  assert.equal(isQuestionnaireComplete(questions, { ...answers, q3: undefined }), false);
  assert.equal(isQuestionnaireComplete(questions, { ...answers, q2: "resposta inválida" }), false);
  assert.throws(() => buildWhatsappMessage(questions, { ...answers, q0: undefined }));
});
test("aceita as quatro respostas válidas sem confundir opção negativa com campo vazio", () => {
  const negative = questions.map(question => ({ ...question, options: ["Sim", "Não"] }));
  const negativeAnswers = Object.fromEntries(negative.map(question => [question.id, "Não"]));
  assert.equal(isQuestionnaireComplete(negative, negativeAnswers), true);
});
test("rejeita identificadores duplicados e configuração incompleta", () => {
  assert.equal(isQuestionnaireConfigured(questions.slice(0, 3)), false);
  assert.equal(isQuestionnaireConfigured(questions.map(question => ({ ...question, id: "duplicado" }))), false);
});
test("WhatsApp usa o número existente e preserva perguntas, respostas e acentuação", () => {
  const message = buildWhatsappMessage(questions, answers);
  const url = new URL(whatsappUrl(message));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/5521971503548");
  assert.equal(url.searchParams.get("text"), message);
  for (const question of questions) assert.ok(message.includes(`${question.label}\n${answers[question.id]}`));
});
test("tracking não transmite respostas, dados médicos ou contato pessoal", () => {
  const dataLayer = [];
  recordWhatsappRedirect(dataLayer);
  assert.deepEqual(dataLayer, [{ event: "whatsapp_form_redirect", form_id: "contato_site" }]);
});
