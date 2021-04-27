const admin = require('firebase-admin');
const serviceAccount = require('./adminsdk-serviceAccountKey.json');

//initialize admin SDK using serciceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db_admin = admin.firestore();

module.exports = db_admin;
