const firebase = require('../config/db_adminSdk');
const admin = require('firebase-admin');
const Coupon = require('../models/Coupon');
const recommendations = require('../../lib/cf_api.js');
const math = require('mathjs');

const getRecommendationsCoupons = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await firebase.collection('Users');
        const dataU = await user.get();

        let setU = new Set();
        let indexU = 0;
        dataU.forEach((doc) => {
            //if (doc.data().role === 'customer') {
            let user = { name: doc.id, id: indexU++ };
            setU.add(user)
            //}
        });
        const nUsers = setU.size;

        const coupons = await firebase.collection('Coupons');
        const dataC = await coupons.get();
        const nCoupons = dataC.size;

        const orders = await firebase.collection('Orders');
        const dataO = await orders.get();

        const ratingsMatrix = math.zeros(nUsers, nCoupons);

        let lastRatingsMatrix;
        lastRatingsMatrix = checkBuyesCoupons(dataU, dataC, dataO, ratingsMatrix)

        var userIndex = 0
        for (let user of setU) {
            if (user.name === id)
                userIndex = user.id;
        }

        console.log(lastRatingsMatrix);
        console.log(userIndex);
        console.log('start recommendations');
        const recommendationsCouponsId = recommendations.cFilter(lastRatingsMatrix._data, userIndex);
        console.log(recommendationsCouponsId);

        const returnRecommendationsCoupons = retriveRecommendationsCoupons(dataC, recommendationsCouponsId)
        console.log(returnRecommendationsCoupons);

        res.json(returnRecommendationsCoupons);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

function checkBuyesCoupons(dataU, dataC, dataO, ratingsMatrix) {
    try {
        let setU = new Set();
        let indexU = 0;
        dataU.forEach((doc) => {
            //if (doc.data().role === 'customer') {
            let user = { name: doc.id, id: indexU++ };
            setU.add(user)
            //}
        });

        let setC = new Set();
        let indexC = 0;
        dataC.forEach((doc) => {
            let coupon = { name: doc.id, id: indexC++ };
            setC.add(coupon)
        });

        let setO = new Set();
        dataO.forEach((doc) => {
            let coupon = { user: doc.data().user.id, coupon: doc.data().coupon.id };
            setO.add(coupon)
        });

        for (let user of setU) {
            // User
            for (let coupon of setC) {
                // Items in the user
                for (let order of setO) {
                    // Co-occurrence
                    if (order.user === user.name && order.coupon === coupon.name) {
                        ratingsMatrix.set([user.id, coupon.id], 1);
                        //console.log(order);
                        break;
                    } else {
                        ratingsMatrix.set([user.id, coupon.id], 0);
                    }
                }
            }
        }
        console.log('its Ok');
        return ratingsMatrix;
    } catch (error) {
        console.log('its Not Ok');
    }
}

function retriveRecommendationsCoupons(dataC, recommendationsCouponsId) {
    try {

        let indexC = 0;
        const couponsArray = [];
        if (dataC.empty) {
            res.status(404).json('No coupon record found');
        } else {
            dataC.forEach((doc) => {
                if (recommendationsCouponsId.includes(indexC++)) {
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
                        doc.data().isExists,
                        doc.data().lastUpdated,
                        doc.data().couponType,
                        doc.data().shop
                    );
                    couponsArray.push(coupon);
                }
            });
        }
        return couponsArray;
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    getRecommendationsCoupons
};