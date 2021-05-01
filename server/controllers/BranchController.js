const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const Branch = require('../models/Branch');

const addBranch = async (req, res, next) => {
    try {
        const data = req.body;
        data.isOpen = true;
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('Branches').doc().set(data);
        
        const branches = await firebase.collection('Branches');
        const dataNewBranch = await branches.get();

        var branchId = "";
        if (dataNewBranch.empty) {
            res.status(404).send('No branch record found for update into Shop');
        } else {
            dataNewBranch.forEach(doc => {
                if (doc.data().branchName === data.branchName){
                    branchId = doc.id
                }
            });
        }

        const docId = data.shop.id;
        const shopsRef = await firebase.collection('Shops').doc(docId);
        shopsRef.update({
            branches: admin.firestore.FieldValue.arrayUnion({'id': branchId})
        });

        res.send('Branch record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllBranches = async (req, res, next) => {
    try {
        const branches = await firebase.collection('Branches');
        const data = await branches.get();
        const branchesArray = [];
        if (data.empty) {
            res.status(404).send('No branch record found');
        } else {
            data.forEach(doc => {
                const branch = new Branch(
                    doc.id,
                    doc.data().branchName,
                    doc.data().profile_Branch,
                    doc.data().address,
                    doc.data().phoneNumber,
                    doc.data().lat,
                    doc.data().long,
                    doc.data().isOpen,
                    doc.data().lastUpdated,
                    doc.data().shop,
                    doc.data().sellers
                );
                branchesArray.push(branch);
            });
            res.send(branchesArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getBranch = async (req, res, next) => {
    try {
        const id = req.params.id;
        const branch = await firebase.collection('Branches').doc(id);
        const data = await branch.get();
        if (!data.exists) {
            res.status(404).send('Branch with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateBranch = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        data.lastUpdated = admin.firestore.Timestamp.now();
        const branch = await firebase.collection('Branches').doc(id);
        await branch.update(data);

        const ordersRef = await firebase.collection('Orders').where('branch.id', '==', id);
        ordersRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const order = change.doc;
                const newBranchInsidOrder = {
                    "id": id,
                    "shopId": data.shop.shopId,
                    "branchName": data.branchName,
                    "shopName": data.shop.shopName  ,
                    "profile_Shop": data.shop.profile_Shop
                };
                order.ref.update({ 'branch': newBranchInsidOrder });
            });
        });

        res.send('Branch record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteBranch = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Branches').doc(id).delete();
        res.send('Branch record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addBranch,
    getAllBranches,
    getBranch,
    updateBranch,
    deleteBranch
}