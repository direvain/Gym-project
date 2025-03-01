import express from 'express';
import Members from '../Models/members.js';

const MembersRouter = express.Router();

MembersRouter.get('/NewSubscription', async (req, res) => {
    try {
        const members = await Members.find();
        res.json(members);
    } catch (err) {
        res.json({ message: err });
    }
});


export default MembersRouter;