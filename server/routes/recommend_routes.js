const express = require('express');

const {
    getRecommendationsCoupons
} = require('../controllers/recommendationEngineController');

const router = express.Router();

router.get('/Coupon/getRecommendationsCoupons/:id', getRecommendationsCoupons);

module.exports = {
    routes: router
}