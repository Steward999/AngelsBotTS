import { User } from '../entities/User';

export interface UserRepository {
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  createUser(phoneNumber: string, stepsCompleted: number[]): Promise<User | null>;
  save(user: User): Promise<void>;
  // addPhoneNumber(phoneNumber: string): Promise<boolean>;
  // checkPhoneNumber(phoneNumber: string): Promise<boolean>;
}
