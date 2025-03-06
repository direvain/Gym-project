import express from 'express';
import MembersModel from '../Models/Members.js';
import bodyParser from "body-parser";
import cors from 'cors';
import Members from '../Models/Members.js';


const app = express();
const MembersRouter = express.Router();
app.use(express.json()); // Parse JSON request bodies
MembersRouter.use(cors({ // for receive api from front end 
    origin: 'http://localhost:3000', // Your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204
}));  

function arabicToNumber(text) 
{
    const arabicMap = 
    {
        'ا': 1, 'ب': 2, 'ت': 3, 'ث': 4, 'ج': 5, 'ح': 6, 'خ': 7, 'د': 8, 'ذ': 9, 'ر': 10,
        'ز': 11, 'س': 12, 'ش': 13, 'ص': 14, 'ض': 15, 'ط': 16, 'ظ': 17, 'ع': 18, 'غ': 19, 'ف': 20,
        'ق': 21, 'ك': 22, 'ل': 23, 'م': 24, 'ن': 25, 'ه': 26, 'و': 27, 'ي': 28, ' ': 0
    };

    return text.split('')
    .map(char => arabicMap[char] !== undefined ? arabicMap[char] : '')
    .join('');
}
function getAdjustedDate(year , month, day) 
{
    year += Math.floor((month - 1) / 12); // Adjust year if month > 12
    month = ((month - 1) % 12) + 1; // Wrap month around to 1-12
    return `${year}/${month}/${day}`;
}
const date = new Date();
const year = date.getFullYear(); // Get the full year (e.g., 2025)
const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
const day = date.getDate(); // Get the day of the month (1-31)

const oneMonthEnd = getAdjustedDate(year, month + 1, day); // 1 month later
const twoMonthsEnd = getAdjustedDate(year, month + 2, day); // 2 months later
const threeMonthsEnd = getAdjustedDate(year, month + 3, day); // 3 months later
const sixMonthsEnd = getAdjustedDate(year, month + 6, day); // 6 months later
const oneYearEnd = getAdjustedDate(year + 1, month, day); // 1 year later 

MembersRouter.post("/addPlayer", async (req, res) => 
{
    try 
    {
        const receivedData = req.body; // receive json file
        // set subscriptionDuration
        if      ( receivedData.subscriptionDuration == 1){receivedData.subscriptionDuration= `${year}/${month}/${day} - ${oneMonthEnd}`     ;}
        else if ( receivedData.subscriptionDuration == 2){receivedData.subscriptionDuration= `${year}/${month}/${day} - ${twoMonthsEnd}`    ;}
        else if ( receivedData.subscriptionDuration == 3){receivedData.subscriptionDuration= `${year}/${month}/${day} - ${threeMonthsEnd}`  ;}
        else if ( receivedData.subscriptionDuration == 6){receivedData.subscriptionDuration= `${year}/${month}/${day} - ${sixMonthsEnd}`    ;}
        else                                             {receivedData.subscriptionDuration= `${year}/${month}/${day} - ${oneYearEnd}`      ;}
        receivedData.id = ('direvain'+(arabicToNumber(receivedData.playerName))) + date.getTime(); // create value for qr Code

        try
            {
                const newplayer= new MembersModel
                ({
                    name: receivedData.playerName,
                    age: receivedData.age,
                    weight: receivedData.weight,
                    phoneNumber: receivedData.phoneNumber,
                    subscriptionDuration: receivedData.subscriptionDuration,
                    qrCodeValue: receivedData.id
                });
                await newplayer.save();
            }catch (error) {console.error('Error inserting sample member:', error);}
        
        res.status(201).json(receivedData);
    } catch (error) {res.status(500).json({ message: "Server error", error: error.message });}
});

MembersRouter.get("/serachPlayer/:id", async (req, res)=>
{
    try 
    {
        const playerId = (req.params.id);
        const playerFind = await MembersModel.findOne({qrCodeValue : playerId},
            {
                _id:0,
                name : 1,
                age:1,
                weight:1,
                phoneNumber:1,
                subscriptionDuration:1,
                qrCodeValue:1
            });
        console.log(playerFind);
        res.status(201).json(playerFind);
    }catch (error) {{res.status(500).json({ message: "Server error", error: error.message })};}
});

export default MembersRouter;