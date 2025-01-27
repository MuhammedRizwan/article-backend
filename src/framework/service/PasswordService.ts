import bcrypt from 'bcryptjs';


const saltRounds = parseInt(process.env.SALT_ROUNDS as string)

export default class PasswordService {

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
