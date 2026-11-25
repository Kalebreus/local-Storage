# Recursos para estudar localStorage

**Aula: O que é o localStorage.** Links conferidos em **23/11/2026**.

Esta aula é independente. A prática usa produtos de IDs de `1` a `5`, com preços de `90`, `60`, `80`, `120` e `150`, respectivamente. O navegador armazena os dados; nenhuma API externa é necessária.

## Documentação consultada

| Fonte | Idioma | Nível sugerido | Como ajuda nesta aula |
| --- | --- | --- | --- |
| MDN: [Window.localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage) e [Web Storage API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Storage_API) | Português | Iniciante | Entender o armazenamento no navegador, sua separação por origem e a persistência entre sessões. |
| MDN: [getItem](https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/getItem), [setItem](https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/setItem), [removeItem](https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/removeItem) e [clear](https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/clear) | Português | Iniciante | Consultar a sintaxe para ler, gravar e remover dados. `getItem()` retorna `null` para uma chave ausente; `clear()` remove todas as chaves daquela área de armazenamento. |
| MDN: [JSON.stringify](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) e [JSON.parse](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) | Português | Iniciante | Transformar valores compatíveis em texto JSON e reconstruí-los. Conferir exemplos com arrays, objetos e valores primitivos, além do erro causado por JSON inválido. |
| MDN: [Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) e [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) | Inglês | Iniciante a intermediário | Consultar os detalhes sobre strings, navegação privada, URLs `file:` e operações síncronas. |
| MDN: [Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | Inglês | Intermediário | Entender origem, limites de armazenamento e situações em que gravar pode falhar ou dados podem ser removidos. |
| MDN: [Window: storage event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) | Inglês | Intermediário | Observar alterações feitas por outras abas da mesma origem e entender por que a aba que grava não recebe esse evento. |
| OWASP: [HTML5 Security Cheat Sheet — Local Storage](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage) | Inglês | Intermediário | Entender por que senhas, segredos e identificadores de sessão não devem ser guardados no localStorage. |

## Pontos para conferir durante a prática

- **Chaves e valores são strings.** Para guardar o array de produtos, use `JSON.stringify(produtos)`; ao recuperar, confira se `getItem()` retornou `null` antes de analisar e validar os dados. `JSON.parse()` também aceita números, strings, booleanos e `null` em JSON válido, além de objetos e arrays. Ele não valida sozinho se o resultado possui o formato esperado pela aplicação.
- **Persistência não significa backup.** O localStorage não tem expiração automática, mas os dados podem desaparecer quando o usuário limpa o armazenamento ou conforme as condições do navegador. Na navegação privada, a persistência é limitada à sessão privada. Leituras e gravações podem falhar por políticas do navegador ou limites de armazenamento; trate essas falhas.
- **A origem considera protocolo, host e porta.** `http://localhost:5500` e `http://localhost:5501` usam áreas diferentes, assim como HTTP e HTTPS. Use um servidor HTTP local com endereço estável para a prática. O comportamento de localStorage em páginas abertas com `file:` é indefinido e pode variar entre navegadores.
- **As operações são síncronas.** Mantenha os dados do exercício pequenos e evite gravar repetidamente sem necessidade. A API não depende de `await`.
- **Não guarde senhas ou segredos.** JavaScript executado na mesma origem pode acessar esses dados. O armazenamento do navegador não oferece isolamento de informações sensíveis em relação aos scripts da aplicação.
- **O evento `storage` avisa outras abas da mesma origem.** Ele não é disparado na janela que fez a alteração. Atualize a interface da própria aba no fluxo da aplicação; use o evento para acompanhar alterações vindas de outra aba.
- **Remover uma chave e limpar a área são ações diferentes.** Prefira `removeItem()` com a chave do exercício para redefinir sua prática. `localStorage.clear()` apaga todas as chaves de localStorage da origem, inclusive as de outras funcionalidades servidas nela.

## Canais em português

As recomendações abaixo apontam para canais dos próprios autores dos vídeos conferidos. Os canais têm conteúdos variados; a relação direta com esta aula está nos vídeos selecionados na tabela seguinte.

| Canal | Idioma | Nível sugerido | Por que acompanhar |
| --- | --- | --- | --- |
| [Edu Pretel Desenvolvimento](https://www.youtube.com/@edupreteldesenvolvimento) | Português | Iniciante | A aula selecionada demonstra leitura e gravação de dados, conversão com JSON e recuperação após recarregar a página. |
| [Code Crux](https://www.youtube.com/channel/UCd2234SQ3UIuWMMoyuEgH7g) | Português | Iniciante a intermediário | O projeto selecionado combina localStorage e manipulação do DOM em um aplicativo de notas. |

## Videoaulas específicas

| Aula e autor | Idioma | Nível sugerido | Relação com o exercício |
| --- | --- | --- | --- |
| [61:LocalStorage Como salvar dados no navegador com JavaScript](https://www.youtube.com/watch?v=1Dcdr9siJmk) — Edu Pretel Desenvolvimento | Português | Iniciante | A descrição e os metadados confirmam uso de `setItem()`, `getItem()`, `JSON.stringify()` e `JSON.parse()`, com recuperação dos dados de um formulário. Confira os limites da persistência na MDN ao acompanhar o exemplo. |
| [Como fazer um CRUD salvando no LocalStorage \| Notes App Completo com HTML, CSS e JavaScript](https://www.youtube.com/watch?v=NDRMfmj9ICk) — Code Crux | Português | Iniciante a intermediário | A descrição confirma criação, leitura, edição e exclusão de notas persistidas no localStorage. Use como exercício posterior para aplicar o mesmo ciclo aos produtos. |

A abertura direta dos vídeos falhou na ferramenta; títulos, autores e URLs foram conferidos pelos metadados do YouTube na busca, sem teste de reprodução.

## Roteiro de estudo

1. Leia a introdução da MDN e abra a prática por um servidor HTTP local. Identifique a origem e a seção de localStorage nas ferramentas de desenvolvimento do navegador.
2. Monte o array com os cinco produtos e seus preços numéricos. Grave-o em uma chave própria do exercício usando `setItem()` e `JSON.stringify()`. Observe o texto que foi armazenado.
3. Recupere essa chave com `getItem()`. Trate a ausência com um estado inicial; quando houver texto, use `JSON.parse()` dentro de um tratamento de erros e valide o formato antes de renderizar os produtos.
4. Altere um produto, salve e recarregue a página na mesma origem. Confirme que o valor restaurado continua numérico e que a interface usa os dados recuperados.
5. Remova apenas a chave do exercício com `removeItem()` e consulte-a novamente com `getItem()` para conferir o retorno `null`. Compare essa remoção com a documentação de `clear()` antes de usá-lo.
6. Coloque um JSON inválido na chave pelo painel do navegador e observe o tratamento do erro. Depois teste um JSON válido com formato inadequado, como `true`, para distinguir erro de sintaxe de validação dos dados.
7. Abra duas abas na mesma origem e acompanhe o evento `storage`. Grave em uma aba e observe a outra; confirme que a aba que gravou precisa atualizar sua própria interface pelo código da aplicação.

Os vídeos complementam a prática. A documentação serve como referência para conferir a semântica e as limitações da API.
