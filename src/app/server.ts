import { Server } from "http";
import mongoose from "mongoose"
import app from "./app.js";
import { envVars } from "./config/env.js";
import { seedSuperAdmin } from "./utils/seedSuperAdmin.js";

let server: Server;


const startServer = async () => {
    const dns = await import('node:dns');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    try {
        console.log(envVars.NODE_ENV)
        await mongoose.connect(envVars.DB_URL)

        console.log("Connected to database!!");

        server = app.listen(envVars.PORT, () => {
            console.log(`server is runnig at port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await startServer()
    await seedSuperAdmin()
})()

// handle unhandle rejection error
process.on("unhandledRejection", (err) => {
    console.log("UnhandledRejection detected... server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// handle uncaught exeption error
process.on("uncaughtExeption", (err) => {
    console.log("uncaught exeption detected... server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// sigterm
process.on("SIGTERM", (err) => {
    console.log("SIGTERM signal received... server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

// sigint
process.on("SIGINT", (err) => {
    console.log("SIGINT signal received... server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})


// throw new Error("I fortgot to handle local error")


