# Auditoria de Produto e Código — Tradutor MSA

Data: 2026-04-11

## 1) Problemas de código identificados (antes da refatoração)
- `popup.js` monolítico e com acoplamento alto entre UI, rede, storage e voz.
- Trecho corrompido no final do arquivo quebrando fluxo de avaliação.
- Uso de `innerHTML` para renderizar histórico com texto externo.
- Tratamento de erros incompleto no `fetch` e em APIs de navegador.
- Concorrência de tradução limitada (lock global), sem proteção por request id.
- Persistência sem normalização de entrada e sem cache de traduções.

## 2) Problemas de produto
- README anterior misturava boas informações com promessas pouco claras.
- Ausência de política de privacidade dedicada e transparente.
- Narrativa de valor pouco orientada a confiança e adoção profissional.

## 3) Problemas de segurança
- Permissões acima do necessário (`activeTab`, `scripting`) para o fluxo atual.
- Falta de `host_permissions` explícito para o endpoint externo.
- `SECURITY.md` de template genérico sem política real.

## 4) Problemas de UX
- Feedback de estados incompleto (loading/erro/sucesso inconsistentes).
- Mensagens de permissão de voz pouco orientativas.
- Acessibilidade básica incompleta (aria-selected, labels e foco visível).
- Empty state de histórico sem contexto de valor.

## 5) Problemas de publicação
- Material de store disperso e sem kit único de copy.
- Falta de FAQ curta e texto de privacidade resumido para listings.

## 6) Quick wins aplicados
- Refatoração total do popup com estado explícito e funções menores.
- Remoção de `innerHTML` para conteúdo dinâmico de histórico.
- Redução de permissões no manifesto.
- Inclusão de política de privacidade e segurança reais.
- Kit de publicação para stores e melhoria de documentação de produto.

## 7) Backlog sugerido
### Curto prazo
- Automatizar smoke tests de popup (lint + testes de fluxo crítico).
- Publicar screenshots/GIF final para stores.

### Médio prazo
- Permitir configuração de provedor de tradução alternativo.
- Exportar/importar histórico local de forma opcional.

### Longo prazo
- Backend corporativo opcional (self-hosted).
- Políticas administrativas para ambientes enterprise gerenciados.
