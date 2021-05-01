const admin = require('firebase-admin');
const serviceAccount = require('./adminsdk-serviceAccountKey.json');

//initialize admin SDK using serciceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
 
const uid = 'some-uid';

admin
  .auth()
  .createCustomToken(uid)
  .then((customToken) => {
    // Send token back to client
    console.log('The custom token is:', customToken);
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });

const db_admin = admin.firestore();

module.exports = db_admin;
