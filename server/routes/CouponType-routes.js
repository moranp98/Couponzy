const express = require('express');

const { addCouponType,
        getAllCouponTypes,
        getCouponType,
        updateCouponType,
        deleteCouponType
      } = require('../controllers/CouponTypeController');

const router = express.Router();

router.post('/CouponType', addCouponType);
router.get('/CouponTypes', getAllCouponTypes);
router.get('/CouponType/:id', getCouponType);
router.put('/CouponType/:id', updateCouponType);
router.delete('/CouponType/:id', deleteCouponType);

module.exports = {
    routes: router
}