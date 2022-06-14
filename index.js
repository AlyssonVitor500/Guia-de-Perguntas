const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Objeto de conexão
const connection = require('./database/database')

const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

const moment = require('moment');

// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados!');
    })
    .catch((err) => {
        console.log(err);
    });

// Setando o ejs como view engine para que o express entenda
app.set('view engine', 'ejs');
// Usado para setar a pasta public como pasta de arquivos estaticos (img e css)
app.use(express.static('public'));

// Responsável por linkar o express com o body-parser
app.use(bodyParser.urlencoded({extended: false}));
// Permite com que leia dados de formulário via json
app.use(bodyParser.json());


// Rotas
app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order: [['id', 'DESC']]}).then(perguntas => {
        res.render('index', {perguntas, moment});
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvar-pergunta", (req, res) => {
    var titulo = req.body['titulo'];
    var descricao = req.body['descricao'];
    Pergunta.create({
        titulo,
        descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:idPergunta", (req, res) => {
    const id = req.params['idPergunta'];

    Pergunta.findOne({
        raw: true,
        where: {id}
    }).then(pergunta => {
        if(pergunta != undefined) {
            Resposta.findAll({
                raw: true,
                order: [['id', 'DESC']], 
                where: {perguntaId: id}
            }).then(respostas => {
                res.render("pergunta", {pergunta, respostas, moment});
            })
        }else {
            res.redirect("/");
        }
    })
});

app.post("/salvar-resposta", (req, res) => {
    const perguntaId = req.body['perguntaId'];
    const corpo = req.body['corpo'];

    Resposta.create({
        perguntaId,
        corpo
    }).then(()=> {
        res.redirect(`/pergunta/${perguntaId}`);
    });
});

app.listen(8080, (err)=> {
    if (err) {
        console.log("Ocorreu um erro!");
        console.error(err);
    } else {
        console.log("App inciado!");
    }
})