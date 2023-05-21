const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/userList', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        const users = JSON.parse(data);
        res.render('userList', { users })
    })
})
app.get('/edit', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        const users = JSON.parse(data);
        let targetUser = users.filter(user => user.id === req.query.id);
        res.render('edit', {targetUser})
    })
})

app.post('/create', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        let users;
        try {
            users = JSON.parse(data); 
        } catch (parseErr) {
            users = []; 
        }
        let newUser = {
            uuid: uuidv4(),
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            age: req.body.age
        };
        users.push(newUser);
        let json = JSON.stringify(users);
        fs.writeFile('./users.json', json, 'utf8', () => {
            console.log('Updated');
            req.body.username = '';
            req.body.name = '';
            req.body.email = '';
            req.body.age = '';
            res.render('userList', { users });
        });
    })
});
app.post('/edit', (req, res) => {
    res.redirect('/edit')
})
app.post('/delete', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        const temp = JSON.parse(data);
        const updatedUsers = temp.filter(user => user.uuid !== req.body.id);
        const json = JSON.stringify(updatedUsers);
        fs.writeFile('./users.json', json, 'utf8', () => {
            res.redirect('/userList');
        });
    })
})

app.listen(9000, () => {
    console.log('listening on port 9000');
});