const { getAdminClient } = require('../../config/database');
const getTargetRealm=require('../realms/helper')

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User Id not found"
            })
        }
        const realm = getTargetRealm(req);
        const kcClient = await getAdminClient();
        await kcClient.users.del({
            id: id,
            realm: realm,//delete from this realm
        });

        return res.status(200).json({
            success: true,
            message: `User with ID '${id}' deleted successfully from Keycloak.`,
        });

    } catch (error) {
        console.error('FULL KEYCLOAK DELETE ERROR:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}