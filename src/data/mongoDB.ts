import mongoose from "mongoose";

interface Options {
    mongoUrl: string;
    // dbName: string;
}


export class MongoDatabase {


    static async connect(options: Options){

        // const {dbName, mongoUrl} = options;
        const {mongoUrl} = options;

 console.log(mongoUrl);
 
        try {

            await mongoose.connect(mongoUrl, {
                dbName: "AngelsBot",
                
                // family: 4,
            })
            // mongoose.connect("mongodb://localhost:27017/myStore",{
            //     family: 4
            // })
            // .then(() => {
            //         console.log("Conexion Exitosa a la Base de Datos");

            // });

            console.log('Mongo Connected');
             // Seleccionar la base de datos y la colección
            
            return true;

        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }

    }


}