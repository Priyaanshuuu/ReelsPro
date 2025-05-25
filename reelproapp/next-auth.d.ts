import {DefalulSession} from "next-auth";

declare module "next-auth"{
    interface Session{
        user: {
            id: string;
        } & DefalulSession["user"];
    }
}

// whenever user log in sessions are created which holds the user information.
// The need of this code is to extend the default session type provided by NextAuth.js.
// default sesson means the session object that NextAuth.js provides after a user logs in.