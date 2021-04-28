const express = require('express');

const { addBranch,
        getAllBranches,
        getBranch,
        updateBranch,
        deleteBranch
      } = require('../controllers/BranchController');

const router = express.Router();

router.post('/Branch', addBranch);
router.get('/Branchs', getAllBranches);
router.get('/Branch/:id', getBranch);
router.put('/Branch/:id', updateBranch);
router.delete('/Branch/:id', deleteBranch);

module.exports = {
    routes: router
}