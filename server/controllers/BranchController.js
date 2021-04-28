const firebase = require('../config/db_adminSdk');
const Branch = require('../models/Branch');

const addBranch = async (req, res, next) => {
    try {
        const data = req.body;
        await firebase.collection('Branches').doc().set(data);
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
                    doc.data().name,
                    doc.data().address,
                    doc.data().phoneNumber,
                    doc.data().lat,
                    doc.data().long,
                    doc.data().isOpen,
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
        const branch = await firebase.collection('Branches').doc(id);
        await branch.update(data);
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