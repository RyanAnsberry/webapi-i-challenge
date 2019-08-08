const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

// Find (get)  Users
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: "The users information could not be retrieved."
        })
    })
});

// Find (get) user by Id
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
    .then(user => {
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        }
    })
    .catch(err =>{
        res.status(500).json({
            err: err,
            error: "The user information could not be retrieved."
        })
    })
})

// Insert (post) new user
server.post('/api/users', (req, res) => {
    const newUser = req.body;
    if (!newUser.name || !newUser.bio) {
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    }
    db.insert(newUser)
    .then(userId => {
        if(userId && newUser) {
            res.status(201).json(userId);
        }
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            error: "There was an error while saving the user to the database"
        })
    })
});

// Remove (delete) user by ID
server.delete('/api/users/:id', (req, res) => {
    const {id } = req.params;
    db.remove(id)
    .then(deletedUser => {
        if (deletedUser) {
            res.json(deletedUser)
        } else {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            error: "The user could not be removed"
        })
    })
});

// Updating an existing user
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if (!changes.name || !changes.bio) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    }

    db.update(id, changes)
    .then(updatedUser => {
        if (updatedUser) {
            res.json(updatedUser);
        }
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            error: "The user information could not be modified."
        })
    })
});


server.listen(4000, () => {

});
