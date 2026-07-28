const keycloakAdminClient=require('@keycloak/keycloak-admin-client').default
require('dotenv').config()

const kcAdminClient=new keycloakAdminClient({
    baseUrl:process.env.KEYCLOAK_URL,
    realmName: process.env.KEYCLOAK_REALM,
})

const getAdminClient=async ()=>{
    try {
        await kcAdminClient.auth({
            username: process.env.KEYCLOAK_ADMIN_USER,    
            password: process.env.KEYCLOAK_ADMIN_PASSWORD,
            grantType:'password',   
            clientId:'admin-cli',  //client name or id
            realmName: 'master'
        });
        return kcAdminClient;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports={getAdminClient}