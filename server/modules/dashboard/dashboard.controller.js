import * as dashboardService from './dashboard.service.js';

const getDashboardStats = async (req, res) => {
    try {
        // SAAS: Extract businessId from the logged-in user's token
        const businessId = req.user.businessId; 
        
        // Pass it to the service
        const stats = await dashboardService.getDashboardStats(businessId);
        
        res.status(200).json(stats);
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
};

export { getDashboardStats };