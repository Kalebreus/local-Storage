// Prefixos distinguem estas chaves das usadas por outros projetos na mesma origem.
const CHAVES = {
  nome: 'estudos:localstorage:v1:nome',
  produtos: 'estudos:localstorage:v1:produtos'
};

// Operações síncronas. O próprio acesso a window.localStorage pode lançar erro;
// a interface chama estes helpers dentro de try/catch.
function salvarNome(nome) {
  window.localStorage.setItem(CHAVES.nome, nome);
}

function lerNome() {
  return window.localStorage.getItem(CHAVES.nome);
}

function removerNome() {
  window.localStorage.removeItem(CHAVES.nome);
}

// JSON válido não garante que o valor tenha a estrutura exigida pela aplicação.
function validarProdutos(valor) {
  const itensValidos = Array.isArray(valor) && Array.from(valor).every(function (produto) {
    return produto !== null && typeof produto === 'object' && !Array.isArray(produto) &&
      Number.isInteger(produto.id) && produto.id > 0 &&
      typeof produto.nome === 'string' && produto.nome.trim() !== '' &&
      typeof produto.preco === 'number' && Number.isFinite(produto.preco) && produto.preco >= 0;
  });
  const idsUnicos = itensValidos && new Set(valor.map(function (produto) {
    return produto.id;
  })).size === valor.length;

  if (!itensValidos || !idsUnicos) {
    const erro = new Error('Esperado um array de produtos com IDs positivos únicos, nomes e preços numéricos não negativos.');
    erro.name = 'DadosInvalidosError';
    throw erro;
  }
  return valor;
}

function salvarProdutos(lista) {
  validarProdutos(lista);
  const texto = JSON.stringify(lista);
  window.localStorage.setItem(CHAVES.produtos, texto);
  return texto;
}

function lerProdutos() {
  const texto = window.localStorage.getItem(CHAVES.produtos);
  if (texto === null) return null; // Ausência da chave, antes de tentar interpretar.
  const valor = JSON.parse(texto);
  return validarProdutos(valor);
}

function removerProdutos() {
  window.localStorage.removeItem(CHAVES.produtos);
}

function limparDadosDaAula() {
  // Apenas as duas chaves da demonstração, preservando outras chaves da origem.
  removerNome();
  removerProdutos();
}
