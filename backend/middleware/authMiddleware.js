const jwt = require('jsonwebtoken');

// Verify JWT and attach user info to request
const requireAuth = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({error: 'Unauthorized access, no token provided'});
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.userId,
            userName: decoded.userName
        };
        next(); // Proceed to the next middleware or route handler
    } catch(error){
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}

module.exports = requireAuth; 