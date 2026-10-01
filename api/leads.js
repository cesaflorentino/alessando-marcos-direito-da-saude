import { leadFormQuestions } from "../src/config/lead-form.config.js";
import { isQuestionnaireComplete } from "../src/modules/home/form/lead-form.js";
import { isContactComplete, normalizePhone } from "../src/modules/home/form/lead-submission.js";

export function validatePayload(body) {
  return Boolean(body && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.lead_id || "") && body.form_id === "contato_site" && body.consent === true && body.consent_version === "site-2026-10-01" && isContactComplete(body) && isQuestionnaireComplete(leadFormQuestions, body.answers || {}));
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Método indisponível." });
  const origin = req.headers.origin;
  const env = globalThis.process.env;
  if (origin && !["https://www.grupoamgoncalves.adv.br", "https://grupoamgoncalves.adv.br", env.LEADS_PREVIEW_ORIGIN].filter(Boolean).includes(origin)) return res.status(403).json({ error: "Origem não autorizada." });
  let body;
  try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: "Dados inválidos." }); }
  if (!validatePayload(body)) return res.status(400).json({ error: "Preenchimento inválido." });
  const endpoint = env.LEADS_WEBHOOK_URL;
  const token = env.LEADS_WEBHOOK_TOKEN;
  if (!endpoint || !token) return res.status(503).json({ error: "Recebimento ainda não configurado." });
  const keys = ["landing_page", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid"];
  const payload = { lead_id: body.lead_id, form_id: body.form_id, name: body.name.trim(), phone: normalizePhone(body.phone), answers: Object.fromEntries(leadFormQuestions.map(question => [question.id, body.answers[question.id]])), attribution: Object.fromEntries(keys.map(key => [key, String(body.attribution?.[key] || "").slice(0, 300)])), consent: true, consent_version: body.consent_version };
  try {
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, token }), signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error("Falha no recebimento");
    const receipt = await response.json();
    if (receipt.accepted !== true || receipt.lead_id !== payload.lead_id) throw new Error("Gravação não confirmada");
    return res.status(200).json({ accepted: true, lead_id: payload.lead_id });
  } catch {
    // Não registrar dados pessoais ou respostas de saúde nos logs.
    return res.status(502).json({ error: "Não foi possível confirmar o recebimento. Tente novamente." });
  }
}
