const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const User = require('../models/User');

const Register = async (req, res, next) => {
    try {
        const data = req.body;
        const userName = {
            firstName: data.firstName,
            lastName: data.lastName
        }
        const address = {
            city: data.city,
            country: data.country,
            zipcode: data.zipcode
        }
        // Calculate age
        var dateParts = data.birthday.split("/");
        var dateBirthday = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
        var today = new Date();
        let age = new Date(today.getTime() - dateBirthday.getTime()).getUTCFullYear() - 1970;
        
        if (data.profile_User === null) {
            data.profile_User = "../../../assets/content/avatar-2.jpg"
        }
        const userRecord2 = {
            userName: userName,
            email: data.email,
            userID: data.userID,
            phoneNumber: data.phoneNumber,
            profile_User: data.profile_User,
            address: address,
            gender: data.gender,
            birthday: data.birthday,
            age: age,
            maritalStatus: data.maritalStatus,
            lat: data.lat,
            lon: data.lon, 
            active: true,
            role: 'customer',
            employerId: 'Not employed',
            created_at: admin.firestore.Timestamp.now(),
            lastUpdated: admin.firestore.Timestamp.now()
        }
        console.log(userRecord2)
        admin
            .auth()
            .createUser({
                email: data.email,
                emailVerified: false,       
                password: data.password,
                displayName: userName.firstName + ' ' + userName.lastName,
                photoURL: data.profile_User,
                disabled: false 
            })
            .then((userRecord) => {
                firebase.collection('Users').doc(userRecord2.email).set(userRecord2)
                console.log('Successfully created new user:', userRecord.uid);
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
            });

        console.log("Acceced in ADDUSER")        
        res.json({
            status: "200",
            message: "User record Registered successfuly with admin SDK"
        });
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const uploadImage = async (req, res, next) => {

    try {
        const data = req.body;
        console.log('data = ' + data.finalBitmap);
        const bucket = admin.storage().bucket();
        bucket.upload(data.finalBitmap).then(result => {
            //const user = firebase.collection('Users').doc(data.email);
            //user.update({ 'profile_User': data.finalBitmap });
            console.log('upload success = ' + result);
        }).catch(err => {
            console.log('error uploading to storage', err);
        });
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const addUser = async (req, res, next) => {
    try {
        const data = req.body; 
        let timeDiff = Math.abs(Date.now() - new Date(data.birthday));
        let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25); 
        console.log("Age is : " + age)  
        console.log(data);
        data.active = true;
        data.role = 'customer';
        data.employerId = 'Not employed';
        data.created_at = admin.firestore.Timestamp.now();
        data.lastUpdated = admin.firestore.Timestamp.now();
        data.age = age//birthday
        data.lat = 0.0;
        data.lon = 0.0; 
        if(data.profile_User == null){
            data.profile_User = "../../../assets/content/avatar-2.jpg"
        }
        console.log("Acceced in ADDUSER")
        await firebase.collection('Users').doc(data.email).set(data);
        res.json('User record saved successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await firebase.collection('Users');
        const data = await users.get();
        const usersArray = [];
        if (data.empty) {
            res.status(404).json('No user record found');
        } else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().userName,
                    doc.data().email,
                    doc.data().userID,
                    doc.data().phoneNumber,
                    doc.data().profile_User,
                    doc.data().birthday,
                    doc.data().gender,
                    doc.data().age,
                    doc.data().maritalStatus,
                    doc.data().address,
                    doc.data().lat,
                    doc.data().lon,
                    doc.data().active,
                    doc.data().role,
                    doc.data().employerId,
                    doc.data().created_at,
                    doc.data().lastUpdated
                );
                //console.log(user)
                usersArray.push(user);
            });
            res.json(usersArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}
const getProfilePicture = async (req, res, next) => {
    try {
        const path = req.params.id;
        const photo = await firebase.collection('photos').doc(path);
        const data = await photo.get();
        if (!data.exists) {
            res.status(404).json('Photo with the given Path not found');
        } else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}
const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await firebase.collection('Users').doc(id);
        const data = await user.get();
        if (!data.exists) {
            res.status(404).json('User with the given ID not found');
        } else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}
const updateUserDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        console.log(data)
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('Users').doc(id).update(data)

        /*const reviewsRef = await firebase.collection('Reviews').where('user.id', '==', data.email);
        reviewsRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const review = change.doc;
                const newUserInsidReview = {
                    "id": data.email,
                    "firstName": data.userName.firstName,
                    "lastName": data.userName.lastName,
                    "profile_User": data.profile_User
                };
                review.ref.update({ 'user': newUserInsidReview });
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
                star.ref.update({ 'user': newUserInsidStar });
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
                };
                order.ref.update({ 'user': newUserInsidOrder });
            });
        });*/

        res.json('User update saved successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    } 
}

const updateRoleUserNotEmployed = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('Users').doc(id).update(data)
        res.json('User update saved successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const updateRoleUserYesEmployed = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        console.log(data)
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
                            .where('shopManagers', 'array-contains', { 'id': data.email }).get();

                        var checkId = ""
                        checkAffiliation.docChanges().forEach(change => {
                            const checkshop = change.doc;
                            checkId = checkshop.id
                        });

                        if (checkAffiliation.docChanges().length === 0 || checkId === data.employerId) {
                            shopRef.get().then((doc) => {
                                if (doc.exists) {
                                    shopRef.update({
                                        shopManagers: admin.firestore.FieldValue.arrayUnion({ 'id': data.email })
                                    });

                                    data.lastUpdated = admin.firestore.Timestamp.now();
                                    user.update(data);
                                } else {
                                    res.status(404).json('No branch record found');
                                }
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });
                        } else {
                            res.json('The user is already associated with a particular branch');
                        }
                        break;

                    case 'seller':
                        var branchRef = await firebase.collection('Branches').doc(data.employerId);

                        var checkAffiliation = await firebase.collection('Branches')
                            .where('sellers', 'array-contains', { 'id': data.email }).get();

                        var checkId = ""
                        checkAffiliation.docChanges().forEach(change => {
                            const checkbranch = change.doc;
                            checkId = checkbranch.id
                        });

                        if (checkAffiliation.docChanges().length === 0 || checkId === data.employerId) {
                            branchRef.get().then((doc) => {
                                if (doc.exists) {
                                    branchRef.update({
                                        sellers: admin.firestore.FieldValue.arrayUnion({ 'id': data.email })
                                    });

                                    data.lastUpdated = admin.firestore.Timestamp.now();
                                    user.update(data);
                                } else {
                                    res.status(404).json('No branch record found');
                                }
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });
                        } else {
                            res.json('The user is already associated with a particular branch');
                        }
                        break;
                    default:
                        data.employerId = 'Not employed';
                }
        }

        res.json('User record updated successfuly');
    } catch (error) {
        res.status(400).json(error.message  + "last");
    }
}

