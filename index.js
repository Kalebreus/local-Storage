const campoNome = document.getElementById('nome');
const nomeAtual = document.getElementById('nome-atual');
const estadoNome = document.getElementById('estado-nome');
const catalogo = document.getElementById('catalogo');
const listaSalvos = document.getElementById('produtos-salvos');
const estadoProdutos = document.getElementById('estado-produtos');
const jsonProdutos = document.getElementById('json-produtos');

function informarErro(elemento, acao, erro) {
  let detalhe = erro.message;
  if (erro.name === 'SyntaxError') detalhe = 'O texto salvo não é JSON válido. O conteúdo foi preservado para inspeção ou remoção explícita.';
  if (erro.name === 'DadosInvalidosError') detalhe = 'O JSON não tem o formato de produtos esperado. O conteúdo foi preservado.';
  if (erro.name === 'SecurityError') detalhe = 'O navegador bloqueou o acesso ao armazenamento.';
  if (erro.name === 'QuotaExceededError') detalhe = 'O armazenamento não aceitou a gravação por limite de espaço ou restrição do navegador.';
  elemento.dataset.estado = 'error';
  elemento.textContent = acao + ': ' + erro.name + ' — ' + detalhe;
}

function restaurarNome() {
  try {
    const valor = lerNome();
    campoNome.value = valor === null ? '' : valor;
    nomeAtual.textContent = valor === null ? '(chave ausente)' : (valor === '' ? '(string vazia salva)' : valor);
    estadoNome.dataset.estado = valor === null ? 'idle' : 'success';
    estadoNome.textContent = valor === null ? 'getItem retornou null: nenhum nome salvo.' : 'String recuperada do localStorage.';
  } catch (erro) {
    nomeAtual.textContent = 'Leitura indisponível.';
    informarErro(estadoNome, 'Não foi possível ler o nome', erro);
  }
}

function marcarSelecao(lista) {
  catalogo.querySelectorAll('input').forEach(function (campo) {
    campo.checked = lista.some(function (produto) { return produto.id === Number(campo.value); });
  });
}

function exibirProdutos(lista) {
  const fragmento = document.createDocumentFragment();
  lista.forEach(function (produto) {
    const item = document.createElement('li');
    item.textContent = produto.nome + ' — preço: ' + produto.preco;
    fragmento.append(item);
  });
  listaSalvos.replaceChildren(fragmento);
}

function restaurarProdutos() {
  try {
    const lista = lerProdutos();
    exibirProdutos(lista === null ? [] : lista);
    marcarSelecao(lista === null ? [] : lista);
    estadoProdutos.dataset.estado = lista === null ? 'idle' : 'success';
    estadoProdutos.textContent = lista === null
      ? 'Chave de produtos ausente: getItem retornou null.'
      : 'Quantidade de produtos recuperados: ' + lista.length + '. A chave existe.';
    jsonProdutos.textContent = lista === null ? 'Chave ausente.' : JSON.stringify(lista, null, 2);
  } catch (erro) {
    exibirProdutos([]);
    jsonProdutos.textContent = 'Dados não exibidos devido à falha de leitura.';
    informarErro(estadoProdutos, 'Não foi possível recuperar os produtos', erro);
  }
}

// O catálogo vem do array original, independentemente dos dados armazenados.
produtos.forEach(function (produto) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = String(produto.id);
  label.append(checkbox, document.createTextNode(produto.nome + ' — preço: ' + produto.preco));
  item.append(label);
  catalogo.append(item);
});

document.getElementById('salvar-nome').addEventListener('click', function () {
  try {
    salvarNome(campoNome.value);
    restaurarNome(); // Atualização local: storage não dispara na aba escritora.
  } catch (erro) {
    informarErro(estadoNome, 'Não foi possível salvar o nome', erro);
  }
});
document.getElementById('ler-nome').addEventListener('click', restaurarNome);
document.getElementById('remover-nome').addEventListener('click', function () {
  try { removerNome(); restaurarNome(); }
  catch (erro) { informarErro(estadoNome, 'Não foi possível remover o nome', erro); }
});

document.getElementById('selecionar-todos').addEventListener('click', function () {
  catalogo.querySelectorAll('input').forEach(function (campo) { campo.checked = true; });
});
document.getElementById('desmarcar-todos').addEventListener('click', function () {
  catalogo.querySelectorAll('input').forEach(function (campo) { campo.checked = false; });
});
document.getElementById('salvar-produtos').addEventListener('click', function () {
  try {
    const ids = Array.from(catalogo.querySelectorAll('input:checked'), function (campo) { return Number(campo.value); });
    const selecao = produtos.filter(function (produto) { return ids.includes(produto.id); });
    salvarProdutos(selecao);
    restaurarProdutos();
  } catch (erro) {
    informarErro(estadoProdutos, 'Não foi possível salvar os produtos', erro);
  }
});
document.getElementById('ler-produtos').addEventListener('click', restaurarProdutos);
document.getElementById('remover-produtos').addEventListener('click', function () {
  try { removerProdutos(); restaurarProdutos(); }
  catch (erro) { informarErro(estadoProdutos, 'Não foi possível remover os produtos', erro); }
});

document.getElementById('limpar-aula').addEventListener('click', function () {
  const estado = document.getElementById('estado-limpeza');
  try {
    limparDadosDaAula();
    restaurarNome();
    restaurarProdutos();
    estado.dataset.estado = 'success';
    estado.textContent = 'As duas chaves da aula foram removidas.';
  } catch (erro) {
    informarErro(estado, 'Não foi possível concluir a remoção', erro);
  }
});

window.addEventListener('storage', function (evento) {
  try {
    if (evento.storageArea !== window.localStorage) return;
    if (evento.key !== null && evento.key !== CHAVES.nome && evento.key !== CHAVES.produtos) return;
    if (evento.key === null || evento.key === CHAVES.nome) restaurarNome();
    if (evento.key === null || evento.key === CHAVES.produtos) restaurarProdutos();
    document.getElementById('sincronizacao').textContent = 'Evento storage recebido de outro documento da mesma origem.';
  } catch (erro) {
    informarErro(document.getElementById('sincronizacao'), 'Falha ao sincronizar', erro);
  }
});

document.getElementById('origem-atual').textContent = location.origin;
document.getElementById('aviso-http').hidden = location.protocol !== 'file:';
restaurarNome();
restaurarProdutos();
