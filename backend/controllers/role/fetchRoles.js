const {getAdminClient}=require('../../config/database');
require('dotenv').config();
exports.getRoles=async(req,res)=>{
    try {
        const kcClient=await getAdminClient();

        //fetch all roles
        const allRoles=await kcClient.roles.find()
        // console.log("Raw Keycloak Roles fetched:", allRoles);

        // filter out Keycloak default system roles
        const customRoles = allRoles
            .filter(role => 
                !role.name.startsWith('default-roles') && 
                role.name !== 'offline_access' && 
                role.name !== 'uma_authorization'
            )
            .map(role => ({
                id: role.id,
                name: role.name,
                description: role.description || ''
            }));

        return res.status(200).json({
            success: true,
            roles: customRoles,
        });

    } catch (error) {
        console.error('Error fetching roles from Keycloak:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch roles from Keycloak',
            error: error.message
        });
    }
}