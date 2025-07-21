import jwt  from "jsonwebtoken"
import 'dotenv/config'


export function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization
    const token  =  authHeader && authHeader.split(" ")[1]
    if(!token){
        return res.status(401).json({message : "Unauthorized"})
    }

    const key = Buffer.from(process.env.CLERK_PUBLIC_JWT, 'base64').toString();
    const decoded = jwt.verify(token , key)
    if(!decoded){
        return res.status(401).json({message : "Unauthorized"})
    }
    req.userID = decoded.sub
    next()
}