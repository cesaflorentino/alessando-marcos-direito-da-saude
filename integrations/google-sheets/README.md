# Recebimento dos leads do site

Status: código preparado; destino e implantação ainda dependem da confirmação da planilha e dos acessos. Não publicar a versão com salvamento obrigatório antes de validar o recebimento real.

1. Confirmar a planilha do Dr. Alessandro e adicionar somente a aba `Leads — Site`, com a linha de cabeçalho exatamente como `HEADERS` em `Code.gs`. Não alterar as abas existentes.
2. Preferir a automação existente, caso seu acesso seja restabelecido. O receptor deve autenticar `token`, validar dados, evitar duplicatas pelo `lead_id`, gravar a linha e só então responder JSON `{ "accepted": true, "lead_id": "<mesmo ID recebido>" }`. Um HTTP 200 isolado não confirma gravação.
3. Alternativa pronta: instalar `Code.gs` no Apps Script vinculado à planilha. Configurar `SPREADSHEET_ID` e `WEBHOOK_TOKEN` em Propriedades do script. Implantar como aplicação Web executada pelo proprietário. O token deve ser longo e aleatório, nunca colocado no site, no GitHub ou em logs.
4. Na hospedagem Vercel, configurar somente no servidor `LEADS_WEBHOOK_URL` (URL HTTPS do receptor) e `LEADS_WEBHOOK_TOKEN` (mesmo segredo). `LEADS_PREVIEW_ORIGIN` é opcional, com uma origem exata, apenas para homologação. Publicar a função `api/leads.js` junto com o site. O preview Vite isolado não executa a função.
5. Verificar as regras existentes de rotas do projeto; `/api/leads` deve chegar à função, sem ser reescrito para `index.html`.
6. Fazer um envio de homologação sem dados de pessoa real. Confirmar uma única linha, respostas e origem corretas; reenviar o mesmo ID e confirmar ausência de duplicação. Testar falha/timeout: nenhuma conversão deve ser emitida nem o WhatsApp aberto sem confirmação. Registrar o teste como teste, nunca como lead qualificado.
7. Revisar no GTM se tags de clique leem variáveis do formulário ou da mensagem do WhatsApp. A implementação só emite identificador do formulário e ID do evento; não transmite nome, telefone ou respostas de saúde no `dataLayer`.

`lead_form_received` representa formulário registrado. `whatsapp_form_redirect` representa redirecionamento. Nenhum deles confirma conversa recebida, qualificação ou contrato. As tags e conversões remotas não foram configuradas nesta alteração.

As respostas não selecionam nem rejeitam acesso ao serviço jurídico. Qualificação, perfil financeiro, reunião e contrato são preenchidos pelo atendimento. Não importar esses eventos nas plataformas sem status confirmado e mapeamento de atribuição validado.

UTMs e identificadores de clique são registrados se presentes no endereço no momento do envio; não identificam automaticamente anúncio ou origem quando ausentes. A página de entrada exclui query e hash. Não colocar informações pessoais nas UTMs.

O segredo protege a comunicação servidor → receptor. O formulário público ainda pode receber spam; origem permitida não prova identidade. Monitorar antes de adicionar mecanismos antispam na hospedagem. Não usar o endpoint como uma classificação jurídica automatizada.
