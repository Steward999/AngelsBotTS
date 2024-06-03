import { User } from '../entities/User';

export interface RegisterStepUseCase {
  execute(message: string, userParam: User): Promise<boolean>;
}