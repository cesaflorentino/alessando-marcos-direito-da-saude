// Instalar no Apps Script vinculado à planilha confirmada deste cliente.
// Propriedades do script: SPREADSHEET_ID e WEBHOOK_TOKEN (segredo do servidor).
// O endpoint da landing page valida as respostas antes de chamar este receptor.
const HEADERS = ['ID do lead', 'Recebido em (UTC)', 'Nome', 'WhatsApp', 'Atendimento solicitado', 'Plano ou SUS', 'Pedido e documentação', 'Risco informado', 'Origem', 'Mídia', 'Campanha', 'Conteúdo / anúncio', 'Termo', 'Página de entrada', 'GCLID', 'GBRAID', 'WBRAID', 'FBCLID', 'Consentimento', 'Versão do consentimento', 'Etapa do atendimento', 'Qualificação', 'Motivo da classificação', 'Perfil financeiro informado', 'Responsável', 'Primeiro contato em', 'Reunião em', 'Contrato em', 'Observações'];

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function safeCell(value) {
  const text = String(value || '').slice(0, 500);
  return /^[=+@-]/.test(text.trimStart()) ? "'" + text : text;
}
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(e.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const token = properties.getProperty('WEBHOOK_TOKEN');
    if (!token || data.token !== token || data.consent !== true || data.form_id !== 'contato_site' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(data.lead_id || '')) return jsonResponse({ accepted: false });
    if (!data.name || !/^55\d{10,11}$/.test(data.phone || '') || !['atendimento', 'origem', 'documentacao', 'risco'].every(key => typeof data.answers?.[key] === 'string' && data.answers[key])) return jsonResponse({ accepted: false });
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID')).getSheetByName('Leads — Site');
    if (!sheet || JSON.stringify(sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]) !== JSON.stringify(HEADERS)) return jsonResponse({ accepted: false });
    const lastRow = sheet.getLastRow();
    if (lastRow > 1 && sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(data.lead_id).matchEntireCell(true).findNext()) return jsonResponse({ accepted: true, lead_id: data.lead_id });
    const a = data.attribution || {};
    const values = [data.lead_id, new Date().toISOString(), data.name, data.phone, data.answers.atendimento, data.answers.origem, data.answers.documentacao, data.answers.risco, a.utm_source || 'Não identificada', a.utm_medium, a.utm_campaign, a.utm_content, a.utm_term, a.landing_page, a.gclid, a.gbraid, a.wbraid, a.fbclid, 'Sim', data.consent_version, 'Novo', 'Pendente', '', '', '', '', '', '', ''];
    sheet.getRange(lastRow + 1, 1, 1, HEADERS.length).setValues([values.map(safeCell)]);
    SpreadsheetApp.flush();
    return jsonResponse({ accepted: true, lead_id: data.lead_id });
  } catch {
    // Não incluir contato, token ou dados de saúde na resposta ou nos logs.
    return jsonResponse({ accepted: false });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
