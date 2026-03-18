import { envVars } from "../config/env.js"
import { Role, type IAuthProvider, type IUser } from "../modules/user/user.interface.js";
import { User } from "../modules/user/user.model.js"
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!!")
            return;
        }

        console.log("trying to create super admin")

        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND));

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload: IUser = {
            name: "Super Admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVarified: true,
            auths: [authProvider]
        }

        const superadmin = await User.create(payload);
        console.log("super admin created successfully")
        console.log(superadmin)
    } catch (error) {
        console.log(error)
    }
}

