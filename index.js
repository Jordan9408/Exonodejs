const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = 8081;

// Connexion bdd
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'auth_exo_node'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connexion bdd réussie');
});


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


const requireLogin = (req, res) => {
    if (!req.session.usersId) {
        res.redirect('/login');
    } else {
        next();
        
    }
    
};

// register 
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const checkUserQuery = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
        const [rows] = connection.query(checkUserQuery, [username]);
        const count = rows[0].count;

        if (count > 0) {
            res.redirect('/register?error=user_exists');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUserQuery = 'INSERT INTO users(username, email, password, role) VALUES (?, ?, ?)';
            await connection.query(insertUserQuery, [username, email, hashedPassword, role]);
            res.redirect('/login');
        }
    } catch (err) {
        throw err;
    }
});

