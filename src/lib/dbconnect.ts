import mongoose from "mongoose";

type DbConnection = {
    isConnected: boolean;
}

const connection: DbConnection = {
    isConnected: false
};

async function dbConnect():Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = true;
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        connection.isConnected = false;
        process.exit(1);
    }
}


export default dbConnect;