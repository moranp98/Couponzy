const express = require('express');

const { Register,
        uploadImage,
        addUser,
        getAllUsers,
        getUser,
        updateRoleUserNotEmployed,
        updateRoleUserYesEmployed,
        cancelRoleForEmployer,
        deleteUser,
        getCountUsers,
        getLastUsers,
        getProfilePicture,
        updateUserDetails
      } = require('../controllers/UserController');

const router = express.Router();

router.post('/User/Register', Register); //for android- using 'Volley Http'- not used
router.post('/User/UploadImage', uploadImage); //for android- using 'Volley Http'- not used
router.post('/User', addUser);
router.get('/Users', getAllUsers);
router.get('/User/:id', getUser);
router.put('/UpdateUser/:id', updateUserDetails);
router.put('/UserNotEmployed/:id', updateRoleUserNotEmployed);
router.put('/UserYesEmployed/:id', updateRoleUserYesEmployed);
router.put('/UserCancelEmployer/:id', cancelRoleForEmployer);
router.delete('/User/:id', deleteUser);
router.get('/getCountUsers', getCountUsers);
router.get('/getLastUsers', getLastUsers);

module.exports = {
    routes: router
}