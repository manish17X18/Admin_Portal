const getTargetRealm = (req) => {
    return req.query.realm || req.headers['x-realm'] || process.env.KEYCLOAK_REALM_USER || 'master';
};

module.exports = getTargetRealm;