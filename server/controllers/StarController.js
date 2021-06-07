const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const Star = require('../models/Star');

const addStar = async (req, res, next) => {
    try {
        const data = req.body;
        await firebase.collection('Stars').doc().set(data);

        const couponId = data.coupon.id;
        const couponRef = await firebase.collection('Coupons').doc(couponId);

        var oldNumOf_rating = (await couponRef.get()).data().numOf_rating;
        var oldRatingAvg = (await couponRef.get()).data().ratingAvg
        var newRatingAvg = ((oldRatingAvg * oldNumOf_rating) + data.value) / (oldNumOf_rating + 1);

        couponRef.update({
            ratingAvg: newRatingAvg
        });

        couponRef.update({
            numOf_rating: admin.firestore.FieldValue.increment(1)
        });

        couponRef.update({
            lastUpdated: admin.firestore.Timestamp.now()
        });

        res.json({
            status: "200",
            message: "Star record saved successfuly"
        });
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllStars = async (req, res, next) => {
    try {
        const stars = await firebase.collection('Stars');
        const data = await stars.get();
        const starsArray = [];
        if(data.empty){
            res.status(404).json('No Star record found');
        } else {
            data.forEach(doc => {
                const star = new Star(
                    doc.id,
                    doc.data().coupon,
                    doc.data().user,
                    doc.data().value,
                );
                starsArray.push(star);
            });
            res.json(starsArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getStar = async (req, res, next) => {
    try {
        const id = req.params.id;
        const star = await firebase.collection('Stars').doc(id);
        const data = await star.get();
        if(!data.exists){
            res.status(404).json('Star with the given ID not found');
        } else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const updateStar = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const star = await firebase.collection('Stars').doc(id);

        const couponId = data.coupon.id;
        const couponRef = await firebase.collection('Coupons').doc(couponId);

        var ratingToUodate = (await star.get()).data().value;
        var numOf_rating = (await couponRef.get()).data().numOf_rating;
        var oldRatingAvg = (await couponRef.get()).data().ratingAvg
        var newRatingAvg = ((oldRatingAvg * numOf_rating) + data.value - ratingToUodate) / numOf_rating;

        couponRef.update({
            ratingAvg: newRatingAvg
        });

        console.log('Star record updated successfuly')
        await star.update(data);
        res.json('Star record updated successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const deleteStar = async (req, res, next) => {
    try {
        const id = req.params.id;

        const star = await firebase.collection('Stars').doc(id).get();
        const couponId = star.data().coupon.id;
        const couponRef = await firebase.collection('Coupons').doc(couponId);

        var ratingToDelete = star.data().value;
        var oldNumOf_rating = (await couponRef.get()).data().numOf_rating;
        var oldRatingAvg = (await couponRef.get()).data().ratingAvg
        var newRatingAvg = ((oldRatingAvg * oldNumOf_rating) - ratingToDelete) / (oldNumOf_rating - 1);

        couponRef.update({
            ratingAvg: newRatingAvg
        });

        couponRef.update({
            numOf_rating: admin.firestore.FieldValue.increment(-1)
        });

        await firebase.collection('Stars').doc(id).delete();
        res.json('Star record deleted successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    addStar,
    getAllStars,
    getStar,
    updateStar,
    deleteStar
}