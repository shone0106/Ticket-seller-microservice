import { UserModel } from "../../src/user/user.model";

export interface Payload {
    id: string;
    email: string;
}

declare global{
    namespace Express {
        interface Request {
            user?: Payload
        }
    }
}