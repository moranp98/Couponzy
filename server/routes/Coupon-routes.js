const express = require('express');

const { addCoupon, 
        getAllCoupons, 
        getCoupon, 
        updateCoupon,
        deleteCoupon
      } = require('../controllers/CouponController');

const router = express.Router();

router.post('/Coupon', addCoupon);
router.get('/Coupons', getAllCoupons);
router.get('/Coupon/:id', getCoupon);
router.put('/Coupon/:id', updateCoupon);
router.delete('/Coupon/:id', deleteCoupon);

module.exports = {
    routes: router
}