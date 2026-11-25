# Exercícios — localStorage

São seis exercícios progressivos e um desafio final. Eles vão de strings simples à leitura, validação e atualização de uma lista de produtos.

## Preparação e preservação dos dados

Abra a demonstração pelo endereço HTTP indicado no README e use o **Console** das ferramentas de desenvolvimento do navegador. Mantenha o mesmo protocolo, host e porta: a origem determina qual armazenamento será acessado. Não use `file://` como referência para estes testes.

**Recarregar a página não apaga o localStorage.** As soluções abaixo guardam o texto anterior e o restauram em `finally`. Se a chave não existia, a restauração remove apenas aquela chave. O backup é do texto bruto, sem interpretar JSON; assim, um conteúdo anterior corrompido também pode ser preservado.

Os primeiros exercícios usam chaves próprias, começando com `estudos:localstorage:exercicios:`. Quando um exercício usa os helpers da demonstração, ele também protege as chaves reais que vai alterar:

- `CHAVES.nome`: `estudos:localstorage:v1:nome`.
- `CHAVES.produtos`: `estudos:localstorage:v1:produtos`.

**Não use uma limpeza global do armazenamento.** A origem pode conter dados de outros projetos. Cada solução modifica e restaura apenas as chaves declaradas nela.

Copie cada bloco inteiro, incluindo as chaves `{ ... }`. As declarações ficam locais ao bloco, permitindo repetir os exemplos sem conflitos entre variáveis `const`. Os helpers são síncronos: não precisamos de `async` ou `await`.

As saídas esperadas pressupõem que o navegador permita ler e escrever nesse armazenamento. Os blocos incluem `try/catch` também para o acesso ao próprio `window.localStorage`. Se surgir uma mensagem de falha de armazenamento, o exercício não completou seu caminho normal; confira o nome do erro. Uma falha de restauração também precisa ser observada, não escondida.

As soluções não alteram a interface nem adicionam listeners. Escritas pelo Console não atualizam automaticamente a aba que as realizou. Conclua um exercício antes de iniciar outro; as alterações temporárias serão desfeitas por sua própria solução.

O array global `produtos` contém cinco itens com `id`, `nome` e `preco`. Os preços originais são `90`, `60`, `80`, `120` e `150`. Não presumimos moeda nem convertemos esses valores para centavos.

## 1. Básico — armazenar um número e recuperar texto

**Objetivo:** observar a conversão feita por `setItem()`.

1. Use uma chave exclusiva deste exercício.
2. Salve o número `90`.
3. Leia o valor e confira seu tipo.
4. Compare o valor lido com o número `90` e depois faça uma conversão explícita.
5. Restaure o valor anterior da chave em `finally`.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  const chave = 'estudos:localstorage:exercicios:01-texto';

  try {
    const armazenamento = window.localStorage;
    const anterior = armazenamento.getItem(chave);

    try {
      armazenamento.setItem(chave, 90);
      const lido = armazenamento.getItem(chave);

      console.log(lido); // 90, como texto.
      console.log(typeof lido); // string
      console.log(lido === 90); // false
      console.log(lido === '90'); // true
      console.log(Number(lido) === 90); // true
    } finally {
      if (anterior === null) armazenamento.removeItem(chave);
      else armazenamento.setItem(chave, anterior);
    }

    console.log(armazenamento.getItem(chave) === anterior); // true
  } catch (erro) {
    console.log('Falha de armazenamento:', erro.name);
  }
}
```

O valor passado a `setItem()` foi convertido para string. A aparência de `90` no Console não prova que ele continua sendo número; `typeof` mostra a diferença.

A comparação estrita distingue `'90'` de `90`. Se a aplicação precisa realizar cálculos, ela deve converter e validar o conteúdo lido conforme seu contrato.

O acesso a `window.localStorage` está dentro do `try` porque o próprio getter pode falhar em um ambiente com restrições.

</details>

## 2. Básico — salvar e interpretar o array de produtos

**Objetivo:** guardar texto JSON e reconstruir uma lista validada.

1. Converta `produtos` para texto com `JSON.stringify()`.
2. Salve esse texto em uma chave do exercício.
3. Leia, interprete com `JSON.parse()` e valide com `validarProdutos()`.
4. Confira quantidade, primeiro nome e preços.
5. Restaure o conteúdo anterior da chave.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  const chave = 'estudos:localstorage:exercicios:02-produtos';

  try {
    const armazenamento = window.localStorage;
    const anterior = armazenamento.getItem(chave);

    try {
      armazenamento.setItem(chave, JSON.stringify(produtos));
      const texto = armazenamento.getItem(chave);
      const lista = validarProdutos(JSON.parse(texto));

      console.log(typeof texto); // string
      console.log(Array.isArray(lista)); // true
      console.log(lista.length); // 5
      console.log(lista[0].nome); // Produto 1
      console.log(lista.map((produto) => produto.preco).join(' | '));
      // 90 | 60 | 80 | 120 | 150
      console.log(lista === produtos); // false
      console.log(produtos.length); // 5
    } finally {
      if (anterior === null) armazenamento.removeItem(chave);
      else armazenamento.setItem(chave, anterior);
    }

    console.log(armazenamento.getItem(chave) === anterior); // true
  } catch (erro) {
    console.log('Falha no exercício:', erro.name);
  }
}
```

