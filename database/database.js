const Sequelize = require('sequelize')

// Configuração
const user = 'root'
const password = 'root'
const host = 'localhost'
const port = '3306'

const connection = new Sequelize('guiaperguntas', user, password, {
    host,
    dialect: 'mysql',
    port,
});

module.exports = connection;