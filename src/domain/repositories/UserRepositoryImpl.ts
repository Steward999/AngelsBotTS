import { UserRepository } from './UserRepository';
import { User } from '../entities/User';
// import { MongoDatabase } from '../../data/mongoDB';
import { Schema, model } from 'mongoose';

// const mongoose = MongoDatabase.getMongoose();

// Definición del esquema de usuario
const userSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  stepsCompleted: [Number],
  chosenApp: { type: String, require: false },
  steps: [String],
  formStepNumber: { type: Number, required: false }
});

const UserModel = model('User', userSchema);

export class UserRepositoryImpl implements UserRepository {
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ phoneNumber });
    if (!userDocument) {
      return null;
    }

    // Ensure chosenApp is a string or undefined
    const chosenApp = userDocument.chosenApp ? userDocument.chosenApp : undefined;
    const steps = userDocument.steps ? userDocument.steps : [];
    const formStepNumber = userDocument.formStepNumber ?? undefined;
    return  new User(userDocument.phoneNumber, userDocument.stepsCompleted, chosenApp, steps, formStepNumber);
  }

  async createUser(phoneNumber: string, stepsCompleted: number[]): Promise<User | null> {
    const newUser = new UserModel({ phoneNumber, stepsCompleted });
    const savedUser = await newUser.save();
    return savedUser ? new User(savedUser.phoneNumber, savedUser.stepsCompleted) : null;
  }

  async save(user: User): Promise<void> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { phoneNumber: user.phoneNumber },
        {
          $set: {
            stepsCompleted: user.stepsCompleted,
            chosenApp: user.chosenApp,
            steps: user.steps,
            formStepNumber: user.formStepNumber
          }
        },
        { new: true, upsert: true } // new: true devuelve el documento actualizado, upsert: true crea un nuevo documento si no existe
      );

      console.log("Usuario actualizado o creado: ", updatedUser);


    } catch (error) {
      console.error("Error al guardar el usuario: ", error);
      throw new Error("Error al guardar el usuario");
    }

  }
}