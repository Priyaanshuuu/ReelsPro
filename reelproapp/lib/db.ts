import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

if(!MONGO_URL) {
  throw new Error("Please define the mongo url in the .env file");
}

let cached = global.mongoose;

if(!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: true,// This code is used to handle the request to the database when the connection is not established
            maxPoolSize: 10,// This code is used to limit the number of connections with the database at a time
        };
        cached.promise = mongoose
        .connect(MONGO_URL, opts)
        .then(()=>mongoose.connection);
    }

    try{
        cached.conn = await cached.promise;
    }catch(e){
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
