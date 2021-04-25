const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectToMongodbAtlas = async () => {
    try {
      await mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
  
      console.log('MongoDB Atlas is connected with Mongoose !');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
    
  module.exports = connectToMongodbAtlas;
  