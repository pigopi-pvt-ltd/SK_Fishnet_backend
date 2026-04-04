import * as employeeService from './employee.service.js'; 

// 1. Get All Employees
const getAllEmployees = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const employees = await employeeService.getAllEmployees(businessId);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

// 2. Get Single Employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const employee = await employeeService.getEmployeeById(req.params.id, businessId);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
};

// 3. Create New Employee
const createEmployee = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const savedEmployee = await employeeService.createEmployee(req.body, businessId);
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create employee' });
    }
};

// 4. Update Employee
const updateEmployee = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const updatedEmployee = await employeeService.updateEmployee(req.params.id, req.body, businessId);
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

// 5. Add Transaction
const addTransaction = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const savedEmployee = await employeeService.addTransaction(req.params.id, req.body, businessId);
        res.status(200).json(savedEmployee);
    } catch (error) {
        if (error.message === 'Employee not found or unauthorized') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to add transaction' });
    }
};

// 6. Delete Employee
const deleteEmployee = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        await employeeService.deleteEmployee(req.params.id, businessId);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};

export {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    addTransaction,
    deleteEmployee
};