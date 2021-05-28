const express = require('express');

const { addCouponType,
        getAllCouponTypes,
        getCouponType,
        updateCouponType,
        deleteCouponType,
        lockoutCouponType
      } = require('../controllers/CouponTypeController');

const router = express.Router();

router.post('/CouponType', addCouponType);
router.get('/CouponTypes', getAllCouponTypes);
router.get('/CouponType/:id', getCouponType);
router.put('/CouponType/:id', updateCouponType);
router.delete('/CouponType/:id', deleteCouponType);
router.put('/CouponType/lockout/:id', lockoutCouponType);

module.exports = {
    routes: router
}