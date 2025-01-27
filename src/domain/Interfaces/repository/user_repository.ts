import User from "../../entities/User"


export default interface user_repository {
    createUser(user: Partial<User>): Promise<User>
    findUserByEmail(email: string): Promise<User | null>
    findUserByPhone(phone: string): Promise<User | null>
    findUserById(userId: string): Promise<User | null>
    findUserAndUpdate(userData: User): Promise<User | null>
}