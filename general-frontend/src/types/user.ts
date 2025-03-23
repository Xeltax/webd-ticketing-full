export type User = {
    id?: string,
    email: string,
    password: string,
    createdAt: Date,
    role: string,
    firstName?: string | null,
    lastName?: string | null,
    phone?: string | null,
}