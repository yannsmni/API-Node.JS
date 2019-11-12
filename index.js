const express = require('express')
const mysql = require('mysql')
let bodyParser = require('body-parser')
const port = 9000
const app = express()

const sqlconnection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database: 'users'
})

sqlconnection.connect()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(port, () => {
    console.log("Listening on " + port)
})

app.get('/users', (req, res) => {
    sqlconnection.query('SELECT * FROM users', (error, resultats) => {
        if (error) throw error;
        res.json(resultats)
    })
})

app.get('/users/:email', (req, res) => {
    var email = req.params.email;
    sqlconnection.query("SELECT * FROM users WHERE email = ?", email, (error, resultats) => {
        if (error) throw error;
        res.json(resultats)
    })
})

app.post('/users', (req, res) => {
    sqlconnection.query('INSERT INTO users (`id`, `nom`, `prenom`, `localisation`, `email`, `mot_de_passe`, `date_creation`, `role`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)', [req.body.nom, req.body.prenom, req.body.localisation, req.body.email, req.body.mot_de_passe, req.body.date_creation, req.body.role], (error, resultats) => {
        if (error) throw error;
 
        res.status(201).send(`User added with ID: ${resultats.insertId}`);
    })
})

app.put('/users/:id', (req, res) => {
    var id = req.params.id;
    sqlconnection.query('UPDATE users SET nom = ?, prenom = ?, localisation = ?, email = ?, mot_de_passe = ?, date_creation = ?, role = ? WHERE users.id = ?', [req.body.nom, req.body.prenom, req.body.localisation, req.body.email, req.body.mot_de_passe, req.body.date_creation, req.body.role, id], (error, resultats) => {
        if (error) throw error;
 
        res.status(201).send(`User updated with ID: ${id}`);
    })
})

app.delete('/users/:id', (req, res) => {
    var id = req.params.id;
    sqlconnection.query('DELETE FROM users WHERE users.id = ?', id, (error, resultats) => {
        if (error) throw error;
 
        res.status(201).send(`User deleted with ID: ${id}`);
    })
})