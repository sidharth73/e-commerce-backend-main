import prisma from "../db/db.config.js";
import crypto from "crypto";

const createPasswordResetToken =  async (email) => {
    const resetToken = crypto.randomBytes(32).toString("hex")
    const pt = crypto.createHash("sha256").update(resetToken).digest("hex")
    await prisma.user.update({
        where: { email },
        data: { 
            passwordResetToken: pt,
            passwordResetExpires: new Date(new Date().getTime() + 3600 * 1000)
        }
    });
    
    return resetToken;
}

export default createPasswordResetToken;