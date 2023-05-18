const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/userList', (req, res) => {
    res.render('userList');
})
app.get('/users', (req, res) => {
    const users = {
        uniqueID: uuidv4(),
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    };
    const jsonData = JSON.stringify(users);
    const filePath = ''

})

app.post('/create', (req, res) => {
    res.render('userList')
    res.end(`Name: ${user.name}\n 
            Email: ${user.email}
            Username: ${user.username} 
            Age: ${user.age} `)
});

app.listen(9000, () => {
    console.log('listening on port 9000');
});