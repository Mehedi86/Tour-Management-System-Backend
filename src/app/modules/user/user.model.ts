import { model, Schema } from "mongoose";
import { isActive, Role, type IAuthProvider, type IUser } from "./user.interface.js";

const authProviderSchema = new Schema<IAuthProvider>(
    {
        provider: { type: String, required: true },
        providerId: { type: String, required: true }
    },
    {
        versionKey: false,
        _id: false
    })

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER
        },
        phone: { type: String },
        picture: { type: String },
        address: { type: String },
        isDeleted: { type: String, default: false },
        isActive: {
            type: String,
            enum: Object.values(isActive),
            default: isActive.ACTIVE
        },
        isVarified: { type: Boolean, default: false },
        auths: [authProviderSchema],
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export const User = model<IUser>("User", userSchema);