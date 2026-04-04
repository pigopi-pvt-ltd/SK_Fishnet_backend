import * as businessService from './business.service.js';

// Client Onboarding
const setupBusiness = async (req, res) => {
    try {
        const businessId = req.user.businessId; 
        const updatedBusiness = await businessService.setupBusiness(businessId, req.body);
        res.status(200).json({ message: "Business setup successful!", data: updatedBusiness });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to setup business' });
    }
};

// ==========================================
// GLOBAL ADMIN CONTROLLERS
// ==========================================

const verifyGlobalAdmin = (req) => {
    if (req.user.role !== 'GlobalAdmin' && !req.user.isGlobalAdmin) {
        throw new Error("Access Denied: You do not have Global Admin privileges.");
    }
};

// Fetch all clients
const getAllClients = async (req, res) => {
    try {
        verifyGlobalAdmin(req);
        const clients = await businessService.getAllBusinesses();
        res.status(200).json(clients);
    } catch (error) {
        if (error.message.includes("Access Denied")) return res.status(403).json({ error: error.message });
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};

// Create a new client
const createClient = async (req, res) => {
    try {
        verifyGlobalAdmin(req);
        const newClient = await businessService.createNewClient(req.body);
        res.status(201).json({ message: "Client created successfully.", data: newClient });
    } catch (error) {
        if (error.message.includes("Access Denied")) return res.status(403).json({ error: error.message });
        if (error.message.includes("already registered")) return res.status(400).json({ error: error.message });
        res.status(500).json({ error: 'Failed to create new client' });
    }
};

// Delete a client completely
const deleteClient = async (req, res) => {
    try {
        verifyGlobalAdmin(req);
        await businessService.deleteClientData(req.params.id);
        res.status(200).json({ message: "Client and all associated data wiped successfully." });
    } catch (error) {
        if (error.message.includes("Access Denied")) return res.status(403).json({ error: error.message });
        res.status(500).json({ error: 'Failed to delete client data' });
    }
};

export { setupBusiness, getAllClients, createClient, deleteClient };