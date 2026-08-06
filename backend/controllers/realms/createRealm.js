const { getAdminClient } = require('../../config/database');

exports.createRealm = async (req, res) => {
    try {
        const { realmName } = req.body;

        if (!realmName || !realmName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Realm name is required.",
            });
        }

        const formattedRealmName = realmName.trim().toLowerCase();
        const kcClient = await getAdminClient();

        // 1. Check if the realm already exists
        const existingRealms = await kcClient.realms.find();
        const realmExists = existingRealms.some(
            (r) => r.realm.toLowerCase() === formattedRealmName
        );

        if (realmExists) {
            return res.status(400).json({
                success: false,
                message: `Realm '${formattedRealmName}' already exists in Keycloak.`,
            });
        }

        // 2. Create the new Realm in Keycloak
        await kcClient.realms.create({
            realm: formattedRealmName,
            enabled: true,
            displayName: realmName.trim(),
        });

        return res.status(201).json({
            success: true,
            message: `Realm '${formattedRealmName}' created successfully!`,
            realm: formattedRealmName,
        });
    } catch (error) {
        console.error("FULL KEYCLOAK CREATE REALM ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create realm in Keycloak",
            error: error.responseData?.errorMessage || error.message || error,
        });
    }
};