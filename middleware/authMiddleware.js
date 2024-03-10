import jwt from "jsonwebtoken";
import prisma from "../db/db.config.js";
import expressAsyncHandler from "express-async-handler";

const authMiddleware = expressAsyncHandler(async (req,res,next) => {
    let token 

    token = req.cookies.jwt;

    if (token) {
        try {
            console.log(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await prisma.user.findUnique({ where: { id: decoded.userId } })
            next()
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    } else {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})

const isAdmin = expressAsyncHandler(async (req,res,next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error("Not authorized as an admin")
    }
})

export { authMiddleware, isAdmin };