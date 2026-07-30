const { getAdminClient } = require('../../config/database');

exports.deleteRole = async (req, res) => {
    try {
        const kcClient = await getAdminClient();
        const roleName = req.body.roleName || req.body.role || req.body.name;
        if (!roleName || !roleName.trim()) {
            return res.status(404).json({
                success: false,
                message: "No role found",
            })
        }
        const targetRoleName = roleName.trim();
        //don't delete system roles
        if (['admin', 'realm-admin', 'offline_access', 'uma_authorization'].includes(targetRoleName.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "System roles cannot be deleted",
            });
        }


        let roleFound = null

        try {
            roleFound = await kcClient.roles.findOneByName({
                name: targetRoleName
            })
        } catch (error) {
            console.error(error)
        }

        if (!roleFound) {
            return res.status(404).json({
                success: false,
                message: `Role '${targetRoleName}' not found in Keycloak`,
            });
        }
        //check if any users are assigned to this role
        const assignedUsers = await kcClient.roles.findUsersWithRole({
            name: targetRoleName,
        });

        // Filter out disabled or system admin users if necessary
        const activeAssignedUsers = assignedUsers.filter(u => u.username !== 'admin' && u.enabled !== false);

        if (activeAssignedUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete role '${targetRoleName}' because it is assigned to ${activeAssignedUsers.length} user(s) (${activeAssignedUsers.map(u => u.username).join(', ')}).`,
            });
        }

        await kcClient.roles.delByName({
            name: targetRoleName
        })
        res.status(200).json({
            success: true,
            message: `Role '${targetRoleName}' deleted successfully in Keycloak!`,
            role: targetRoleName
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}