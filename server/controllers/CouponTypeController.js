const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const CouponType = require('../models/CouponType');

const addCouponType = async (req, res, next) => {
    try {
        const data = req.body;
        data.countOf_Coupons = 0;
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('CouponTypes').doc().set(data);
        res.send('CouponType record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllCouponTypes = async (req, res, next) => {
    try {
        const couponTypes = await firebase.collection('CouponTypes');
        const data = await couponTypes.get();
        const couponTypesArray = [];
        if (data.empty) {
            res.status(404).send('No couponType record found');
        } else {
            data.forEach(doc => {
                const couponType = new CouponType(
                    doc.id,
                    doc.data().couponTypeName,
                    doc.data().countOf_Coupons,
                    doc.data().lastUpdated
                );
                couponTypesArray.push(couponType);
            });
            res.send(couponTypesArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getCouponType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const couponType = await firebase.collection('CouponTypes').doc(id);
        const data = await couponType.get();
        if (!data.exists) {
            res.status(404).send('CouponType with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateCouponType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        data.lastUpdated = admin.firestore.Timestamp.now();
        const couponType = await firebase.collection('CouponTypes').doc(id);
        await couponType.update(data);

        const couponsRef = await firebase.collection('Coupons').where('couponType.id', '==', id);
        couponsRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const coupon = change.doc;
                const newCouponTypeInsidCoupon = data.couponTypeName;
                coupon.ref.update({'couponType.couponName': newCouponTypeInsidCoupon});
            });
        });

        res.send('CouponType record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteCouponType = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('CouponTypes').doc(id).delete();
        res.send('CouponType record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addCouponType,
    getAllCouponTypes,
    getCouponType,
    updateCouponType,
    deleteCouponType
}