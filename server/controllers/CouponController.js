'use strict';

const firebase = require('../db');
const Coupon = require('../models/Coupon');
const firestore = firebase.firestore();

const addCoupon = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('Coupons').doc().set(data);
        res.send('Coupon record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await firestore.collection('Coupons');
        const data = await coupons.get();
        const couponsArray = [];
        if(data.empty){
            res.status(404).send('No coupon record found');
        } else {
            data.forEach(doc => {
                const coupon = new Coupon(
                    doc.id,
                    doc.data().name,
                    doc.data().description,
                    doc.data().couponCode,
                    doc.data().pictureName,
                    doc.data().oldPrice,
                    doc.data().newPrice,
                    doc.data().published,
                    doc.data().expireDate,
                    doc.data().lastUpdated,
                    doc.data().couponType,
                    doc.data().shop
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
        const coupon = await firestore.collection('Coupons').doc(id);
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
        const coupon = await firestore.collection('Coupons').doc(id);
        await coupon.update(data);
        res.send('Coupon record updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteCoupon = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('Coupons').doc(id).delete();
        res.send('Coupon record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}