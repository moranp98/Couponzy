const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const CouponType = require('../models/CouponType');

const addCouponType = async (req, res, next) => {
    try {
        const data = req.body;
        data.countOf_Coupons = 0;
        data.isExists = true;
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('CouponTypes').doc().set(data);
        res.json('CouponType record saved successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllCouponTypes = async (req, res, next) => {
    try {
        const couponTypes = await firebase.collection('CouponTypes');
        const data = await couponTypes.get();
        const couponTypesArray = [];
        if (data.empty) {
            res.status(404).json('No couponType record found');
        } else {
            data.forEach(doc => {
                const couponType = new CouponType(
                    doc.id,
                    doc.data().couponTypeName,
                    doc.data().countOf_Coupons,
                    doc.data().isExists,
                    doc.data().lastUpdated
                );
                couponTypesArray.push(couponType);
            });
            res.json(couponTypesArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getCouponType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const couponType = await firebase.collection('CouponTypes').doc(id);
        const data = await couponType.get();
        if (!data.exists) {
            res.status(404).json('CouponType with the given ID not found');
        } else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json(error.message);
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
                coupon.ref.update({ 'couponType.couponTypeName': newCouponTypeInsidCoupon, lastUpdated: admin.firestore.Timestamp.now() });
            });
        });

        const ordersRef = await firebase
            .collection('Orders')
            .where('coupon.couponTypeId', '==', id);
        ordersRef.get().then((query) => {
            query.docChanges().forEach((change) => {
                const order = change.doc;    
                const newcouponTypeInsidOrder = data.couponTypeName;
                order.ref.update({ 'coupon.couponTypeName': newcouponTypeInsidOrder });
            });
        });

        res.json('CouponType record updated successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

/*<--- deleteCouponType Not in used --->*/
const deleteCouponType = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('CouponTypes').doc(id).delete();
        res.json('CouponType record deleted successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const lockoutCouponType = async (req, res, next) => {
    try {
        const id = req.params.id;
        const couponType = await firebase.collection('CouponTypes').doc(id);
        await couponType.update({ 'isExists': false, lastUpdated: admin.firestore.Timestamp.now() });

        res.json(' The couponType has been successfully locked');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    addCouponType,
    getAllCouponTypes,
    getCouponType,
    updateCouponType,
    deleteCouponType,
    lockoutCouponType
}