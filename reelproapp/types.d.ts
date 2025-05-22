import {Connection} from "mongoose";

declare global{
    let mongoose:{
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}

export {}

// here promise means is to ensure that the connection to the database is established only once and reused for subsequent requests. This is important for performance and resource management, especially in a serverless environment where multiple instances of the application may be running concurrently. By caching the connection, the code avoids the overhead of creating a new connection for each request, which can lead to increased latency and resource consumption.


// The global variable is used to store the connection to the database and the promise that resolves when the connection is established. This is done to avoid creating multiple connections to the database when the application is running in development mode. The code checks if the connection already exists, and if it does, it returns the existing connection. If not, it creates a new connection and stores it in the global variable.


 

