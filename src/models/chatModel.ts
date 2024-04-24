import mongoose, {Schema, SchemaType} from "mongoose";


const MensajeSchema = new Schema({

    de:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    para:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    mensaje:{
        type:String,
        required: true
    }


},{
    timestamps: true,
});




export const MensajeModel = mongoose.model('Mensaje', MensajeSchema);