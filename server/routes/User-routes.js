const express = require('express');

const { addUser,
        getAllUsers,
        getUser,
        updateUser,
        deleteUser
      } = require('../controllers/UserController');

const router = express.Router();

router.post('/User', addUser);
router.get('/Users', getAllUsers);
router.get('/User/:id', getUser);
router.put('/User/:id', updateUser);
router.delete('/User/:id', deleteUser);

module.exports = {
    routes: router
}