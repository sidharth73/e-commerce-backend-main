import prisma from "../db/db.config.js";
import { registerSchema, loginSchema } from "../validator/authValidator.js";
import vine,{errors} from "@vinejs/vine";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import createPasswordResetToken from "../utils/createPasswordResetToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

class AuthContoller {
    static registerUser = expressAsyncHandler(async (req,res) => {
            const { name, email, password } = req.body;
            const body = req.body;
            const emailExsist = await prisma.user.findUnique({
                where: { email }
            });

            if (emailExsist) {
                return res.status(400).json({ message: "user already exists" });
            }

            // const validator = vine.compile(registerSchema);
            // const payload = await validator.validate(body);
            var salt = bcrypt.genSaltSync(10);
            var hpass = bcrypt.hashSync(password, salt);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hpass 
                }
            });

            if (user) {
                generateToken(res, user.id)
                res.status(201)
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                })
            } else {
                res.status(400)
                throw new Error("Invalid user Credentials")
            }
         }
    )

    static loginUser = expressAsyncHandler(async (req,res) => {
            const { email, password } = req.body;
            // const validator = vine.compile(loginSchema);
            // const payload = await validator.validate(body);
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
    
            const pass = bcrypt.compareSync(password, user.password)
    
            if (!user || !pass) {
                res.status(401)
                throw new Error("Invalid email or password");
            }      

            generateToken(res, user.id);
            
            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            });
    });

    static updateUserProfile = expressAsyncHandler(async (req, res) => {
        const user = await prisma.user.findUnique({ where: { id: req.body.id } });

        if (user) {
            let name = req.body.name || user.name
            let email = req.body.email || user.email

            if(req.body.password) {
                let password = req.body.password
                const uuser = await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        name,
                        email,
                        password
                    }
                })

                return res.status(200).json({
                    id: uuser.id,
                    name: uuser.name,
                    email: uuser.email
                })
            }
            
            const uuser = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    name,
                    email
                }
            });

            return res.status(200).json({
                id: uuser.id,
                name: uuser.name,
                email: uuser.email
            });
        } else {
            res.status(404)
            throw new Error("User not Found")
        }
    })

    static logoutUser = expressAsyncHandler(async (req, res) => {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).json({
            message: "Logged Out Successfully"
        })
    })

    static forgotPassword = expressAsyncHandler(async (req,res) => {
        const { email } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        if (!user) {
            res.status(404)
            throw new Error("User not Found")
        }

        const resetToken = await createPasswordResetToken(email);
        const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`
        const message = `Forgot Password? Click on this this link to reset your Password: ${resetUrl}`
        try {
            await sendEmail({
                email: user.email,
                subject: "Your Password reset token. (valid for 10mins)",
                message
            })

            res.status(200).json({
                message: "Token sent to email!"
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "There was an error in sending the email. Please Try again later"
            })
        }
    })

    static resetPassword = expressAsyncHandler(async (req,res) => {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.resetToken)
            .digest("hex")
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken
            }
        })

        if (!user) {
            return res.status(400).json({
              status: "fail",
              message: "Token is invalid or has expired",
            })
          }

        const expired = user.passwordResetExpires < Date.now();
        if (expired) {
            return res.status(400).json({
              status: "fail",
              message: "Token is invalid or has expired",
            })
        }

        var salt = bcrypt.genSaltSync(10);
        var hpass = bcrypt.hashSync(req.body.password, salt);
        await prisma.user.update({
            where: { email: user.email },
            data: { 
                password: hpass,
                passwordResetToken: null,
                passwordResetExpires: null
            }
        })

        generateToken(res, user.id)

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          })
    })
}

export default AuthContoller;