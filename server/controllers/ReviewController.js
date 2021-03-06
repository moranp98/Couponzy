const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const Review = require('../models/Review');

const addReview = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data)
        data.published_date = admin.firestore.Timestamp.now();
        await firebase.collection('Reviews').doc().set(data);
        res.json({
            status: "200",
            message: "Review record saved successfuly"
        });
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await firebase.collection('Reviews');
        const data = await reviews.get();
        const reviewsArray = [];
        if(data.empty){
            res.status(404).json('No Review record found');
        } else {
            data.forEach(doc => {
                const review = new Review(
                    doc.id,
                    doc.data().coupon,
                    doc.data().user,
                    doc.data().review_text,
                    doc.data().published_date
                );
                reviewsArray.push(review);
            });
            res.json(reviewsArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await firebase.collection('Reviews').doc(id);
        const data = await review.get();
        if(!data.exists){
            res.status(404).json('Review with the given ID not found');
        } else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const updateReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        data.published_date = admin.firestore.Timestamp.now();
        const review = await firebase.collection('Reviews').doc(id);
        await review.update(data);
        res.json('Review record updated successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Reviews').doc(id).delete();
        res.json('Review record deleted successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    addReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview
}