/* eslint-disable @typescript-eslint/no-explicit-any */
import passport, { type Profile } from "passport";
import { Strategy as GoogleStrategy, type VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env.js";
import { User } from "../modules/user/user.model.js";
import { Role } from "../modules/user/user.interface.js";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";


passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email });

            // if (!isUserExist) {
            //     return done(null, false, { message: "User does not exists!!" })
            // }
            if (!isUserExist) {
                return done("User does not exits!!")
            }

            const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider === "google");

            if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { message: "You have authenticated with google, if you want to login with credential then at first login with google then set a password. Then you can log in with email and password" })
            }

            const isPasswordMatched = await bcrypt.compare(
                password as string,
                isUserExist.password as string,
            );

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password does not match!!" })
            }

            return done(null, isUserExist)

        } catch (error) {
            console.log(error);
            done(error);
        }
    })
)

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(null, false, { message: "No email found!!" })
                }
                let user = await User.findOne({ email })

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0]?.value as string,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]

                    })
                }
                return done(null, user)
            } catch (error) {
                console.log("Google strategy error", error);
                return done(error);
            }
        }

    )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error)
        done(error)
    }
})