import test from "node:test";
import assert from "node:assert/strict";
import { collectAttribution, createLeadPayload, isContactComplete, normalizePhone, saveLead } from "../src/modules/home/form/lead-submission.js";
import { leadFormQuestions } from "../src/config/lead-form.config.js";
import handler, { validatePayload } from "../api/leads.js";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const id = "d709ce03-b05c-4d2c-ab40-3e317682c859";
const payload = createLeadPayload({ id, contact: { name: "Contato de teste", phone: "(21) 99999-9999" }, questions: leadFormQuestions, answers: Object.fromEntries(leadFormQuestions.map(q => [q.id, q.options[0]])), attribution: collectAttribution("https://www.grupoamgoncalves.adv.br/?utm_source=google&gclid=teste&nome=privado#contato") });

test("contato exige nome e número brasileiro com DDD", () => {
  assert.equal(normalizePhone("(21) 99999-9999"), "5521999999999");
  assert.equal(normalizePhone("+55 21 99999-9999"), "5521999999999");
  assert.equal(isContactComplete({ name: " ", phone: "21999999999" }), false);
  assert.equal(isContactComplete({ name: "Teste", phone: "123" }), false);
});
test("atribuição descarta campos arbitrários e remove query e hash da página", () => {
  assert.equal(payload.attribution.utm_source, "google");
  assert.equal(payload.attribution.landing_page, "https://www.grupoamgoncalves.adv.br/");
  assert.equal(payload.attribution.nome, undefined);
});
test("servidor rejeita respostas fora da lista, consentimento ausente e ID inválido", () => {
  assert.equal(validatePayload(payload), true);
  assert.equal(validatePayload({ ...payload, consent: false }), false);
  assert.equal(validatePayload({ ...payload, lead_id: "inválido" }), false);
  assert.equal(validatePayload({ ...payload, answers: { ...payload.answers, origem: "outra" } }), false);
});
test("cliente só aceita confirmação explícita com o ID enviado", async () => {
  await assert.rejects(saveLead(payload, async () => ({ ok: true, json: async () => ({ accepted: false }) })));
  await assert.rejects(saveLead(payload, async () => ({ ok: true, json: async () => ({ accepted: true, lead_id: "outro" }) })));
  assert.deepEqual(await saveLead(payload, async () => ({ ok: true, json: async () => ({ accepted: true, lead_id: id }) })), { accepted: true, lead_id: id });
});
function response() {
  return { code: 0, body: null, setHeader() {}, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
test("API rejeita método, origem e JSON incorretos sem enviar ao receptor", async () => {
  for (const [req, expected] of [[{ method: "GET", headers: {} }, 405], [{ method: "POST", headers: { origin: "https://outro.example" }, body: payload }, 403], [{ method: "POST", headers: {}, body: "{" }, 400]]) {
    const res = response(); await handler(req, res); assert.equal(res.code, expected);
  }
});

test("receptor grava uma vez por ID e trata texto como valor, sem fórmula", () => {
  const rows = [];
  const context = vm.createContext({ ContentService: { MimeType: { JSON: "json" }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) }, PropertiesService: { getScriptProperties: () => ({ getProperty: key => key === "WEBHOOK_TOKEN" ? "segredo-de-teste" : "planilha-de-teste" }) }, LockService: { getScriptLock: () => ({ waitLock() {}, hasLock: () => true, releaseLock() {} }) }, SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} } });
  vm.runInContext(readFileSync(new URL("../integrations/google-sheets/Code.gs", import.meta.url), "utf8"), context);
  const headers = vm.runInContext("HEADERS", context);
  const sheet = { getLastRow: () => rows.length + 1, getRange: (row) => ({ getValues: () => [headers], setValues: values => rows.push(values[0]), createTextFinder: id => ({ matchEntireCell: () => ({ findNext: () => rows.some(value => value[0] === id) ? {} : null }) }) }) };
  const input = { ...payload, name: "=FORMULA_TESTE", token: "segredo-de-teste" };
  const send = value => context.doPost({ postData: { contents: JSON.stringify(value) } });
  assert.equal(send({ ...input, token: "errado" }).accepted, false);
  assert.equal(send(input).accepted, true);
  assert.equal(send(input).accepted, true);
  assert.equal(rows.length, 1);
  assert.equal(rows[0][2], "'=FORMULA_TESTE");
  assert.equal(rows[0][20], "Novo");
  assert.equal(rows[0][21], "Pendente");
});
