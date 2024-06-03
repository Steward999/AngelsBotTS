import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { RegisterStepUseCase } from './RegisterStepUseCase';

export class RegisterStepUseCaseImpl implements RegisterStepUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(message: string, userParam: User): Promise<boolean> {
    let existingUser = await this.userRepository.findByPhoneNumber(userParam.phoneNumber);

    if (!existingUser) {
      existingUser = userParam;
    }

    // Lógica para determinar el número de paso a completar
    const stepNumber = 1; // Ejemplo: Asumiendo que se completa el paso 1

    existingUser.addCompletedStep(stepNumber);
    await this.userRepository.save(existingUser);

    return true;
  }
}