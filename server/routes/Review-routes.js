const express = require('express');

const { addReview,
        getAllReviews,
        getReview,
        updateReview,
        deleteReview
      } = require('../controllers/ReviewController');

const router = express.Router();

router.post('/Review', addReview);
router.get('/Reviews', getAllReviews);
router.get('/Review/:id', getReview);
router.put('/Review/:id', updateReview);
router.delete('/Review/:id', deleteReview);

module.exports = {
    routes: router
}