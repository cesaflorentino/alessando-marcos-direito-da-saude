import { isQuestionnaireComplete } from "./lead-form.js";

export function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (/^\d{10,11}$/.test(digits)) return `55${digits}`;
  return /^55\d{10,11}$/.test(digits) ? digits : "";
}
export function isContactComplete(contact) {
  const name = String(contact.name || "").trim();
  return name.length >= 2 && name.length <= 120 && Boolean(normalizePhone(contact.phone));
}
export function collectAttribution(href) {
  const url = new URL(href);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid"];
  return { landing_page: `${url.origin}${url.pathname}`, ...Object.fromEntries(keys.map(key => [key, (url.searchParams.get(key) || "").slice(0, 300)])) };
}
export function createLeadPayload({ id, contact, questions, answers, attribution }) {
  if (!isContactComplete(contact) || !isQuestionnaireComplete(questions, answers)) throw new Error("Preenchimento inválido.");
  return { lead_id: id, form_id: "contato_site", name: contact.name.trim(), phone: normalizePhone(contact.phone), answers: Object.fromEntries(questions.map(question => [question.id, answers[question.id]])), attribution, consent: true, consent_version: "site-2026-10-01" };
}
export async function saveLead(payload, fetcher = fetch) {
  const response = await fetcher("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("Recebimento não confirmado.");
  const result = await response.json();
  if (result.accepted !== true || result.lead_id !== payload.lead_id) throw new Error("Recebimento não confirmado.");
  return result;
}
