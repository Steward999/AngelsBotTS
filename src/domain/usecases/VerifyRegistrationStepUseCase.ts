import { User } from '../entities/User';

export interface VerifyRegistrationStepUseCase {
  execute(message: string, userParam: User): Promise<boolean>;
}