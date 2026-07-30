const { getAdminClient } = require('../../config/database');

exports.createAdmin = async (req, res) => {
    try {
        const kcClient = await getAdminClient();
        const { name, email, phNo, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
            });
        }

        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Check if admin already exists
        const existingUsers = await kcClient.users.find({ email: email.trim() });
        if (existingUsers && existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: `User with email '${email}' already exists.`,
            });
        }

        //  Create admin WITHOUT Credentials first (to avoid policy crashes)
        const createdUser = await kcClient.users.create({
            username: email.trim(),
            email: email.trim(),
            firstName: firstName,
            lastName: lastName,
            enabled: true,
            emailVerified: true,
            attributes: {
                phoneNumber: phNo ? [phNo.toString().trim()] : [],
            },
        });

        // Resolve ID safely
        let newUserId = createdUser?.id;
        if (!newUserId) {
            const found = await kcClient.users.find({ email: email.trim() });
            if (found && found.length > 0) newUserId = found[0].id;
        }

        if (!newUserId) {
            return res.status(500).json({
                success: false,
                message: "Could not retrieve created user ID from Keycloak.",
            });
        }

        //Set Password using resetPassword (handles Keycloak policy cleanly)
        try {
            await kcClient.users.resetPassword({
                id: newUserId,
                credential: {
                    type: 'password',
                    value: password,
                    temporary: false,
                },
            });
        } catch (passError) {
            console.error("Keycloak Password Error:", passError.response?.data || passError);
            
            // If password setting fails, delete the created incomplete user so you don't leave orphaned users
            await kcClient.users.del({ id: newUserId });

            const policyMessage = passError.response?.data?.errorMessage || "Password does not meet Keycloak password policy requirements.";
            return res.status(400).json({
                success: false,
                message: policyMessage,
            });
        }

        // 4. Assign 'admin' Role
        const adminRoleObj = await kcClient.roles.findOneByName({ name: 'admin' });
        if (adminRoleObj) {
            await kcClient.users.addRealmRoleMappings({
                id: newUserId,
                roles: [{ id: adminRoleObj.id, name: adminRoleObj.name }],
            });
        }

        return res.status(201).json({
            success: true,
            message: `Admin '${name}' created successfully!`,
            adminId: newUserId,
        });

    } catch (error) {
        console.error("Error creating admin:", error.response?.data || error.message);

        const safeErrorMessage =
            error.response?.data?.errorMessage ||
            error.response?.data?.error ||
            error.message ||
            "Failed to create admin";

        return res.status(500).json({
            success: false,
            message: safeErrorMessage,
        });
    }
};