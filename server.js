// configuração do servidor
const express = require("express")
const server = express()

// configuração para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

// configurando conexao com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'maratonadev'
})

// configuração da template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


// configuração da rota inicial
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res) {
    // pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // verifica se existe algum campo vazio
    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // colocar valor no banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

    const values = [name, email, blood]
    
    db.query(query, values, function(err) {
        if (err) res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
})

// Ativando o servidor na porta 3000
server.listen(3000)