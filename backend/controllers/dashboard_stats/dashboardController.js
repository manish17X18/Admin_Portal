const { getAdminClient } = require('../../config/database');
const getTargetRealm=require('../realms/helper')
exports.getDashboardStats = async (req, res) => {
    try {
        const kcClient = await getAdminClient();
        const realm = getTargetRealm(req);

        //  Fetch live total users count
        const totalUsers = await kcClient.users.count({ realm });

        //  Fetch all users to calculate admins and user roles distribution
        const allUsers = await kcClient.users.find({ realm });

        // Fetch all realm roles
        const roles = await kcClient.roles.find({ realm });
        const totalRoles = roles.length;

        // Fetch admin users to get actual admin count  
        const adminUsers = await kcClient.roles.findUsersWithRole({ name: 'admin', realm });
        const totalAdmins = adminUsers.length;

        //  Calculate Users by Role dynamically
        // Counting how many users belong to each role
        const roleDistribution = await Promise.all(
            roles.map(async (role) => {
                const usersInRole = await kcClient.roles.findUsersWithRole({ name: role.name, realm });
                return {
                    name: role.name,
                    count: usersInRole.length,
                };
            })
        );

        // Calculate percentage for each role
        const formattedRoleData = roleDistribution.map((r) => ({
            name: r.name,
            count: r.count,
            percentage: totalUsers > 0 ? `${Math.round((r.count / totalUsers) * 100)}%` : '0%',
        }));

        // 6. Return real live data
        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalRoles,
                activeSessions: allUsers.length, // Or Keycloak active user count
            },
            roleData: formattedRoleData,
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard metrics.",
        });
    }
};