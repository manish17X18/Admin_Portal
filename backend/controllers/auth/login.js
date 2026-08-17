const { getAdminClient } = require('../../config/database');
const axios = require('axios');

exports.login = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body; // 1. Extract captchaToken

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // 2. Validate captcha Token
        // if (!captchaToken) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "reCAPTCHA verification token is missing.",
        //     });
        // }

        // 3. Verify captcha Token with Google

        // const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
        // const googleRes = await axios.post(googleVerifyUrl);

        // if (!googleRes.data?.success) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "reCAPTCHA verification failed. Please try again.",
        //     });
        // }

        const kcClient = await getAdminClient();

        // Fetch user by email to check if they exist
        const users = await kcClient.users.find({ email: email.trim() });
        const userExists = users[0];

        if (!userExists) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized Access: Admin Not found. Check Readme for more details.",
            });
        }

        // Verify if the user has the 'admin' realm role
        const roleMappings = await kcClient.users.listRealmRoleMappings({ id: userExists.id });
        const isUserAdmin = roleMappings.some((r) => r.name.toLowerCase() === 'admin');

        if (!isUserAdmin) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized Access: Only administrators are allowed to log in.",
            });
        }

        // Validate Password via Keycloak Direct Grant (Token Endpoint)
        const tokenUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

        const params = new URLSearchParams();
        params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || 'admin-cli');
        if (process.env.KEYCLOAK_CLIENT_SECRET) {
            params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
        }
        params.append('grant_type', 'password');
        params.append('username', userExists.username);
        params.append('password', password);

        let tokenResponse;
        try {
            tokenResponse = await axios.post(tokenUrl, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
        } catch (authError) {
            console.log("KEYCLOAK AUTH ERROR:", authError.response?.data);

            return res.status(401).json({
                success: false,
                message: authError.response?.data || authError.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token: tokenResponse.data.access_token,
            user: {
                id: userExists.id,
                name: `${userExists.firstName || ''} ${userExists.lastName || ''}`.trim() || userExists.username,
                email: userExists.email,
                role: 'admin',
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};