const cancelRoleForEmployer = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        
        switch (data.role) {
            case 'shopManager':
                var shopRef = await firebase.collection('Shops').doc(data.employerId);
                shopRef.update({
                    shopManagers: admin.firestore.FieldValue.arrayRemove({'id': id})
                });   
                break;

            case 'seller':
                var branchRef = await firebase.collection('Branches').doc(data.employerId);
                branchRef.update({
                    sellers: admin.firestore.FieldValue.arrayRemove({'id': id})
                });
                break;
            default:
                
        }

        data.employerId = 'Not employed';
        data.role = 'customer';
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('Users').doc(id).update(data);

        res.json('User update saved successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Users').doc(id).delete();
        res.json('User record deleted successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// <--   Another functions    -->

const getCountUsers = async (req, res, next) => {
    try {
        var size = 0
        const countOfUsers = await firebase
            .collection('Users')
            .get()
            .then(function (querySnapshot) {
                size = querySnapshot.size;
            });

        res.status(200).json(size.toString());

    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getLastUsers = async (req, res, next) => {
    try {
        const users = await firebase
            .collection('Users')
            .orderBy("created_at", "desc")
            .limit(10)
        const data = await users.get();
        const usersArray = [];
        if (data.empty) {
            res.status(404).json('No user record found');
        } else {
            data.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.data().userName,
                    doc.data().email,
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
            res.json(usersArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    Register,
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
}