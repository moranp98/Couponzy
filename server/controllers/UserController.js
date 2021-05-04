const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const User = require('../models/User');

const addUser = async (req, res, next) => {
    try {
        const data = req.body;

        data.active = true;
        data.role = 'customer';
        data.employerId = 'Not employed';
        data.created_at = admin.firestore.Timestamp.now();
        data.lastUpdated = admin.firestore.Timestamp.now();

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
                    doc.data().userName,
                    doc.data().email,
                    doc.data().password,
                    doc.data().userID,
                    doc.data().phoneNumber,
                    doc.data().profile_User,
                    doc.data().birthday,
                    doc.data().gender,
                    doc.data().age,
                    doc.data().maritalStatus,
                    doc.data().address,
                    doc.data().lat,
                    doc.data().long,
                    doc.data().active,
                    doc.data().role,
                    doc.data().employerId,
                    doc.data().created_at,
                    doc.data().lastUpdated
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

        switch (data.employerId) {
            case 'Not employed':
                data.employerId = 'Not employed';
                break;
            default:
                switch (data.role) {
                    case 'shopManager':
                        var shopRef = await firebase.collection('Shops').doc(data.employerId);

                        var checkAffiliation = await firebase.collection('Shops')
                            .where('shopManagers', 'array-contains', {'id': data.email}).get();

                        var checkId = "" 
                        checkAffiliation.docChanges().forEach(change => {
                            const checkshop = change.doc;
                            checkId = checkshop.id
                        });

                        if (checkAffiliation.docChanges().length === 0 || checkId === data.employerId){
                            shopRef.get().then((doc) => {
                                if (doc.exists) {
                                    shopRef.update({
                                        shopManagers: admin.firestore.FieldValue.arrayUnion({'id': data.email})
                                    });
    
                                    data.lastUpdated = admin.firestore.Timestamp.now();
                                    user.update(data);
                                } else {
                                    res.status(404).send('No branch record found');
                                }
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });
                        } else {
                            res.send('The user is already associated with a particular branch');
                        }
                        break;
                    
                    case 'seller':
                        var branchRef = await firebase.collection('Branches').doc(data.employerId);

                        var checkAffiliation = await firebase.collection('Branches')
                            .where('sellers', 'array-contains', {'id': data.email}).get();
                            
                        var checkId = "" 
                        checkAffiliation.docChanges().forEach(change => {
                            const checkbranch = change.doc;
                            checkId = checkbranch.id
                        });
                    
                        if (checkAffiliation.docChanges().length === 0 || checkId === data.employerId){
                            branchRef.get().then((doc) => {
                                if (doc.exists) {
                                    branchRef.update({
                                        sellers: admin.firestore.FieldValue.arrayUnion({'id': data.email})
                                    });

                                    data.lastUpdated = admin.firestore.Timestamp.now();
                                    user.update(data);
                                } else {
                                    res.status(404).send('No branch record found');
                                }
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });
                        } else {
                            res.send('The user is already associated with a particular branch');
                        }
                        break;
                    default:
                        data.employerId = 'Not employed';
                }
        }

        const reviewsRef = await firebase.collection('Reviews').where('user.id', '==', data.email);
        reviewsRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const review = change.doc;
                const newUserInsidReview = {
                    "id": data.email,
                    "firstName": data.userName.firstName,
                    "lastName": data.userName.lastName,
                    "profile_User": data.profile_User
                };
                review.ref.update({'user': newUserInsidReview});
            });
        });

        const starsRef = await firebase.collection('Stars').where('user.id', '==', data.email);
        starsRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const star = change.doc;
                const newUserInsidStar = {
                    "id": data.email,
                    "firstName": data.userName.firstName,
                    "lastName": data.userName.lastName,
                    "profile_User": data.profile_User
                };
                star.ref.update({'user': newUserInsidStar});
            });
        });

        const ordersRef = await firebase.collection('Orders').where('user.id', '==', id);
        ordersRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const order = change.doc;
                const newUserInsidOrder = {
                    "id": id,
                    "firstName": data.userName.firstName,
                    "lastName": data.userName.lastName,
                    "userID": data.userID,
                    "profile_User": data.profile_User,
                    "street": data.address.street,
                    "city": data.address.city,
                    "country": data.address.country
                };
                order.ref.update({ 'user': newUserInsidOrder });
            });
        });

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