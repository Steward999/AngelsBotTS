export class User {
    public phoneNumber: string;
    public stepsCompleted: number[];
    public chosenApp?: string;
    public steps?: string[];
    public formStepNumber?: number;

  
    constructor( phoneNumber: string, stepsCompleted: number[], chosenApp?: string, steps?: string[], formStepNumber?: number) {
      this.phoneNumber = phoneNumber;
      this.stepsCompleted = stepsCompleted;
      this.chosenApp = chosenApp;
      this.steps = steps;
      this.formStepNumber = formStepNumber;
    }
  
    public addCompletedStep(stepNumber: number): void {
      if (!this.stepsCompleted.includes(stepNumber)) {
        this.stepsCompleted.push(stepNumber);
      }
    }
  
    public hasCompletedStep(stepNumber: number): boolean {
      return this.stepsCompleted.includes(stepNumber);
    }

    // Nuevo método para establecer la aplicación elegida
  public setChosenApp(appName: string, steps: string[], formStepNumber?: number | undefined): void {
    if (this.chosenApp) {
      throw new Error(`Linda ya has elegido registrarte en la app: ${this.chosenApp}, solo puedes registrarte en una app`);
    }
    this.chosenApp = appName;
    this.steps = steps;
    if (formStepNumber !== undefined) {
      this.formStepNumber = formStepNumber;
    }
  }

  // Método para obtener la aplicación elegida
  public getChosenApp(): string | undefined {
    return this.chosenApp;
  }
  }
  