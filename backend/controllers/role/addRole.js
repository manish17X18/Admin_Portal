const {getAdminClient} = require('../../config/database')
exports.createRole = async (req, res) => {
    try {
        const {role,description}=req.body;
        if(!role || !role.trim()){
            return res.status(400).json({
                success:false,
                message:"Fill role",
            })
        }
        const kcClient=await getAdminClient();
        const roleName = role.trim();

        let roleExists=null;
        try {
            roleExists=await kcClient.roles.findOneByName({
                name:roleName
            })
        } catch (error) {
            roleExists = null;
        }
        if(roleExists){
            return res.status(400).json({
                success:false,
                message:"Role Exists",
            })
        }

        await kcClient.roles.create({
            name:roleName,
            description:description||"",
        })

        res.status(201).json({
            success: true,
            message: `Role '${role}' created successfully in Keycloak!`,
            role:role
        });
    } catch (error) {
        console.error('FULL KEYCLOAK CREATE ROLE ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to create role in Keycloak',
            error: error.responseData?.errorMessage || error.message || error
        });
    }
}