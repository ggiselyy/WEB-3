//carregando modulos
const express = require("express"); //copia do framework - tudo que for do express esta aqui
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

require("dotenv").config();

//chamando o banco
require("./models/Usuarios.js");
require("./models/Postagem.js");
const Usuarios = mongoose.model("usuarios"); //tabela usuarios
const Postagem = mongoose.model("postagens"); //tabela postagem

//body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// Handlebars
app.engine("handlebars", handlebars({ defaultLayout: false }));
app.set("view engine", "handlebars");

// Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/cadastro")
  .then(() => {
    console.log("MongoDB conectado");
  })
  .catch(err => {
    console.log("Houve um erro ao se conectar ao mongoDB: " + err);
  });

  // Postagens Controller
const PostagensController = require("./controllers/Postagem");

// Public -- arquivos de img e css
app.use(express.static(path.join(__dirname, "public")));

// Inicializa o express-session para que possamos identificar os usuários logados.
app.use(
    session({
      key: "user_sid",
      secret: "WebProject",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 600000 //10min
      }
    })
  );

  // Esse middleware vai checar se o cookie do usuário ainda está salvo no navegador e o usuário não está no server, então iremos deslogar ele.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie("user_sid");
    }
    next();
  });

  // Função que checa os usuários logados
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/index");
    } else {
      next();
    }
  };

// Rota principal - Main route
// Verifica se o usuário está logado, se estiver redireciona para o dashboard ao invés da página inicial
app.get("/", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/index");
    } else {
      res.sendFile(__dirname + "/views/index.html");
    }
  });

  // Rota principal quando logado - Main route when loggedin
app.get("/index", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      // carregar as postagens
      PostagensController.listarPostagens(req, res);
    } else {
      res.redirect("/login");
    }
  });
// Rota de cadastro
app.route("/signup").get(sessionChecker, (req, res) => {
  res.sendFile(__dirname + "/views/signup.html");
});



  //Rota de busca - Search route
  app.get("/buscar", async (req, res) => {
    let postagens = await PostagensController.buscarPostagens(req.query.searchTerm);
  
    if (req.query.searchTerm === "") {
      postagens = await PostagensController.listarTodasPostagens();
    }
  
    res.send(postagens);
  });

  // Rota para postar novas postagens
app.get("/nova", (req, res) => {
    res.render("salvar");
  });
  
  // Rota que salva postagens
  app.post("/postagens", (req, res) => {
    PostagensController.salvarPostagens(req, res);
  });

  ////////////////
app.post("/signIn", function(req, res) {
    // Verifica se algum dos parametros vindos da requisição é null, undefined ou vazio
    if (!req.body.password || !req.body.email) {
      res.send({ status: 0, msg: "Algo deu errado" });
    } else {
      // Busca pelo email digitado no banco
      Usuarios.where({ email: req.body.email }).findOne(function(err, user) {
        // Caso o usuário exista
        if (user) {
            if (err) {
              res.send({ status: 0, msg: "Algo deu errado" });
            }
              req.session.user = user;
              console.log("Login realizado com sucesso!");
              res.send({ status: 1, msg: "Login realizado com sucesso!" });
            
        } else {
          res.send({ status: 0, msg: "Usuário inexistente!" });
        }
      });
    }
  });

  // Rota de cadastro - Register route
app.post("/createUser", async (req, res) => {
    // Verifica se algum dos parametros vindos da requisição é null, undefined ou vazio
    if (!req.body.userName || !req.body.email || !req.body.password) {
      res.send({ msg: "Preencha todos os campos antes de continuar" });
    } else {
      // Caso esteja tudo ok com os dados vindos do front, encripta a senha
        // Cria um objeto com as informações vindas do front
        const newUser = {
          nome: req.body.userName,
          email: req.body.email,
          senha: req.body.senha
        };
        // Verifica se o nome de usuário já está em uso.
        
                new Usuarios(newUser)
                  .save()
                  .then(() => {
                    console.log("Cadastro realizado com sucesso!");
                    res.send({ msg: "Cadastro realizado com sucesso!" });
                  })
              }
            });

  //listen porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta" + PORT);
});
  