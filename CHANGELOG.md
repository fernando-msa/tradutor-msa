# Changelog

Todas as mudanças relevantes deste projeto são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [2.2.0] - 2026-04-11

### Adicionado
- Política de privacidade completa em `PRIVACY_POLICY.md`.
- Material de publicação para stores em `store/STORE_LISTING.md`.
- Documentação de contribuição, suporte, conduta e templates de issue/PR.
- Cache local de traduções recentes para reduzir chamadas duplicadas.

### Alterado
- Refatoração total de `popup.js` com estado explícito, tratamento de erro robusto, renderização segura e melhor UX.
- Atualização de `popup.html`/`popup.css` com melhorias de acessibilidade, microcopy e feedback visual.
- `manifest.json` com permissões mínimas, `host_permissions` restrito e CSP explícita.
- `background.js` simplificado e endurecido para fluxo de menu de contexto.
- `README.md` reescrito como documentação de produto profissional.
- `SECURITY.md` atualizado para política real de segurança.

### Corrigido
- Código corrompido no final de `popup.js` que quebrava o fluxo de avaliação.
- Uso de `innerHTML` para renderização de itens de histórico com texto externo.
- Tratamento inconsistente de erro de tradução/rede.