`JSON.stringify()` e `JSON.parse()` pertencem ao objeto `JSON`, não ao `localStorage`. O armazenamento guarda o texto; a interpretação reconstrói os valores JavaScript.

A lista reconstruída não tem a mesma referência do array original, por isso a comparação resulta em `false`. Nenhum produto original foi modificado.

`validarProdutos()` verifica mais que a existência de um array: exige objetos com IDs inteiros positivos e únicos, nomes não vazios e preços numéricos finitos maiores ou iguais a zero.

</details>

## 3. Intermediário — ausência, string vazia e JSON null

**Objetivo:** perceber três estados diferentes de uma chave.

1. Remova a chave do exercício e confira o retorno da leitura.
2. Grave `''` e confirme que a chave existe com texto vazio.
3. Grave o texto `'null'` e compare o valor bruto com o resultado de `JSON.parse()`.
4. Restaure o estado anterior.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  const chave = 'estudos:localstorage:exercicios:03-ausencia';

  try {
    const armazenamento = window.localStorage;
    const anterior = armazenamento.getItem(chave);

    try {
      armazenamento.removeItem(chave);
      const ausente = armazenamento.getItem(chave);
      console.log(ausente === null); // true
      console.log(ausente === undefined); // false

      armazenamento.setItem(chave, '');
      const vazio = armazenamento.getItem(chave);
      console.log(vazio === ''); // true
      console.log(vazio === null); // false

      armazenamento.setItem(chave, 'null');
      const textoNull = armazenamento.getItem(chave);
      console.log(textoNull === 'null'); // true
      console.log(textoNull === null); // false
      console.log(JSON.parse(textoNull) === null); // true
    } finally {
      if (anterior === null) armazenamento.removeItem(chave);
      else armazenamento.setItem(chave, anterior);
    }

    console.log(armazenamento.getItem(chave) === anterior); // true
  } catch (erro) {
    console.log('Falha no exercício:', erro.name);
  }
}
```

`getItem()` retorna `null` quando a chave está ausente. Isso é diferente de encontrar uma chave com string vazia ou com o texto `'null'`.

O JSON `'null'` é válido e sua interpretação produz `null`. Porém, a chave continuava presente: vimos isso antes de interpretar o texto.

Verifique a ausência com `texto === null` antes de chamar o parser. Não use apenas `if (!texto)`, pois esse teste também considera a string vazia como falsa e mistura situações distintas.

No contrato dos produtos, um `null` interpretado não representa um array válido. Por isso `lerProdutos()` distingue chave ausente de JSON incompatível, como veremos no exercício 5.

</details>

## 4. Intermediário — remover dados sem atingir outras chaves

**Objetivo:** conferir o alcance da limpeza feita pela demonstração.

1. Guarde os textos anteriores das duas chaves da aula e de uma chave de controle.
2. Salve um nome, um produto e o texto `'preservar'` na chave de controle.
3. Remova apenas o nome e confira que o produto continua salvo.
4. Execute `limparDadosDaAula()` e confira que a chave de controle continua intacta.
5. Restaure todos os textos anteriores, mesmo que não fossem JSON válido.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  const chaveControle = 'estudos:localstorage:exercicios:04-controle';

  try {
    const armazenamento = window.localStorage;
    const chaves = [CHAVES.nome, CHAVES.produtos, chaveControle];
    const anteriores = chaves.map((chave) => [chave, armazenamento.getItem(chave)]);

    try {
      salvarNome('Ana');
      salvarProdutos([produtos[0]]);
      armazenamento.setItem(chaveControle, 'preservar');

      removerNome();
      console.log(lerNome() === null); // true
      console.log(lerProdutos().length); // 1

      limparDadosDaAula();
      console.log(lerNome() === null); // true
      console.log(lerProdutos() === null); // true
      console.log(armazenamento.getItem(chaveControle)); // preservar
    } finally {
      for (const [chave, anterior] of anteriores) {
        try {
          if (anterior === null) armazenamento.removeItem(chave);
          else armazenamento.setItem(chave, anterior);
        } catch (erro) {
          console.log('Falha ao restaurar:', chave, erro.name);
        }
      }
    }

    console.log(anteriores.every(([chave, anterior]) => {
      return armazenamento.getItem(chave) === anterior;
    })); // true
  } catch (erro) {
    console.log('Falha no exercício:', erro.name);
  }
}
```

