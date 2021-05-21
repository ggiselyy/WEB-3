const PostagemModel = require("../models/Postagem");

module.exports = {
  salvarPostagens: async function(req, res) {
    const novaPostagem = {
      titulo: req.fields.titulo,
      conteudo: req.files.conteudo.path.split("/")[2]
    };
    const postagem = await PostagemModel.persistir(novaPostagem);

    res.redirect("/");
  },
  listarPostagens: async function(req, res) {
    const postagens = await PostagemModel.carregarTodas();
    res.render("index", postagens);
  },
  listarTodasPostagens: async function() {
    const postagens = await PostagemModel.carregarTodas();
    return postagens;
  },
  buscarPostagens: async function(titulo) {
    const postagens = await PostagemModel.buscar(titulo);
    return postagens;
  }
};