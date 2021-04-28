const firebase = require('../config/db_adminSdk');
const Star = require('../models/Star');

const addStar = async (req, res, next) => {
    try {
        const data = req.body;
        await firebase.collection('Stars').doc().set(data);
        res.send('Star record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllStars = async (req, res, next) => {
    try {
        const stars = await firebase.collection('Stars');
        const data = await stars.get();
        const starsArray = [];
        if(data.empty){
            res.status(404).send('No Star record found');
        } else {
            data.forEach(doc => {
                const star = new Star(
                    doc.id,
                    doc.data().couponId,
                    doc.data().userId,
                    doc.data().value,
                );
                starsArray.push(star);
            });
            res.send(starsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getStar = async (req, res, next) => {
    try {
        const id = req.params.id;
        const star = await firebase.collection('Stars').doc(id);
        const data = await star.get();
        if(!data.exists){
            res.status(404).send('Star with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateStar = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const star = await firebase.collection('Stars').doc(id);
        await star.update(data);
        res.send('Star record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteStar = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Stars').doc(id).delete();
        res.send('Star record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addStar,
    getAllStars,
    getStar,
    updateStar,
    deleteStar
}