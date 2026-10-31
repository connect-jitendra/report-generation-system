
 // Define role-based permissions for report operations.
 // Each role can access only the actions explicitly assigned to it.
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

// Middleware factory that checks whether a user's role has the required permission.
function authorize(requiredPermission) {
    return (req, res, next) => {

        // Reject requests without an authenticated user.
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: " user not found"
            })
        }

        const { role } = req.user;
        const permission = rolePermissions[role] ?? [];

        // Block access when the user's role lacks the required permission.
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
