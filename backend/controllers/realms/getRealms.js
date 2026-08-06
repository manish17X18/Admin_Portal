const { getAdminClient } = require('../../config/database');

exports.getRealms = async (req, res) => {
    try {
        const kcClient = await getAdminClient();
        
        // Fetch all realms from Keycloak
        const realms = await kcClient.realms.find();

        // Format clean array for frontend dropdown & realms list
        const realmList = realms.map(r => ({
            id: r.id || r.realm,
            name: r.realm, // Keycloak stores the name in property 'realm'
            enabled: r.enabled
        }));

        return res.status(200).json({
            success: true,
            realms: realmList
        });
    } catch (error) {
        console.error('Error fetching realms:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch realms',
            error: error.message
        });
    }
};