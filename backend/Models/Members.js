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
    subscriptionDuration: {
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

// try {
//     const sampleMember = new Members(
//         {
//         name: "asdw",
//         age: 25,
//         weight: 12,
//         phoneNumber: "0777211590",
//         subscriptionDuration: "2025/3/2 - 2025/5/2",
//         qrCodeValue: "123"
//     }
// );
//     await newplayer.save();
//     console.log('Sample member inserted');
// } catch (error) {
//     console.error('Error inserting sample member:', error);
// }
