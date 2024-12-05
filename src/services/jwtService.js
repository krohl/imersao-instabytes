import jwt from "jsonwebtoken";

export default function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            nickname: user.nickname,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "5h",
        }
    );
}
