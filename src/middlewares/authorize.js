const rolePermissions = {
    admin: [
        "report:create",
        "report:view",
        "report:download",
        "report:cancel",
        "report:view_all"
    ],

    manager: [
        "report:create",
        "report:view",
        "report:download",
        "report:cancel"
    ],

    user: [
        "report:create",
        "report:view",
        "report:download"
    ]
};

function authorize(requiredPermission) {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: " user not found"
            })
        }
        const { role } = req.user;

        const permission = rolePermissions[role] ?? [];

        if (!permission.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                message: "you are not authorized"
            })
        }
        next();
    }
}


export default authorize;