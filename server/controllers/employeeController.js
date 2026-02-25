const Employee = require('../models/EmployeeModel');

// 1. Get All Employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

// 2. Get Single Employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
};

// 3. Create New Employee
exports.createEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create employee' });
    }
};

// 4. Update Employee (Basic Info & KYC)
exports.updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

// 5. Add Transaction (Khata Entry - Advance / Salary)
exports.addTransaction = async (req, res) => {
    try {
        const { type, amount, description, date } = req.body;
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) return res.status(404).json({ error: 'Employee not found' });

        // Add transaction to history
        const newTransaction = { type, amount: Number(amount), description, date: date || new Date() };
        employee.transactions.push(newTransaction);

        // Update Outstanding Balance Logic
        // If Advance Given -> Balance increases (Employee owes admin)
        // If Salary Paid or Deduction -> Balance decreases (Admin adjusted the advance)
        if (type === 'Advance Given') {
            employee.outstandingBalance += Number(amount);
        } else if (type === 'Salary Paid' || type === 'Deduction') {
            employee.outstandingBalance -= Number(amount);
        }

        const savedEmployee = await employee.save();
        res.status(200).json(savedEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add transaction' });
    }
};

// 6. Delete Employee
exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};