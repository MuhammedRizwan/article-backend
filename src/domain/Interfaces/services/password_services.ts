
export default interface password_service {
    hashPassword(password: string): Promise<string>
    comparePassword(password: string, hashedPassword: string): Promise<boolean>
}