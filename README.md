# Tradutor MSA Extensão

**Extensão de tradução leve, segura e focada em produtividade no navegador.**

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![Versão](https://img.shields.io/badge/version-2.2.0-informational)
![Licença MIT](https://img.shields.io/badge/license-MIT-green)

---

## Hero

Traduza textos rapidamente sem sair da aba atual, com histórico local, suporte a voz e transparência clara sobre envio de dados para API externa.

## Problema que o projeto resolve

Quem trabalha com documentação, atendimento, estudos ou colaboração internacional precisa traduzir trechos curtos o tempo todo. Alternar entre abas e ferramentas quebra o foco.

## Benefícios principais

- Fluxo rápido no popup e menu de contexto.
- UI simples para uso diário.
- Dados locais sob controle do usuário (histórico + preferências).
- Transparência explícita: tradução usa serviço externo.

## Funcionalidades

- Tradução manual de texto.
- Detecção automática do idioma de origem.
- Menu de contexto para traduzir seleção.
- Histórico local das últimas 20 traduções.
- Cache local das últimas 30 traduções para reduzir chamadas repetidas.
- Entrada por voz (quando disponível no navegador).
- Leitura em voz alta da tradução.
- Copiar texto original/traduzido em um clique.

## Segurança e privacidade

- Permissões reduzidas ao mínimo necessário.
- Sem backend próprio.
- Renderização segura de histórico (sem `innerHTML` para conteúdo externo).
- Política de privacidade detalhada em [PRIVACY_POLICY.md](PRIVACY_POLICY.md).
- Política de segurança em [SECURITY.md](SECURITY.md).

## Compatibilidade

- Chrome (Manifest V3)
- Edge (Manifest V3)
- Firefox (compatibilidade baseada nas APIs equivalentes; voz pode variar)

## Instalação

### Edge e Firefox

- Edge: [Store oficial](https://microsoftedge.microsoft.com/addons/detail/tradutor-msa-extens%C3%A3o/dkojdeehfjpjphkndhagfbhknnlckami)
- Firefox: [Add-ons Mozilla](https://addons.mozilla.org/pt-BR/firefox/addon/tradutor-msa/)

### Instalação local (dev)

1. Clone o repositório.
2. Abra a página de extensões do navegador.
3. Ative modo de desenvolvedor.
4. Carregue a pasta do projeto sem compactar.

## Como usar

1. Abra o popup da extensão.
2. Selecione idioma de origem e destino.
3. Digite, cole ou dite o texto.
4. Clique em **Traduzir**.
5. Copie, ouça em voz alta ou recupere no histórico.

## Arquitetura resumida

- `popup.html/css/js`: UI, estado, tradução, voz, histórico e cache local.
- `background.js`: criação de menu de contexto e abertura de popup com seleção.
- `languages.js`: catálogo de idiomas.
- `manifest.json`: permissões e configurações MV3.

## Considerações de privacidade e uso corporativo

- O texto enviado para tradução sai do navegador para a MyMemory API.
- Não use a extensão para conteúdo confidencial sem validação do seu time de segurança/compliance.
- Para cenários enterprise, o roadmap prevê possibilidade de plugar um provedor próprio no futuro.

## Limitações conhecidas

- Limites da MyMemory API podem afetar volume diário.
- Reconhecimento de voz depende de suporte do navegador.
- A disponibilidade de vozes TTS varia por sistema operacional.

## Roadmap

### Curto prazo

- Publicação padronizada nas três stores.
- Cobertura básica de testes automatizados para fluxo principal.

### Médio prazo

- Configuração de provedor de tradução alternativo.
- Exportação/importação opcional do histórico local.

### Longo prazo

- Camada enterprise com endpoint privado.
- Políticas administrativas para ambientes corporativos.

## Processo de release

Consulte [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) para preparar versão, validar, empacotar e publicar no Edge e Firefox.

## Contribuição

Consulte [CONTRIBUTING.md](CONTRIBUTING.md).

## Suporte

Consulte [SUPPORT.md](SUPPORT.md).

## Licença

Projeto sob licença [MIT](LICENSE).
