const express = require('express');

const { addStar,
        getAllStars,
        getStar,
        updateStar,
        deleteStar
      } = require('../controllers/StarController');

const router = express.Router();

router.post('/Star', addStar);
router.get('/Stars', getAllStars);
router.get('/Star/:id', getStar);
router.put('/Star/:id', updateStar);
router.delete('/Star/:id', deleteStar);

module.exports = {
    routes: router
}