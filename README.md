# O que é o localStorage?

Esta aula independente ensina a salvar informações no navegador, recuperá-las após recarregar a página e tratar problemas de leitura ou gravação. Começamos com uma string e avançamos para um array de produtos, JSON e alterações entre abas.

O projeto usa HTML, CSS e JavaScript, sem pacotes ou API externa. A prática está em [EXERCICIOS.md](./EXERCICIOS.md), com seis exercícios e um desafio final resolvidos. A [lista de recursos](./RECURSOS.md) reúne documentação, sites e canais reais.

## 1. Entender o armazenamento

`localStorage` é uma área de armazenamento do navegador organizada em pares de **chave e valor**. Ambos são strings. A chave identifica uma informação; gravar novamente na mesma chave substitui o valor anterior.

Os dados não têm expiração automática e podem continuar disponíveis entre sessões. Isso **não garante permanência**: o usuário pode limpar o armazenamento, o navegador pode impor restrições e a navegação privada limita a persistência. Não o trate como backup ou como banco compartilhado entre dispositivos.

As operações são **síncronas**: não precisam de `await`. Leitura, gravação e conversão de dados grandes podem ocupar a execução da página; mantenha os exemplos pequenos.

Não guarde senhas ou segredos no `localStorage`. Scripts executados na mesma origem podem acessar seus dados.

## 2. Executar sempre na mesma origem

Tenha Python 3 e um navegador atual. No terminal, entre na pasta de `index.html` e execute:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Se o Python 3 estiver instalado como `python`, use:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Abra **http://127.0.0.1:8000**. Mantenha o terminal aberto e use `Ctrl+C` para encerrar o servidor. Ele apenas entrega os arquivos estáticos; a persistência acontece no navegador.

**Use HTTP e mantenha esse mesmo endereço nas tentativas.** O comportamento de `localStorage` em `file://` é indefinido e varia entre navegadores. A página mostra sua origem para facilitar a conferência.

Uma origem é definida por **protocolo + host + porta**, sem considerar o caminho:

| Comparação | Compartilham a área? |
| --- | --- |
| `http://127.0.0.1:8000/a` e `http://127.0.0.1:8000/b` | Sim: o caminho não separa o armazenamento. |
| `http://127.0.0.1:8000` e `http://localhost:8000` | Não: hosts diferentes. |
| `http://127.0.0.1:8000` e `http://127.0.0.1:8001` | Não: portas diferentes. |
| HTTP e HTTPS no mesmo host e porta | Não: protocolos diferentes. |

Outro perfil ou navegador também tem seu próprio armazenamento. Trocar o endereço pode parecer perda de dados quando você apenas passou a consultar outra área.

## 3. Começar com uma string

Na interface, escreva um nome, clique em **“Salvar nome”** e recarregue. A leitura inicial recupera o texto. Experimente salvar o campo vazio e depois remover o nome: a página distingue uma string vazia de uma chave ausente.

Os métodos básicos são:

| Método | Função |
| --- | --- |
| `setItem(chave, valor)` | Grava ou substitui uma string. |
| `getItem(chave)` | Retorna a string armazenada ou `null` quando a chave não existe. |
| `removeItem(chave)` | Remove somente a chave indicada. |
| `clear()` | Remove todas as chaves dessa área de `localStorage` da origem. |

O retorno de uma chave ausente é **`null`, não `undefined`**. A demonstração não executa `clear()`: seu botão de limpeza remove apenas as duas chaves da aula, preservando outras funcionalidades que compartilhem a origem.

Abra o Console das ferramentas de desenvolvimento, normalmente com `F12`, e copie este bloco inteiro:

```js
{
  const chave = 'estudos:localstorage:exemplo:nome:' + crypto.randomUUID();

  try {
    window.localStorage.setItem(chave, 'Ana');
    console.log(window.localStorage.getItem(chave)); // Ana

    window.localStorage.removeItem(chave);
    console.log(window.localStorage.getItem(chave)); // null
  } catch (erro) {
    console.error(erro.name, erro.message);
  } finally {
    try {
      window.localStorage.removeItem(chave);
    } catch (erro) {
      console.warn('Não foi possível remover a chave do exemplo:', erro.name);
    }
  }
}
```

