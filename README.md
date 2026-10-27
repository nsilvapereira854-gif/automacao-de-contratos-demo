# Automação de Contratos — demonstração pública

Interface demonstrativa para explorar a navegação, os cadastros e um assistente de
contrato usando somente dados fictícios. A identidade visual e as telas foram
adaptadas para funcionar diretamente no navegador, sem privilégios do Electron.

## Tecnologias

React, React DOM, TypeScript, CSS e Vite. Prettier verifica a formatação.
Não há backend, API, PostgreSQL, Electron ou integração externa nesta versão.

## Instalar e executar

Use Node.js 24 e npm. Na pasta do projeto:

```sh
npm ci
npm run dev
```

Abra o endereço local exibido pelo Vite, normalmente http://127.0.0.1:5173.
O servidor de desenvolvimento fica restrito ao computador local.
O download inicial das dependências requer internet.

Para verificar e compilar:

```sh
npm run check
npm run preview
```

O build estático é gerado em dist/, que não é versionado. A publicação deste
repositório disponibiliza o código; não configura automaticamente hospedagem.

## Funcionalidades simuladas

- Clientes: exemplos inventados, pesquisa e inclusão somente em memória.
- Novo contrato: etapas, partes, cônjuge e representante, com resumo visual.
- Reutilização de pessoas: salva cadastros fictícios apenas durante a sessão.
- Configurações: botão de verificação simulada, sem servidor ou credenciais.
- Outros módulos: mantêm a navegação e indicam sua indisponibilidade.

Os dados dos formulários não são enviados a servidores nem gravados em cookies,
localStorage, IndexedDB ou arquivos. Recarregar a página restaura os exemplos e
apaga os cadastros incluídos. Sair da tela do assistente descarta seu formulário.
Use somente informações inventadas. Os números de identificação dos exemplos
são marcadores fictícios, sem validação de documentos reais.

## Limites da versão pública

Esta versão não contém o processamento real dos contratos, modelos ou cláusulas
internos. A prévia é um resumo sem validade jurídica. Não há login, assinatura,
exportação Word/PDF, uploads, OCR, leitura de arquivos, IA ou conexão com banco.
Nenhum documento real, imagem, certificado, segredo ou histórico do projeto
privado integra esta demonstração.

O aviso “Ambiente de demonstração — dados fictícios” aparece em todas as telas.
A aplicação não utiliza fontes remotas, analytics ou serviços externos. Vite
serve os próprios arquivos durante o desenvolvimento e usa conexão local para
atualização automática; os formulários não fazem requisições de dados.

## Cuidados ao contribuir

Não adicione dados pessoais, documentos de clientes, credenciais ou arquivos
.env reais. O .gitignore preserva o lockfile e permite modelos sem dados em
pastas apropriadas; revise todos os arquivos antes de qualquer publicação.
O repositório desta demonstração tem histórico independente do aplicativo privado.
