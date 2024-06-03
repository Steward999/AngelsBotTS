import mongoose from "mongoose";

interface Options {
    mongoUrl: string;
    // dbName: string;
}


export class MongoDatabase {

    static connection: mongoose.Connection;

    static async connect(options: Options) {
        // const {dbName, mongoUrl} = options;
        const { mongoUrl } = options;


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
            // MongoDatabase.connection = mongoose.connection;
            // Verificar la conexión exitosa
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
            db.once('connection', () => {
                console.log('Conexión exitosa a MongoDB');
                // Guardar la conexión en la propiedad estática
            });
            MongoDatabase.connection = db;
            
            return true;

        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }

    }



}