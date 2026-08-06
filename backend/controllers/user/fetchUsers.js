const { getAdminClient } = require('../../config/database');
const getTargetRealm=require('../realms/helper')

exports.getusers = async (req, res) => {
    try {
        const realm = getTargetRealm(req);
        const kcClient = await getAdminClient();
        //fetch all users from keycloak from that realm
        const users = await kcClient.users.find({
            realm: realm,
        });

        // 1. Initial basic check for default admin user
        //remove admin
        const nonAdminUsers = users.filter((user) =>
            user.username?.toLowerCase() !== 'admin' &&
            user.email?.toLowerCase() !== 'admin@admin.com'
        );

        const formattedUsers = (
            await Promise.all(
                nonAdminUsers.map(async (user) => {
                    // Fetch assigned realm roles for each user
                    const roleMappings = await kcClient.users.listRealmRoleMappings({
                        realm: realm,
                        id: user.id,
                    });

                    const allRoleNames = roleMappings.map((r) => r.name.toLowerCase());

                    
                    const isAdmin = allRoleNames.includes('admin') || allRoleNames.includes('realm-admin');

                    // If user is an admin, return null so we can filter them out!
                    if (isAdmin) return null;

                    // Filter out default system roles for display
                    const userRoles = roleMappings
                        .map((r) => r.name)
                        .filter((r) => !r.startsWith('default-roles') && r !== 'offline_access' && r !== 'uma_authorization');

                    const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ')
                        || user.firstName
                        || user.attributes?.firstName?.[0]
                        || user.username
                        || "NA";

                    return {
                        id: user.id,
                        name: displayName,
                        email: user.email,
                        phoneNumber: user.attributes?.phoneNumber?.[0] || user.attributes?.phNo?.[0] || 'N/A',
                        role: userRoles.join(', ') || 'No Role Assigned',
                        enabled: user.enabled,
                    };
                })
            )
        ).filter(Boolean); // remove any null entries (which represent admin users)

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
};