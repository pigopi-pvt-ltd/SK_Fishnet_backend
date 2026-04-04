import Employee from './employee.model.js';

// 1. Get All for a specific business
export const getAllEmployees = async (businessId) => {
    return await Employee.find({ businessId }).sort({ createdAt: -1 });
};

// 2. Get Single (Secured with businessId check)
export const getEmployeeById = async (id, businessId) => {
    return await Employee.findOne({ _id: id, businessId });
};

// 3. Create
export const createEmployee = async (employeeData, businessId) => {
    const newEmployee = new Employee({ ...employeeData, businessId });
    return await newEmployee.save();
};

// 4. Update
export const updateEmployee = async (id, updateData, businessId) => {
    return await Employee.findOneAndUpdate(
        { _id: id, businessId }, // Security Check
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

// 5. Add Transaction (Khata Logic)
export const addTransaction = async (id, transactionData, businessId) => {
    const { type, amount, description, date } = transactionData;
    
    // Find employee ensuring they belong to this business
    const employee = await Employee.findOne({ _id: id, businessId });

    if (!employee) {
        throw new Error('Employee not found or unauthorized'); 
    }

    const absAmount = Math.abs(Number(amount));
    const newTransaction = { type, amount: absAmount, description, date: date || new Date() };
    
    employee.transactions.push(newTransaction);

    if (type === 'Advance Given' || type === 'Salary Paid') {
        employee.outstandingBalance -= absAmount;
    } else if (type === 'Deduction' || type === 'Deposit with Admin') { 
        employee.outstandingBalance += absAmount; 
    }

    return await employee.save();
};

// 6. Delete
export const deleteEmployee = async (id, businessId) => {
    return await Employee.findOneAndDelete({ _id: id, businessId });
};