O sufixo gerado por `crypto.randomUUID()` cria uma chave própria para essa execução. A limpeza alcança somente essa chave, inclusive se uma etapa falhar. As chaves externas separam as declarações das de outros experimentos.

## 4. Separar os dados da aula

Em `armazenamento.js`, `CHAVES` define:

- Nome: `estudos:localstorage:v1:nome`.
- Produtos: `estudos:localstorage:v1:produtos`.

O prefixo identifica o estudo; `v1` explicita a versão do formato. Essa organização evita nomes genéricos como `dados`, mas não cria outra origem ou uma barreira de acesso.

**Recarregar a página não limpa o localStorage.** Use os botões de remoção quando quiser redefinir seus dados. Para experimentos no Console, use chaves próprias como as dos exemplos, sem sobrescrever `CHAVES`. Se alterar uma chave da demonstração manualmente, copie seu valor anterior e restaure-o ao terminar.

## 5. Guardar arrays com JSON

O array original de `produtos.js` foi preservado:

| ID | Nome | Preço informado |
| --- | --- | --- |
| 1 | Produto 1 | 90 |
| 2 | Produto 2 | 60 |
| 3 | Produto 3 | 80 |
| 4 | Produto 4 | 120 |
| 5 | Produto 5 | 150 |

São valores numéricos sem moeda ou unidade especificada. A página não presume reais, centavos ou conversão.

Para salvar o array, transformamos dados compatíveis em texto JSON. Entre os métodos mais usados do objeto `JSON` estão:

- `JSON.stringify(valor)`: produz uma representação JSON em texto, quando aplicável.
- `JSON.parse(texto)`: interpreta texto JSON válido e produz o valor JavaScript correspondente.

`parse()` pode produzir arrays, objetos, strings, números, booleanos ou `null`; não serve apenas para objetos. Também não garante que o valor tenha o formato esperado pela aplicação.

```js
{
  const chave = 'estudos:localstorage:exemplo:produtos:' + crypto.randomUUID();

  try {
    const selecao = produtos.slice(0, 2);
    window.localStorage.setItem(chave, JSON.stringify(selecao));

    const texto = window.localStorage.getItem(chave);
    if (texto !== null) {
      const recuperados = validarProdutos(JSON.parse(texto));
      console.log(Array.isArray(recuperados)); // true
      console.log(recuperados[0].nome); // Produto 1
      console.log(recuperados[0].preco); // 90
      console.log(typeof recuperados[0].preco); // number
    }
  } catch (erro) {
    console.error(erro.name, erro.message);
  } finally {
    try {
      window.localStorage.removeItem(chave);
    } catch (erro) {
      console.warn('Não foi possível remover a chave do exemplo:', erro.name);
    }
  }
}
```

O array recuperado é reconstruído a partir do texto; não é a mesma referência do original. Esse processo **não é uma clonagem universal**: `undefined` não é um valor JSON, datas normalmente viram strings e outras estruturas têm limitações. Use-o para o formato simples desta aula.

## 6. Distinguir ausência, JSON null e lista vazia

Antes de analisar o texto, confira a ausência da chave. Observe as diferenças:

| Situação | Retorno de `getItem()` | Consequência para produtos |
| --- | --- | --- |
| Chave ausente | `null`, valor JavaScript | O helper retorna `null`, sem chamar `parse()`. |
| Texto armazenado `null` | `'null'`, uma string | `parse()` produz `null`; a validação rejeita. |
| Texto armazenado `[]` | `'[]'`, uma string | `parse()` produz um array vazio válido. |
| String vazia armazenada | `''` | Não é JSON válido; `parse()` lança `SyntaxError`. |

Para o nome, uma string vazia é um valor permitido e aparece como **“string vazia salva”**. Para os produtos, desmarcar todos e salvar grava `[]`: a chave continua existindo, com zero itens. Remover produtos elimina a chave.

## 7. Validar e tratar erros

`salvarProdutos(lista)` valida antes de serializar e gravar. `lerProdutos()` consulta a chave, trata a ausência, interpreta o JSON e valida novamente. A validação exige um array com:

