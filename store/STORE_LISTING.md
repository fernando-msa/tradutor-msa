# Store Listing Kit — Tradutor MSA (v2.2.1)

## 1) Descrição curta

Tradutor leve para navegador com histórico local, voz e menu de contexto, com transparência sobre uso de API externa.

## 2) Descrição longa

Tradutor MSA é uma extensão de produtividade para tradução rápida dentro do navegador. O foco é simplicidade operacional, baixo atrito e comunicação transparente sobre privacidade.

Você pode traduzir textos digitados, colados ou selecionados em páginas web (menu de contexto), ouvir a tradução em voz alta, usar ditado por voz quando o navegador suportar e recuperar traduções recentes pelo histórico local.

A extensão não possui backend próprio. Para traduzir, ela envia o texto para a MyMemory API. Histórico, cache e preferências ficam armazenados localmente no navegador e podem ser apagados pelo usuário.

## 3) Funcionalidades

- Tradução rápida com detecção automática de idioma.
- Menu de contexto para traduzir seleção de texto.
- Histórico local (até 20 itens).
- Cache local de traduções recentes (até 30 itens).
- Copiar original/tradução em um clique.
- Leitura em voz alta e ditado por voz (com limitações por navegador).

## 4) Benefícios

- Menos troca de contexto durante tarefas de escrita/leitura.
- Fluxo direto para traduções curtas e frequentes.
- Interface enxuta e fácil de aprender.
- Transparência clara de dados e privacidade.

## 5) Palavras-chave

tradutor, tradução, produtividade, browser extension, chrome extension, edge add-on, firefox add-on, mymemory, menu de contexto, voz

## 6) Texto de privacidade resumido

Ao traduzir, o texto é enviado para a MyMemory API (serviço externo). A extensão não possui servidor próprio. Histórico e preferências ficam salvos localmente no navegador e podem ser limpos pelo usuário.

## 7) Notas de atualização (v2.2.1)

- Release de manutenção com foco em confiabilidade e publicação.
- Timeout seguro na tradução e tratamento de respostas inválidas.
- Recuperação de quota do storage com limpeza de cache.
- Validação automatizada, lint básico e alinhamento do pacote de release.

Versão pronta para colar nas lojas: [RELEASE_NOTES_v2.2.1.md](RELEASE_NOTES_v2.2.1.md).

## 8) FAQ curta

**A extensão funciona offline?**
Não. A tradução depende da MyMemory API.

**A extensão envia meus dados para servidores próprios?**
Não. Não há backend próprio.

**Posso usar com dados confidenciais?**
Não é recomendado sem validação de risco da sua organização, pois a tradução usa serviço externo.

## 9) Sugestões de screenshots

1. Tela principal com seleção de idiomas e botão Traduzir.
2. Resultado traduzido com ações de copiar e voz.
3. Histórico local com itens recentes.
4. Fluxo de menu de contexto (texto selecionado -> popup aberto).

## 10) Roteiro de GIF demonstrativo (20–30s)

1. Abrir popup.
2. Digitar texto curto e traduzir.
3. Copiar resultado.
4. Usar botão de voz para leitura.
5. Mostrar item salvo no histórico.
6. Selecionar texto em página e abrir via menu de contexto.
