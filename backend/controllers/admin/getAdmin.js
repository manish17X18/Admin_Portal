const { getAdminClient } = require('../../config/database');

exports.getAdmins = async (req, res) => {
    try {
        const kcClient = await getAdminClient();

        // Find users mapped specifically to the 'admin' role
        let adminUsers = [];
        try {
            adminUsers = await kcClient.roles.findUsersWithRole({ name: 'admin' });
        } catch (err) {
            // Fallback if findUsersWithRole isn't available
            adminUsers = await kcClient.users.find();
        }

        // Format user list for React frontend
        const formattedAdmins = adminUsers.map((user) => {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
            const phoneNumber = user.attributes?.phoneNumber ? user.attributes.phoneNumber[0] : '';

            return {
                id: user.id,
                name: fullName,
                email: user.email,
                phoneNumber: phoneNumber,
                role: 'admin',
            };
        });

        return res.status(200).json({
            success: true,
            admins: formattedAdmins,
        });

    } catch (error) {
        console.error("Error fetching admins:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load admins",
        });
    }
};