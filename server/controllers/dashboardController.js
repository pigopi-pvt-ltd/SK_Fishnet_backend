const Invoice = require('../models/InvoiceModel');
const Vendor = require('../models/VendorModel');
const Employee = require('../models/EmployeeModel');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Get Invoices Stats
        const invoices = await Invoice.find();
        // const invoices = await Invoice.find().select('status date createdAt taxDetails customerDetails invoiceNumber');
        
        let totalActiveInvoices = 0;
        let totalRevenue = 0;
        
        // Data for the Graph (Last 7 days revenue)
        const revenueByDate = {};

        invoices.forEach(inv => {
            if (inv.status === 'Active') {
                totalActiveInvoices++;
                totalRevenue += inv.taxDetails.totalAmount;

                // Format date to YYYY-MM-DD for graph grouping
                const dateKey = new Date(inv.date || inv.createdAt).toISOString().split('T')[0];
                revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + inv.taxDetails.totalAmount;
            }
        });

        // Convert graph data object to array and sort by date
        const graphData = Object.keys(revenueByDate)
            .sort((a, b) => new Date(a) - new Date(b))
            .map(date => ({
                date,
                revenue: revenueByDate[date]
            }));

        // 2. Get Vendor Stats (Dena Baaki Hai)
        const vendors = await Vendor.find();
        let totalVendorDebt = 0; // Total money we owe
        vendors.forEach(v => {
            if (v.totalOutstanding > 0) {
                totalVendorDebt += v.totalOutstanding;
            }
        });

        // 3. Get Employee Stats (Advance Given vs Deposit)
        const employees = await Employee.find();
        // const employees = await Employee.find().select('name role outstandingBalance');
        let totalEmployeeAdvance = 0; // Money we gave (Negative balance)
        
        employees.forEach(emp => {
            if (emp.outstandingBalance < 0) {
                totalEmployeeAdvance += Math.abs(emp.outstandingBalance);
            }
        });

        // Send Combined Master Payload
        res.status(200).json({
            overview: {
                activeInvoices: totalActiveInvoices,
                totalRevenue,
                vendorDebt: totalVendorDebt,
                employeeAdvance: totalEmployeeAdvance
            },
            graphData,
            recentInvoices: invoices.filter(inv => inv.status === 'Active').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), // Top 5
            topEmployees: employees.sort((a, b) => a.outstandingBalance - b.outstandingBalance).slice(0, 5) // Top 5 who took max advance
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};