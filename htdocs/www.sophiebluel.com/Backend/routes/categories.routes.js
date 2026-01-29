const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const categoriesCtrl = require('../controllers/categories.controller');

router.get('/', categoriesCtrl.findAll);
router.post('/', auth, categoriesCtrl.create);
router.put('/:id', auth, categoriesCtrl.update);
router.delete('/:id', auth, categoriesCtrl.delete);


module.exports = router;
