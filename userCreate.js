const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({extended:false}))

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/userList', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        let users = JSON.parse(data);
        res.render('userList', { users })
    })
})
app.get('/edit', (req, res) => {
    res.render('edit', { currentUser })
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
            res.redirect('/userList');
        });
    })
});
app.post('/edit', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        const users = JSON.parse(data);
        const userID = req.body.uuid;
        const currentUser = users.find(user => user.uuid === userID)
        // console.log(currentUser);
        res.render('edit', { currentUser })
    })
})
app.post('/update', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        const oldUsers = JSON.parse(data);
        const targetUser = oldUsers.find(user => user.uuid === req.body.uuid);
        console.log('before: ', targetUser);
        targetUser.name = req.body.name;
        targetUser.email = req.body.email;
        targetUser.username = req.body.username;
        targetUser.age = req.body.age;
        console.log('after: ', targetUser);
        const users = oldUsers.filter(user => user.uuid !== req.body.uuid);
        users.push(targetUser);
        const json = JSON.stringify(users);
        fs.writeFile('./users.json', json, 'utf8', () => {
            res.redirect('/userList');
        });
    }) 
})
app.post('/delete', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        const users = JSON.parse(data);
        const updatedUsers = users.filter(user => user.uuid !== req.body.uuid);
        const json = JSON.stringify(updatedUsers);
        fs.writeFile('./users.json', json, 'utf8', () => {
            res.redirect('/userList');
        });
    })
})

app.listen(9000, () => {
    console.log('listening on port 9000');
});