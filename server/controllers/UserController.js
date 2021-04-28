const firebase = require('../config/db_adminSdk');
const User = require('../models/User');

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        await firebase.collection('Users').doc(data.email).set(data);
        res.send('User record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await firebase.collection('Users');
        const data = await users.get();
        const usersArray = [];
        if (data.empty) {
            res.status(404).send('No user record found');
        } else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().firstName,
                    doc.data().lastName,
                    doc.data().email,
                    doc.data().password,
                    doc.data().userID,
                    doc.data().phoneNumber,
                    doc.data().pictureName,
                    doc.data().birthday,
                    doc.data().gender,
                    doc.data().age,
                    doc.data().maritalStatus,
                    doc.data().address,
                    doc.data().lat,
                    doc.data().long,
                    doc.data().active,
                    doc.data().role,
                    doc.data().permssion,
                    doc.data().created_at,
                    doc.data().updated_at
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await firebase.collection('Users').doc(id);
        const data = await user.get();
        if (!data.exists) {
            res.status(404).send('User with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await firebase.collection('Users').doc(id);
        await user.update(data);
        res.send('User record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Users').doc(id).delete();
        res.send('User record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}