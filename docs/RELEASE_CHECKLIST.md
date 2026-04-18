# Checklist de Release - Tradutor MSA

## 1. Preparacao de versao

- Confirmar mudancas no [CHANGELOG.md](../CHANGELOG.md).
- Atualizar versao em [manifest.json](../manifest.json) seguindo SemVer.
- Garantir alinhamento de texto em [README.md](../README.md), [PRIVACY_POLICY.md](../PRIVACY_POLICY.md) e [store/STORE_LISTING.md](../store/STORE_LISTING.md).

## 2. Validacao tecnica minima

- Rodar checagem de sintaxe dos scripts:

```powershell
node --check background.js
node --check popup.js
node --check permission.js
node --check languages.js
```

- Revisar erros no editor para os arquivos principais.
- Teste manual no Edge e Firefox:
- Traducao manual
- Menu de contexto
- Historico
- Copiar texto
- Banner de avaliacao
- Voz (quando suportado)

## 3. Empacotamento

- Gerar pacotes em dist:

```powershell
./scripts/package_release.ps1
```

- Verificar os arquivos criados:
- dist/tradutor-msa-vX.Y.Z-edge.zip
- dist/tradutor-msa-vX.Y.Z-firefox.zip

## 4. Publicacao nas stores

- Edge Add-ons:
- Enviar zip edge
- Atualizar notas de versao
- Confirmar links de suporte e privacidade

- Firefox Add-ons:
- Enviar zip firefox
- Atualizar notas de versao
- Confirmar links de suporte e privacidade

## 5. Pos-publicacao

- Validar listagens publicas:
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tradutor-msa-extens%C3%A3o/dkojdeehfjpjphkndhagfbhknnlckami)
- [Firefox Add-ons](https://addons.mozilla.org/pt-BR/firefox/addon/tradutor-msa/)

- Criar tag git da release.
- Atualizar secao [Nao lancado] no [CHANGELOG.md](../CHANGELOG.md).

## 6. Check de qualidade de produto

- Confirmar que URL de suporte no app aponta para:
- [github.com/fernando-msa/tradutor-msa/issues](https://github.com/fernando-msa/tradutor-msa/issues)

- Confirmar que botao de avaliacao abre a loja correta por navegador.
- Confirmar que politica de privacidade cita envio para MyMemory API.
