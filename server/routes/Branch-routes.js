const express = require('express');

const { addBranch,
        getAllBranches,
        getBranch,
        updateBranch,
        deleteBranch,
        getCountBranches,
        getCountIsOpenBranches
      } = require('../controllers/BranchController');

const router = express.Router();

router.post('/Branch', addBranch);
router.get('/Branches', getAllBranches);
router.get('/Branch/:id', getBranch);
router.put('/Branch/:id', updateBranch);
router.delete('/Branch/:id', deleteBranch);
router.get('/getCountBranches', getCountBranches);
router.get('/getCountIsOpenBranches', getCountIsOpenBranches);

module.exports = {
    routes: router
}