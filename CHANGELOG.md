# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado

- Checklist operacional de release em `docs/RELEASE_CHECKLIST.md`.
- Script de empacotamento reprodutível em `scripts/package_release.ps1`.

### Alterado

- `README.md` atualizado com seção de processo de release e links oficiais das stores.

### Corrigido

- Acessibilidade de abas no popup com papéis ARIA compatíveis.
- Compatibilidade de storage para WebExtensions com abordagem Promise-first e fallback.
- Direcionamento do botão de avaliação por navegador (Edge/Firefox).
- Padronização dos links canônicos de suporte do projeto.
- Timeout explícito e tratamento de resposta inválida no fluxo de tradução.
- Reidratação consistente do histórico para itens traduzidos com autodetecção.
- Alinhamento do conteúdo do pacote de release com inclusão do LICENSE.
- Validação mínima automatizada no GitHub Actions para checagem de sintaxe.
- Recuperação de quota no storage local com limpeza do cache antes de falhar.
- Feedback visível quando o texto selecionado no menu de contexto excede o limite.
- Teste de contrato estático para manifesto, popup, background e safeguards principais.
- Melhorias de acessibilidade no popup com descrições adicionais e estado ocupado no fluxo de tradução.
- Alinhamento do workflow de release com o pacote local, incluindo o LICENSE no zip publicado.
- Lint básico em Node para validar sintaxe JS e bloquear padrões inseguros na base principal.
- Lint expandido para detectar switch parameters com default no PowerShell e divergência entre pacote local e workflow de release.

## [2.2.0] - 2026-04-11

### 2.2.0 - Adicionado

- Política de privacidade completa em `PRIVACY_POLICY.md`.
- Material de publicação para stores em `store/STORE_LISTING.md`.
- Documentação de contribuição, suporte, conduta e templates de issue/PR.
- Cache local de traduções recentes para reduzir chamadas duplicadas.

### 2.2.0 - Alterado

- Refatoração total de `popup.js` com estado explícito, tratamento de erro robusto, renderização segura e melhor UX.
- Atualização de `popup.html`/`popup.css` com melhorias de acessibilidade, microcopy e feedback visual.
- `manifest.json` com permissões mínimas, `host_permissions` restrito e CSP explícita.
- `background.js` simplificado e endurecido para fluxo de menu de contexto.
- `README.md` reescrito como documentação de produto profissional.
- `SECURITY.md` atualizado para política real de segurança.

### 2.2.0 - Corrigido

- Código corrompido no final de `popup.js` que quebrava o fluxo de avaliação.
- Uso de `innerHTML` para renderização de itens de histórico com texto externo.
- Tratamento inconsistente de erro de tradução/rede.
