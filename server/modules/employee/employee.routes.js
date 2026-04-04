import express from 'express';
import * as employeeController from './employee.controller.js';

const router = express.Router();

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.post('/:id/transaction', employeeController.addTransaction); // Special route for Ledger
router.delete('/:id', employeeController.deleteEmployee);

export default router;