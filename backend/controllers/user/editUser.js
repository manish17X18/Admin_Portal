const { getAdminClient } = require('../../config/database');
const getTargetRealm=require('../realms/helper')

exports.editUser = async (req, res) => {
    try {
        const kcClient = await getAdminClient();
        const realm = getTargetRealm(req);
        const userId = req.params.userId || req.body.id;
        const { phNo, role } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        //fetch the user by ID
        let userExist = null;
        try {
            userExist = await kcClient.users.findOne({ id: userId })
        } catch (error) {
            userExist = null
        }

        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "User Not found.",
            });
        }

        await kcClient.users.update(
            { id: userId },
            {
                email: userExist.email,
                firstName: userExist.firstName,
                lastName: userExist.lastName,
                enabled: userExist.enabled,
                attributes: {
                    ...userExist.attributes,
                    phoneNumber: phNo ? [phNo] : [],
                }
            }
        )

        //update role
        if (role && role.trim()) {
            const currentRoleMappings = await kcClient.users.listRealmRoleMappings({ id: userId })
            //filter out the role so we don't choose them
            const customRolesToRemove = currentRoleMappings.filter(
                (r) => !r.name.startsWith('default-roles') && r.name !== 'offline_access' && r.name !== 'uma_authorization'
            );

            //remove previous role
            if (customRolesToRemove.length > 0) {
                await kcClient.users.delRealmRoleMappings({
                    id: userId,
                    roles: customRolesToRemove,
                });
            }

            const newRoleObj = await kcClient.roles.findOneByName({ name: role });
            if (newRoleObj) {
                await kcClient.users.addRealmRoleMappings({
                    id: userId,
                    roles: [{ id: newRoleObj.id, name: newRoleObj.name }],
                });
            }
        }
        const displayName =
            userExist.firstName
                ? `${userExist.firstName} ${userExist.lastName || ''}`.trim()
                : (userExist.username || 'User');

        return res.status(200).json({
            success: true,
            message: `${displayName} updated successfully!`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while editing the user.",
            error: error.message,
        });
    }
}