`removerNome()` usa apenas a chave do nome. `limparDadosDaAula()` remove somente as chaves `CHAVES.nome` e `CHAVES.produtos`, preservando a chave de controle e quaisquer outras chaves da origem.

Não convertemos o backup para objetos. Restaurar o texto bruto preserva exatamente o valor anterior, inclusive quando ele estava corrompido.

A restauração tenta cada chave separadamente: uma falha em uma delas é registrada sem impedir a tentativa das demais. A última conferência deve ser `true` quando todas foram restauradas.

</details>

## 5. Avançado neste tema — distinguir JSON quebrado de formato inválido

**Objetivo:** identificar a etapa da leitura que falhou, preservando o texto para diagnóstico.

1. Faça backup bruto da chave real de produtos.
2. Teste um texto que não é JSON válido.
3. Teste JSON válido que representa um objeto, em vez de um array de produtos.
4. Teste o texto JSON `'null'`.
5. Confira que `lerProdutos()` não apaga esses valores automaticamente e restaure o conteúdo anterior ao final.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  try {
    const armazenamento = window.localStorage;
    const anterior = armazenamento.getItem(CHAVES.produtos);

    try {
      const casos = [
        { nome: 'JSON quebrado', texto: '{"id":' },
        { nome: 'Formato errado', texto: '{"id":1}' },
        { nome: 'Null em JSON', texto: 'null' }
      ];

      for (const caso of casos) {
        armazenamento.setItem(CHAVES.produtos, caso.texto);

        try {
          lerProdutos();
          console.log('Inesperado: o conteúdo foi aceito.');
        } catch (erro) {
          console.log(`${caso.nome}: ${erro.name}`);
        }

        console.log(armazenamento.getItem(CHAVES.produtos) === caso.texto);
        // true, para cada caso: o leitor não apagou nem substituiu o texto.
      }
    } finally {
      if (anterior === null) armazenamento.removeItem(CHAVES.produtos);
      else armazenamento.setItem(CHAVES.produtos, anterior);
    }

    console.log(armazenamento.getItem(CHAVES.produtos) === anterior); // true
  } catch (erro) {
    console.log('Falha de armazenamento:', erro.name);
  }
}
```

As mensagens dos três casos, cada uma seguida por `true`, serão:

- `JSON quebrado: SyntaxError`.
- `Formato errado: DadosInvalidosError`.
- `Null em JSON: DadosInvalidosError`.

No primeiro caso, o parser falha. Nos outros dois, o JSON pode ser interpretado, mas o resultado não atende ao contrato da aplicação.

`DadosInvalidosError` é o nome atribuído pelo validador da demonstração a um objeto `Error`; não é uma classe nativa do JavaScript.

Preservar um dado inválido não significa utilizá-lo como se estivesse correto. A leitura falha explicitamente, permitindo informar o problema e deixar a substituição ou remoção como uma ação consciente.

</details>

## 6. Avançado neste tema — simular quota e bloqueio sem encher o armazenamento

**Objetivo:** incluir no tratamento tanto o acesso ao armazenamento quanto a escrita.

Crie uma função de teste que receba um ambiente com propriedade `localStorage`. Depois forneça dois ambientes simulados:

1. Um armazenamento cujo `setItem()` lança `QuotaExceededError`.
2. Um ambiente cujo próprio getter `localStorage` lança `SecurityError`.

Não escreva dados no armazenamento real neste exercício.

<details>
<summary>Ver solução, resultados e explicação</summary>

```js
{
  function salvarComProtecao(ambiente, chave, valor) {
    try {
      const armazenamento = ambiente.localStorage;
      armazenamento.setItem(chave, valor);
      return true;
    } catch (erro) {
      console.log(erro.name);
      return false;
    }
  }

  const ambienteSemQuota = {
    localStorage: {
      setItem() {
        throw new DOMException('Quota simulada atingida.', 'QuotaExceededError');
      }
    }
  };

  const ambienteBloqueado = {
    get localStorage() {
      throw new DOMException('Acesso simulado bloqueado.', 'SecurityError');
    }
  };

  const chave = 'estudos:localstorage:exercicios:06-simulacao';

  console.log(salvarComProtecao(ambienteSemQuota, chave, 'Teste'));
  // QuotaExceededError
  // false

  console.log(salvarComProtecao(ambienteBloqueado, chave, 'Teste'));
  // SecurityError
  // false
}
```

Os objetos simulados provocam os dois caminhos de erro de maneira controlada. Nenhuma quota real foi consumida e nenhuma chave real foi criada.

O acesso a `ambiente.localStorage` acontece dentro do `try`. Se ele estivesse fora, a falha do getter não seria capturada por esse bloco.

`get localStorage()` define uma propriedade com getter, isto é, uma função executada ao ler a propriedade. Essa construção permite reproduzir a situação em que o acesso ao armazenamento já é negado antes de qualquer chamada a `setItem()`.

Retornar `false` é uma decisão deste helper de teste para indicar falha. Ele não deve ser confundido com o retorno padrão de `setItem()`.

</details>

## Desafio final — adicionar um produto sem duplicar seu ID

**Objetivo:** combinar leitura, validação e escrita sem destruir um estado existente ao encontrar um erro.

Crie `adicionarProdutoSalvo(novoProduto)` seguindo estas regras:

1. Valide o produto recebido.
2. Leia a lista usando `lerProdutos()`; somente chave ausente representa uma lista inicial vazia.
3. Se o ID já estiver salvo, devolva a lista sem acrescentar uma duplicata nem substituir o item existente.
4. Caso contrário, produza uma nova lista, salve-a e retorne o resultado.
5. Preserve erros de leitura ou validação. Não trate JSON corrompido como se fosse uma lista vazia.

Teste a adição de `produtos[0]`, a repetição do mesmo ID, a adição de `produtos[1]` e uma tentativa com preço negativo. Faça backup bruto da chave real e restaure-o em `finally`.

<details>
<summary>Ver uma solução completa e explicada</summary>

```js
{
  function adicionarProdutoSalvo(novoProduto) {
    validarProdutos([novoProduto]);

    const lidos = lerProdutos();
    const atuais = lidos === null ? [] : lidos;

    if (atuais.some((produto) => produto.id === novoProduto.id)) {
      return atuais;
    }

    const atualizados = [...atuais, novoProduto];
    salvarProdutos(atualizados);
    return atualizados;
  }

  try {
    const armazenamento = window.localStorage;
    const anterior = armazenamento.getItem(CHAVES.produtos);

    try {
      removerProdutos();
      console.log(lerProdutos() === null); // true

      console.log(adicionarProdutoSalvo(produtos[0]).length); // 1
      console.log(adicionarProdutoSalvo(produtos[0]).length); // 1
      console.log(adicionarProdutoSalvo(produtos[1]).length); // 2
      console.log(lerProdutos().map((produto) => produto.id).join(',')); // 1,2

      const antesDaFalha = armazenamento.getItem(CHAVES.produtos);

      try {
        adicionarProdutoSalvo({ ...produtos[0], preco: -1 });
      } catch (erro) {
        console.log(erro.name); // DadosInvalidosError
      }

      console.log(armazenamento.getItem(CHAVES.produtos) === antesDaFalha); // true

      const corrompido = '{"produtos":';
      armazenamento.setItem(CHAVES.produtos, corrompido);

      try {
        adicionarProdutoSalvo(produtos[0]);
      } catch (erro) {
        console.log(erro.name); // SyntaxError
      }

      console.log(armazenamento.getItem(CHAVES.produtos) === corrompido); // true
    } finally {
      if (anterior === null) armazenamento.removeItem(CHAVES.produtos);
      else armazenamento.setItem(CHAVES.produtos, anterior);
    }

    console.log(armazenamento.getItem(CHAVES.produtos) === anterior); // true
  } catch (erro) {
    console.log('Falha no exercício:', erro.name);
  }
}
```

Validamos o produto novo antes de consultar IDs existentes. Assim, até uma tentativa com ID repetido precisa conter dados válidos; um preço negativo não é ignorado silenciosamente.

`some()` verifica se já existe um produto com o mesmo ID. A regra escolhida é manter o item existente. Repetir a mesma adição não aumenta a quantidade nem muda o produto armazenado.

`[...atuais, novoProduto]` cria um novo array. Não alteramos o array global `produtos` nem seus objetos para montar o teste com preço negativo: nesse caso, criamos outro objeto com `...produtos[0]`.

Se a leitura encontra JSON corrompido, `lerProdutos()` lança um erro e a escrita não acontece. Essa diferença impede que um problema de leitura se transforme em perda silenciosa de dados.

A função não captura erros porque seu chamador precisa decidir como apresentá-los. Os `try/catch` do teste capturam as falhas planejadas, enquanto o `finally` restaura o texto que existia antes de toda a prática.

Este exemplo executa uma operação de leitura e escrita por vez. Ele não fornece uma transação entre abas: se duas abas atualizarem a mesma chave simultaneamente, uma gravação poderá substituir a outra. O evento `storage` ajuda a observar alterações, mas não resolve esse conflito automaticamente.

</details>
