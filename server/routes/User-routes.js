const express = require('express');

const { addUser,
        getAllUsers,
        getUser,
        updateUser,
        deleteUser,
        getCountUsers,
        getLastUsers,
        getProfilePicture,
        updateUserDetails
      } = require('../controllers/UserController');

const router = express.Router();

router.post('/User', addUser);
router.get('/Users', getAllUsers);
router.get('/User/:id', getUser);
router.put('/UpdateUser/:id', updateUserDetails);
router.put('/User/:id', updateUser);
router.delete('/User/:id', deleteUser);
router.get('/getCountUsers', getCountUsers);
router.get('/getLastUsers', getLastUsers);

module.exports = {
    routes: router
}