- Objetos com IDs inteiros positivos, sem repetição.
- Nomes em strings não vazias.
- Preços numéricos finitos e não negativos.

O catálogo mostra os cinco itens originais, independentemente do conteúdo salvo. A seleção é extraída desse catálogo; as leituras passam pelas regras de formato antes da exibição.

| Falha | Significado neste projeto |
| --- | --- |
| `SyntaxError` | O texto não pôde ser interpretado como JSON. |
| `DadosInvalidosError` | O JSON foi interpretado, mas não é uma lista de produtos válida. É um nome atribuído ao objeto de erro. |
| `SecurityError` | O navegador bloqueou o acesso ao armazenamento. |
| `QuotaExceededError` | A gravação não foi aceita por limite ou restrição do navegador. |

O próprio acesso a `window.localStorage` pode lançar erro, não apenas `setItem()`. Por isso, a interface chama os helpers dentro de `try/catch`. Não há uma quantidade fixa de bytes garantida para todos os navegadores e contextos.

Se encontrar JSON corrompido ou formato inadequado, a página apresenta a falha **sem apagar o conteúdo automaticamente**. Você decide entre inspecioná-lo, salvar outra seleção para substituir o valor ou remover a chave pelo botão correspondente. Recarregar não corrige nem apaga esse texto.

## 8. Acompanhar alterações entre abas

Abra uma segunda aba em **http://127.0.0.1:8000**. Salve um nome diferente na primeira e observe a atualização na segunda. Depois altere a seleção de produtos ou remova uma chave.

O evento `storage` informa a alteração a outros documentos da mesma origem; **não dispara na aba que fez a gravação**. Por isso, após salvar ou remover, a própria aba chama suas funções de restauração diretamente.

O listener de `index.js` filtra a área de armazenamento e as duas chaves da aula. Ao receber uma mudança relevante, relê os valores e atualiza a tela, sem escrever de volta. Quando a origem recebe uma limpeza global externa, o evento pode ter `key === null`, e o listener relê ambas as chaves. A demonstração não realiza essa limpeza global.

Gravar o mesmo valor novamente pode não produzir um novo evento. Faça uma alteração efetiva para observar o aviso. O evento também não resolve concorrência: duas abas podem ler um valor antigo e uma gravação posterior sobrescrever a anterior. Nesta prática, a última gravação determina o texto armazenado.

## 9. Praticar e avançar

Os [exercícios com soluções](./EXERCICIOS.md) avançam de strings para JSON, validação e tratamento de falhas. Use as chaves próprias e os procedimentos de preservação indicados: atualizar a página não equivale a reiniciar o armazenamento.

Consulte [RECURSOS.md](./RECURSOS.md) para a documentação e as aulas de Edu Pretel Desenvolvimento e Code Crux. Como apoio opcional, desenhe no Excalidraw o caminho “array → texto JSON → armazenamento → texto → array validado”. Se usar IA, peça que explique por que `getItem()` retorna `null` para ausência, mas pode devolver a string `'null'`. Confira a explicação no navegador e nas fontes.

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `produtos.js` | Array original dos cinco produtos. |
| `armazenamento.js` | Chaves, leitura, gravação, validação e remoção. |
| `index.js` | Controles, restauração da tela, erros e evento `storage`. |
| `index.html` e `styles.css` | Estrutura e apresentação da página. |
| `EXERCICIOS.md` e `RECURSOS.md` | Prática resolvida e fontes para continuar estudando. |

O HTML carrega os scripts nessa ordem com `defer`: `produtos.js`, `armazenamento.js` e `index.js`. Não há `fetch()` na demonstração; o servidor HTTP estabelece uma origem estável para a prática.

## Verificação do material

A página foi conferida no Chromium com persistência após recarregar e após fechar e reabrir um perfil de teste do navegador. Também foram verificados atualização entre duas abas, ausência do evento `storage` na aba escritora, isolamento entre portas diferentes e remoção restrita às duas chaves da aula.

Os testes incluíram JSON corrompido, dados fora do formato esperado e falhas controladas de quota e acesso, sem encher a quota real. As sete soluções dos exercícios foram executadas e preservaram os dados que existiam antes delas.
