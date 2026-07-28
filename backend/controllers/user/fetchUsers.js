const { getAdminClient } = require('../../config/database');
exports.getusers = async (req, res) => {
    try {
        const kcClient = await getAdminClient();
        const users = await kcClient.users.find({
            realm: process.env.KEYCLOAK_REALM,
        });
        // console.log(JSON.stringify(users,null,2))
        const formattedUsers = await Promise.all(
            users.map(async (user) => {
                // Fetch assigned realm roles for each user
                const roleMappings = await kcClient.users.listRealmRoleMappings({
                    id: user.id,
                });

                // Filter out default system roles (keep custom ones like teacher/student)
                const userRoles = roleMappings
                    .map((r) => r.name)
                    .filter((r) => !r.startsWith('default-roles') && r !== 'offline_access' && r !== 'uma_authorization');
                const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') 
                    || user.firstName 
                    || user.attributes?.firstName?.[0]
                    || user.username
                    ||"NA";
                return {
                    id: user.id,
                    name: displayName,
                    email: user.email,
                    phoneNumber: user.attributes?.phoneNumber?.[0] || user.attributes?.phNo?.[0] || 'N/A',
                    role: userRoles.join(', ') || 'No Role Assigned', 
                    enabled: user.enabled,
                };
                console.log(userRoles.phoneNumber)
            })
        );
        res.status(200).json({
            success: true,
            users: formattedUsers,
        });
    } catch (error) {
        console.error('FULL KEYCLOAK ERROR:', error);
        return res.status(500).json({   
            success: false,
            message: 'Failed to fetch users from Keycloak',
            details: error.responseData || error.message || error
        });
    }
}