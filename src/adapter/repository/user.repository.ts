import UserModel from '../database/user.model';
import User from '../../domain/entities/User';

export default class UserRepository {

    async createUser(user: any): Promise<User> {
        try {
            const newUser = await UserModel.create(user);
            return newUser;
        } catch (error) {
            throw error
        }
    }
    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const data = await UserModel.findOne({ email })
            return data
        } catch (error) {
            throw error
        }
    }
    async findUserByPhone(phone: string): Promise<User | null> {
        try {
            const data = await UserModel.findOne({ phone })
            return data
        } catch (error) {
            throw error
        }
    }
    async findUserById(userId: string): Promise<User | null> {
        try {
            const user = await UserModel.findById(userId);
            return user
        } catch (error) {
            throw error
        }
    }
    async findUserAndUpdate(userData: User): Promise<User | null> {
        try {
            const user = await UserModel.findByIdAndUpdate(
                userData._id,
                userData,
                { new: true }
            );
            return user
        } catch (error) {
            throw error
        }
    }




}