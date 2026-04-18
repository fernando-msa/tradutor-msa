# Política de Privacidade - Tradutor MSA Extensão

_Última atualização: 11 de abril de 2026._

## Resumo rápido

- A extensão processa o texto digitado/selecionado para realizar tradução.
- O texto enviado para tradução **sai do navegador** e é encaminhado para a **MyMemory API** (`api.mymemory.translated.net`).
- A extensão não possui servidor próprio.
- Histórico e preferências ficam salvos localmente no navegador, e você pode apagar a qualquer momento.

## Quais dados são processados

1. **Texto de entrada** (digitado, colado, selecionado no menu de contexto ou obtido por voz).
2. **Idioma de origem e destino**.
3. **Texto traduzido** recebido da API.
4. **Preferências locais** (idiomas usados, contador para banner de avaliação, histórico e cache local de traduções).

## Quando os dados saem do navegador

O texto de entrada sai do navegador somente ao clicar em **Traduzir** (ou quando a tradução automática é acionada a partir do menu de contexto/voz). Nesse momento, a extensão envia o texto para a MyMemory API para obter a resposta de tradução.

## Serviço externo utilizado

- **Provedor**: MyMemory API
- **Endpoint**: `https://api.mymemory.translated.net/get`
- O uso da API está sujeito às políticas e limites operacionais do provedor.

## Armazenamento local

A extensão usa `chrome.storage.local`/equivalente para:

- histórico de traduções (máximo de 20 itens);
- cache local recente de traduções (máximo de 30 itens);
- últimos idiomas selecionados;
- estado do banner de avaliação.

Nenhum desses dados é enviado para servidores próprios da extensão.

## O que a extensão NÃO faz

- Não cria conta de usuário.
- Não rastreia navegação completa.
- Não coleta telemetria própria.
- Não envia histórico para backend próprio.

## Limitações e uso responsável

- Como há envio de texto para serviço externo, **não recomendamos usar conteúdo confidencial, sensível ou regulado** sem avaliação prévia de risco/compliance da sua organização.
- O recurso de voz depende de APIs do navegador/sistema operacional e pode variar por plataforma.

## Controle pelo usuário

Você pode:

- limpar histórico pelo popup;
- remover dados locais ao limpar dados da extensão no navegador;
- desinstalar a extensão a qualquer momento.

## Contato

Para dúvidas de privacidade e segurança, abra uma issue em:
[https://github.com/fernando-msa/tradutor-msa/issues](https://github.com/fernando-msa/tradutor-msa/issues)
