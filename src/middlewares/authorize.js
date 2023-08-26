const roles = require('../../config/role');

module.exports = async (req, res, next) => {
    const role = roles[req.user.roleCode];
    req.role = role;

    current = req.path;
    if (role.role === 'god') {
        // god mode
        next();
    } else {
        if (role.permissions) {
            const value = Object.keys(role.permissions).find((key) => current.startsWith(key));
            if (value) {
                if (role.permissions[value].includes('ALL') || role.permissions[value].includes(req.method)) {
                    next();
                } else {
                    res.send('Not authorized');
                }
            } else {
                res.send('Not authorized');
            }
        } else {
            const value = Object.keys(role.notPermissions).find((key) => current.startsWith(key));
            if (value) {
                if (role.notPermissions[value].includes('ALL') || role.notPermissions[value].includes(req.method)) {
                    res.send('Not authorized');
                } else {
                    next();
                }
            } else {
                next();
            }
        }
    }
};
