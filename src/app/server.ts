import { Server } from "http";
import mongoose from "mongoose"
import app from "./app.js";

let server: Server;


const startServer = async () => {
    const dns = await import('node:dns');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    try {
        await mongoose.connect('mongodb+srv://tourDB:wQ7bhBYlS0G6iiV0@cluster0.kpht8.mongodb.net/?appName=Cluster0')

        console.log("Connected to database!!");

        server = app.listen(5000, () => {
            console.log("server is runnig at port 5000")
        })
    } catch (error) {
        console.log(error)
    }
}

startServer();

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


