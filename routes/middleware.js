import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    console.log("Verifing...");
    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
        return res.status(403).send("A token is required for authentication");
    }

    // Verifica se l'header Authorization è nel formato "Bearer token"
    const tokenParts = authorizationHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
        return res.status(403).send("Invalid Authorization header format");
    }

    const token = tokenParts[1];

    console.log(process.env.JWT_KEY)

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};
