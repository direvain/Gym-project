import mongoose from 'mongoose';
import { bool, boolean } from 'yup';

const memberSchema = new mongoose.Schema({
    _id:
    {
        type: Number,
        required: true,
        unique: true
    },
    name: 
    {
        type: String ,
        required: true,
        unique: true
    },
    age:
    {
        type: Number,
        required: true
    },
    weight: 
    {
        type: Number,
        required: true
    },    
    subscriptionDuration: 
    {
            type: Boolean,
    },
    subscriptionStartDate: 
    {
            type: Date,
            required: true
    },
    subscriptionEndDate: 
    {
            type: Date,
            required: true
    },
});

const Members = mongoose.model('Members', memberSchema);


export default Members;

try {
    const sampleMember = new Members(
        {
        _id: 131228142813122814028,
        name: "شسيصيشسيص ي",
        age: 25,
        weight: 12,
        subscriptionDuration: 3,
subscriptionDuration: true,
subscriptionStartDate: new Date(),
subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    }
);
    await sampleMember.save();
    console.log('Sample member inserted into the Members collection');
} catch (error) {
    console.error('Error inserting sample member:', error);
}
