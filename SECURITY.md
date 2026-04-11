# Security Policy

_Última atualização: 11 de abril de 2026._

## Escopo de segurança
O projeto é uma extensão de navegador Manifest V3 com foco em minimização de permissões, segurança de UI e transparência de fluxo de dados.

## Práticas adotadas
- Permissões mínimas no manifesto (`contextMenus`, `storage`).
- `host_permissions` restrito ao endpoint da MyMemory API.
- Sem uso de `innerHTML` para renderizar texto de usuário/API no histórico.
- Armazenamento local limitado para histórico e cache.
- Tratamento explícito de falhas de rede/API no fluxo de tradução.

## Modelo de ameaça (resumo)
Riscos principais considerados:
1. Injeção de conteúdo na UI do popup.
2. Exposição de dados sensíveis ao usar provedor externo de tradução.
3. Uso excessivo de permissões de extensão.
4. Falhas de UX que levem o usuário a decisões inseguras.

## Reportando vulnerabilidades
Se você identificar uma vulnerabilidade:
1. Abra uma issue com título `security:` descrevendo impacto e reprodução.
2. Se preferir, sinalize que deseja reporte privado na issue sem detalhes técnicos públicos.
3. O mantenedor deve responder com triagem inicial em até 7 dias corridos.

## Boas práticas para usuários e equipes
- Evite traduzir dados sensíveis, segredos, dados regulados ou informações confidenciais sem validação interna.
- Revise a política de privacidade antes de adoção corporativa.
- Em ambientes enterprise, considere roadmap para backend próprio de tradução.
