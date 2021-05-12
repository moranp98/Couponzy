const express = require('express');

const { addCoupon, 
        getAllCoupons, 
        getCoupon, 
        updateCoupon,
        deleteCoupon,
        getCountCoupons,
        getCountValidCoupons
      } = require('../controllers/CouponController');

const router = express.Router();

router.post('/Coupon', addCoupon);
router.get('/Coupons', getAllCoupons);
router.get('/Coupon/:id', getCoupon);
router.put('/Coupon/:id', updateCoupon);
router.delete('/Coupon/:id', deleteCoupon);
router.get('/getCountCoupons', getCountCoupons);
router.get('/getCountValidCoupons', getCountValidCoupons);

module.exports = {
    routes: router
}