const { getAdminClient } = require('../../config/database')

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
        const kcClient = await getAdminClient()
        let targetRole = null;
        try {
            targetRole = await kcClient.roles.findOneByName({
                realm: process.env.KEYCLOAK_REALM,
                name: role.trim(), // e.g. "teacher", "student", or lowercase matching your realm setup
            });
        } catch (err) {
            console.error(`Role search failed for: ${role}`);
        }

        if (!targetRole) {
            return res.status(400).json({
                success: false,
                message: `Role '${role}' does not exist in Keycloak. Please check spelling or create the role first.`
            });
        }
        //send the data to keycloak it will directly store it into 
        const newUser = await kcClient.users.create({
            realm: process.env.KEYCLOAK_REALM,
            username: email,
            email: email,
            enabled: true,
            firstName: name,
            attributes: {
                phoneNumber: [String(phNo)] // Saves directly on creation
            }
        })
        
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