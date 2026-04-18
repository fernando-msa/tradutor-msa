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
