const firebase = require('../config/db_adminSdk');
const Review = require('../models/Review');

const addReview = async (req, res, next) => {
    try {
        const data = req.body;
        await firebase.collection('Reviews').doc().set(data);
        res.send('Review record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await firebase.collection('Reviews');
        const data = await reviews.get();
        const reviewsArray = [];
        if(data.empty){
            res.status(404).send('No Review record found');
        } else {
            data.forEach(doc => {
                const review = new Review(
                    doc.id,
                    doc.data().couponId,
                    doc.data().userId,
                    doc.data().review_text,
                    doc.data().published_date
                );
                reviewsArray.push(review);
            });
            res.send(reviewsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await firebase.collection('Reviews').doc(id);
        const data = await review.get();
        if(!data.exists){
            res.status(404).send('Review with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const review = await firebase.collection('Reviews').doc(id);
        await review.update(data);
        res.send('Review record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Reviews').doc(id).delete();
        res.send('Review record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview
}