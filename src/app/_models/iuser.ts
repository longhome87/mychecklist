export class IUser {
    id: string;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email?: string;
    token: string;
    role: string;
    classes?: Array<object>;
    useShortName?: boolean;
    language?:boolean
}