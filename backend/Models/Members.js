import mongoose from 'mongoose';
import { bool, boolean } from 'yup';
const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },    
    phoneNumber: {
        type: String,
        unique: true
    },
    subscriptionDurationStart: {
        type: String,
        required: true
    },
    subscriptionDurationEnd: {
        type: String,
        required: true
    },
    qrCodeValue:{
        type: String,
        required: true,
        unique: true
    }
});

const Members = mongoose.model('Members', memberSchema);


export default Members;

