const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { getAllSales, getSaleById, createSale, updateSale, deleteSale } = require('../controllers/sales.controller')

router.get('/', verifyToken, getAllSales)
router.get('/:id', verifyToken, getSaleById)
router.post('/', verifyToken, createSale)
router.put('/:id', verifyToken, updateSale)
router.delete('/:id', verifyToken, deleteSale)

module.exports = router
