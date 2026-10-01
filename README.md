# Template 4 — Direito da Saúde

Landing page vertical especializada em demandas de Direito da Saúde. A jornada conduz o visitante ao formulário de contato e, após o preenchimento, ao WhatsApp do escritório.

## Personalização

Edite `src/config/template.config.js` para alterar escritório, profissional, OAB, contatos, endereço, horário e mapa.

Edite `src/modules/home/pages/HomePage.jsx` para adaptar situações atendidas, áreas, perguntas frequentes e textos institucionais.

## Estrutura

- navbar fixa;
- hero especializado;
- situações atendidas;
- áreas de atuação;
- bloco de urgência;
- processo em três etapas;
- diferenciais;
- perfil profissional;
- FAQ;
- formulário obrigatório antes do contato pelo WhatsApp;
- localização com mapa no final;
- rodapé com aviso informativo.

## Executar

```bash
npm install
npm run dev
```

Antes de publicar, confirme todos os dados, substitua a foto demonstrativa e valide a conformidade do conteúdo com as regras profissionais aplicáveis.

## Formulário de contato

As perguntas e alternativas ficam em `src/config/lead-form.config.js`. As quatro perguntas são obrigatórias, com uma alternativa por pergunta. As opções desta implementação foram propostas a partir do histórico e revisadas na prévia; não são uma exportação verificada do último formulário da Meta.

Todos os CTAs de contato levam a `#contato`. O botão final é liberado somente após as quatro respostas e a confirmação de compartilhamento com o escritório. A mensagem gerada inclui as perguntas e respostas; o visitante ainda precisa enviá-la no WhatsApp.

O evento `whatsapp_form_redirect` no `dataLayer` indica preenchimento e direcionamento. Ele contém apenas `form_id: contato_site`, sem dados pessoais ou respostas de saúde, e não representa mensagem recebida, lead qualificado ou contrato. O container GTM existente foi preservado; suas tags remotas devem ser conferidas antes de configurar conversões ou evitar duplicidade com eventos de clique.

O formulário exige nome, WhatsApp com DDD, quatro respostas em campos de seleção e confirmação de compartilhamento. As perguntas contemplam os atendimentos apresentados na landing page.

A integração está preparada em `api/leads.js` e `integrations/google-sheets/Code.gs`, mas ainda depende da identificação da planilha e da configuração do receptor e da hospedagem. O WhatsApp só abre após confirmação explícita do salvamento. Sem configuração, o envio falha de forma visível e mantém os campos preenchidos. Não publicar essa versão antes do teste de recebimento real. Consulte `integrations/google-sheets/README.md`.

O evento `lead_form_received` é emitido após confirmação de recebimento, sem nome, telefone ou respostas de saúde. Ele não comprova qualificação ou contrato. As configurações remotas da Meta, Google Ads e GTM não foram alteradas.

Validação do fluxo:

```bash
node --test tests/lead-form.test.mjs tests/lead-submission.test.mjs
npm run lint
npm run build
```
