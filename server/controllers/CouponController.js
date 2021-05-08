const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const Coupon = require('../models/Coupon');

const addCoupon = async (req, res, next) => {
    try {
        const data = req.body;
        data.ratingAvg = 0;
        data.numOf_rating = 0;
        data.lastUpdated = admin.firestore.Timestamp.now();
        await firebase.collection('Coupons').doc(data.couponId).set(data);

        const docId = data.Shop.id;
        const shopsRef = await firebase.collection('Shops').doc(docId);
        shopsRef.update({
            coupons: admin.firestore.FieldValue.arrayUnion({'id': data.couponId})
        });

        const couponTypeId = data.couponType.id;
        const couponTypeRef = await firebase.collection('CouponTypes').doc(couponTypeId);
        couponTypeRef.update({
            countOf_Coupons: admin.firestore.FieldValue.increment(1)
        });

        res.send('Coupon record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await firebase.collection('Coupons');
        const data = await coupons.get();
        const couponsArray = [];
        if(data.empty){
            res.status(404).send('No coupon record found');
        } else {
            data.forEach(doc => {
                const coupon = new Coupon(
                    doc.id,
                    doc.data().couponName,
                    doc.data().description,
                    doc.data().couponId,
                    doc.data().profile_Coupon,
                    doc.data().oldPrice,
                    doc.data().newPrice,
                    doc.data().published,
                    doc.data().expireDate,
                    doc.data().ratingAvg,
                    doc.data().numOf_rating,
                    doc.data().lastUpdated,
                    doc.data().couponType,
                    doc.data().Shop
                );
                couponsArray.push(coupon);
            });
            
            res.send(couponsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getCoupon = async (req, res, next) => {
    try {
        const id = req.params.id;
        const coupon = await firebase.collection('Coupons').doc(id);
        const data = await coupon.get();
        if(!data.exists){
            res.status(404).send('Coupon with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateCoupon = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const coupon = await firebase.collection('Coupons').doc(id);
        data.lastUpdated = admin.firestore.Timestamp.now();
        await coupon.update(data);

        const reviewsRef = await firebase.collection('Reviews').where('coupon.id', '==', id);
        reviewsRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const review = change.doc;
                const newCouponInsidReview = {
                    "id": data.couponId,
                    "couponName": data.couponName,
                    "profile_Coupon": data.profile_Coupon
                };
                review.ref.update({'coupon': newCouponInsidReview});
            });
        });

        const starsRef = await firebase.collection('Stars').where('coupon.id', '==', id);
        starsRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const star = change.doc;
                const newCouponInsidStar = {
                    "id": data.couponId,
                    "couponName": data.couponName,
                    "profile_Coupon": data.profile_Coupon
                };
                star.ref.update({'coupon': newCouponInsidStar});
            });
        });

        const ordersRef = await firebase.collection('Orders').where('coupon.id', '==', id);
        ordersRef.get().then((query) => {
            query.docChanges().forEach(change => {
                const order = change.doc;
                const newCouponInsidOrder = {
                    "id": data.couponId,
                    "couponName": data.couponName,
                    "description": data.description,
                    "newPrice": change.doc.newPrice,
                    "profile_Coupon": data.profile_Coupon
                };
                order.ref.update({'coupon': newCouponInsidOrder});
            });
        });

        res.send('Coupon record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteCoupon = async (req, res, next) => {
    try {
        const id = req.params.id;

        const coupon = await firebase.collection('Coupons').doc(id).get();
        const couponTypeId = coupon.data().couponType.id;
        const couponTypeRef = await firebase.collection('CouponTypes').doc(couponTypeId);
        couponTypeRef.update({
            countOf_Coupons: admin.firestore.FieldValue.increment(-1)
        });

        await firebase.collection('Coupons').doc(id).delete();
        res.send('Coupon record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// <--   Another functions    -->

const getCountCoupons = async (req, res, next) => {
    try {
        var size = 0
        const countOfCoupons = await firebase
        .collection('Coupons')
        .get()
        .then(function(querySnapshot) {      
            size = querySnapshot.size;
        });
        
        res.status(200).send(size.toString());
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getCountValidCoupons = async (req, res, next) => {
    try {
        var size = 0
        const countOfValidCoupons = await firebase
        .collection('Coupons')
        .get()
        .then(function(querySnapshot) { 
            querySnapshot.docChanges().forEach(query => {
                const coupon = query.doc;
                const dateNow = admin.firestore.Timestamp.now();
                if (coupon.data().expireDate >= dateNow){
                    size ++;
                }
            })     
        });
        res.status(200).send(size.toString());
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    addCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
    getCountCoupons,
    getCountValidCoupons
}