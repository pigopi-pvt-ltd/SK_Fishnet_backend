import Invoice from '../invoice/invoice.model.js';
import Vendor from '../payment/vendor.model.js';
import Employee from '../employee/employee.model.js';

export const getDashboardStats = async (businessId) => {
    // 1. Get Invoices Stats for this specific business
    const invoices = await Invoice.find({ businessId });
    
    let totalActiveInvoices = 0;
    let totalRevenue = 0;
    const revenueByDate = {};

    invoices.forEach(inv => {
        if (inv.status === 'Active') {
            totalActiveInvoices++;
            totalRevenue += inv.taxDetails.totalAmount;

            const dateKey = new Date(inv.date || inv.createdAt).toISOString().split('T')[0];
            revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + inv.taxDetails.totalAmount;
        }
    });

    const graphData = Object.keys(revenueByDate)
        .sort((a, b) => new Date(a) - new Date(b))
        .map(date => ({
            date,
            revenue: revenueByDate[date]
        }));

    // 2. Get Vendor Stats for this business
    const vendors = await Vendor.find({ businessId }).select('totalOutstanding');
    let totalVendorDebt = 0;
    vendors.forEach(v => {
        if (v.totalOutstanding > 0) {
            totalVendorDebt += v.totalOutstanding;
        }
    });

    // 3. Get Employee Stats for this business
    const employees = await Employee.find({ businessId }).select('name role outstandingBalance');
    let totalEmployeeAdvance = 0;
    employees.forEach(emp => {
        if (emp.outstandingBalance < 0) {
            totalEmployeeAdvance += Math.abs(emp.outstandingBalance);
        }
    });

    // 4. Return Master Payload to Controller
    return {
        overview: {
            activeInvoices: totalActiveInvoices,
            totalRevenue,
            vendorDebt: totalVendorDebt,
            employeeAdvance: totalEmployeeAdvance
        },
        graphData,
        recentInvoices: invoices.filter(inv => inv.status === 'Active').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), 
        topEmployees: employees.sort((a, b) => a.outstandingBalance - b.outstandingBalance).slice(0, 5) 
    };
};