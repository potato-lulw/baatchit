export interface UserType {
    _id: string;
    name: string;
    email: string;
    avatar?: string | null;
    createdAt: Date;
    updatedAt: Date;
} 

export interface LoginType {
    email: string;
    password: string;
}

export interface RegisterType {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}