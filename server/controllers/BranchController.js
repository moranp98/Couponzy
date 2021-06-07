const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const Branch = require('../models/Branch');

const addBranch = async (req, res, next) => {
    try {
        const data = req.body;
        data.isOpen = true;
        data.isExists = true;
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('Branches').doc().set(data);

        const branches = await firebase.collection('Branches');
        const dataNewBranch = await branches.get();

        var branchId = "";
        if (dataNewBranch.empty) {
            res.status(404).json('No branch record found for update into Shop');
        } else {
            dataNewBranch.forEach(doc => {
                if ((doc.data().branchName === data.branchName) && doc.data().isExists) {
                    branchId = doc.id
                }
            });
        }

        const docId = data.shop.id;
        const shopsRef = await firebase.collection('Shops').doc(docId);
        shopsRef.update({
            branches: admin.firestore.FieldValue.arrayUnion({ 'id': branchId })
        });

        res.json('Branch record saved successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllBranches = async (req, res, next) => {
    try {
        const branches = await firebase.collection('Branches');
        const data = await branches.get();
        const branchesArray = [];
        if (data.empty) {
            res.status(404).json('No branch record found');
        } else {
            data.forEach(doc => {
                const branch = new Branch(
                    doc.id,
                    doc.data().branchName,
                    doc.data().profile_Branch,
                    doc.data().address,
                    doc.data().phoneNumber,
                    doc.data().lat,
                    doc.data().lon,
                    doc.data().isOpen,
                    doc.data().isExists,
                    doc.data().lastUpdated,
                    doc.data().shop,
                    doc.data().sellers
                );
                branchesArray.push(branch);
            });
            res.json(branchesArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllBranchesByShopId = async (req, res, next) => {
    try {
        const shopId = req.params.id;
        const branches = await firebase.collection('Branches');
        const data = await branches.get();
        const branchesArray = [];
        if (data.empty) {
            res.status(404).json('No branch record found');
        } else {
            data.forEach(doc => {
                if (doc.data().shop.id === shopId){
                    const branch = new Branch(
                        doc.id,
                        doc.data().branchName,
                        doc.data().profile_Branch,
                        doc.data().address,
                        doc.data().phoneNumber,
                        doc.data().lat,
                        doc.data().lon,
                        doc.data().isOpen,
                        doc.data().isExists,
                        doc.data().lastUpdated,
                        doc.data().shop,
                        doc.data().sellers
                    );
                    branchesArray.push(branch);
                }
            });
            res.json(branchesArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
};

const getBranch = async (req, res, next) => {
    try {
        const id = req.params.id;
        const branch = await firebase.collection('Branches').doc(id);
        const data = await branch.get();
        if (!data.exists) {
            res.status(404).json('Branch with the given ID not found');
        } else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const updateBranch = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        console.log(data)
        data.lastUpdated = admin.firestore.Timestamp.now();
        const branch = await firebase.collection('Branches').doc(id);
        await branch.update(data);

        const ordersRef = await firebase.collection('Orders').where('branch.id', '==', id);
        ordersRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const order = change.doc;
                const newBranchInsidOrder = {
                    "id": id,
                    "shopId": data.shop.id,
                    "branchName": data.branchName,
                    "shopName": data.shop.shopName,
                    "profile_Branch": data.profile_Branch
                };
                order.ref.update({ 'branch': newBranchInsidOrder });
            });
        });

        res.json('Branch record updated successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

/*<--- deleteBranch Not in used --->*/
const deleteBranch = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Branches').doc(id).delete();
        res.json('Branch record deleted successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const lockoutBranch = async (req, res, next) => {
    try {
        const id = req.params.id;
        const branch = await firebase.collection('Branches').doc(id);
        await branch.update({ 'isExists': false, lastUpdated: admin.firestore.Timestamp.now() });

        const docId = (await branch.get()).data().shop.id;
        const shopsRef = await firebase.collection('Shops').doc(docId);
        shopsRef.update({
            branches: admin.firestore.FieldValue.arrayRemove({ 'id': id })
        });

        res.json('The branch has been successfully locked');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// <--   Another functions    -->

const getCountBranches = async (req, res, next) => {
    try {
        var size = 0
        const countAllBranches = await firebase
            .collection('Branches')
            .get()
            .then(function (querySnapshot) {
                querySnapshot.docChanges().forEach(query => {
                    const branch = query.doc;
                    if (branch.data().isExists) {
                        size++;
                    }
                })
            });

        res.status(200).json(size.toString());

    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getCountIsOpenBranches = async (req, res, next) => {
    try {
        var size = 0
        const countOfIsOpenBranches = await firebase
            .collection('Branches')
            .get()
            .then(function (querySnapshot) {
                querySnapshot.docChanges().forEach(query => {
                    const branch = query.doc;
                    if (branch.data().isOpen && branch.data().isExists) {
                        size++;
                    }
                })
            });
        res.status(200).json(size.toString());

    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getCountBranchesByShopId = async (req, res, next) => {
    try {
        var size = 0
        const shopId = req.params.id;
        const countOfBranchesByShopId = await firebase
            .collection('Branches')
            .get()
            .then(function (querySnapshot) {
                querySnapshot.docChanges().forEach(query => {
                    const branch = query.doc;
                    if (branch.data().isExists && branch.data().shop.id === shopId) {
                        size++;
                    }
                })
            });

        res.status(200).json(size.toString());

    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    addBranch,
    getAllBranches,
    getAllBranchesByShopId,
    getBranch,
    updateBranch,
    deleteBranch,
    lockoutBranch,
    getCountBranches,
    getCountIsOpenBranches,
    getCountBranchesByShopId
}