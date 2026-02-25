const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.post('/:id/transaction', employeeController.addTransaction); // Special route for Ledger
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;