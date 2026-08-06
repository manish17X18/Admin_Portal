const { getAdminClient } = require('../../config/database')
const getTargetRealm=require('../realms/helper')

exports.createUser = async (req, res) => {
    try {
        //fetch the data
        const { name, email, phNo, role } = req.body;
        if (!name || !email || !phNo || !role) {
            console.log("All fields are necessary");
            return res.status(400).json({
                success: false,
                message: "All fields are necessary"
            })
        }
        console.log(req.body.phNo)
        const realm=getTargetRealm(req)
        const kcClient = await getAdminClient()
        let targetRole = null;
        try {
            targetRole = await kcClient.roles.findOneByName({
                realm:realm,
                name: role.trim(), // e.g. "teacher", "student", or lowercase matching your realm setup
            });
        } catch (err) {
            //if it does not find the role it will throw an error and we will catch it here
            console.error(`Role search failed for: ${role}`);
        }
        //role not created by admin yet 
        if (!targetRole) {
            return res.status(400).json({
                success: false,
                message: `Role '${role}' does not exist in Keycloak. Please check spelling or create the role first.`
            });
        }
        //send the data to keycloak it will directly store it into 
        const newUser = await kcClient.users.create({
            realm: realm,
            username: email,
            email: email,
            enabled: true,
            firstName: name,
            attributes: {
                phoneNumber: [String(phNo)] // Saves directly on creation
            }
        })
        
        //used to assign the role to the user
        await kcClient.users.addRealmRoleMappings({
            realm:realm,
            id: newUser.id,
            roles: [
                {
                    id: targetRole.id,
                    name: targetRole.name,
                },
            ],
        });
        res.status(201).json({
            success: true,
            message: `User '${name}' created successfully in Keycloak!`,
            userId: newUser.id,
        });

    } catch (error) {
        console.error('FULL KEYCLOAK ERROR:', error);

        return res.status(500).json({
            error: 'Failed to create user in Keycloak',
            message:error.message 
        });
    }
}