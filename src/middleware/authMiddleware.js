import jwt from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(401).json({ 'message': 'Bearer token not provided' })
    const token = authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({ 'message': 'Bearer token is null' })

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ 'message': 'Invalid token' });
        }

        req.user = user
        next()
    })
}
