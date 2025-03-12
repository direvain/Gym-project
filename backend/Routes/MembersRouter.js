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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
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

function calculateSubscriptionDates(subscriptionDuration) {
    // Convert subscriptionDuration string to a number
    subscriptionDuration = Number(subscriptionDuration); 
    
    // Get current date
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    
    const currentDate = `${year}/${month}/${day}`;
    
    let endDate;
 
    
    switch(subscriptionDuration) {
        case 1:
            endDate = getAdjustedDate(year, month + 1, day);
            break;
        case 2:
            endDate = getAdjustedDate(year, month + 2, day);
            break;
        case 3:
            endDate = getAdjustedDate(year, month + 3, day);
            break;
        case 6:
            endDate = getAdjustedDate(year, month + 6, day);
            break;
        default:
            endDate = getAdjustedDate(year + 3, month, day);
    }
    
    return {
        startDate: currentDate, // start
        endDate: endDate,      // end 
        currentTime: date // Return the date object itself
    };
}

function getAdjustedDate(year , month, day) 
{
    year += Math.floor((month - 1) / 12); // Adjust year if month > 12
    month = ((month - 1) % 12) + 1; // Wrap month around to 1-12
    return `${year}/${month}/${day}`;
    
}
async function deleteExpiredSubscriptions() {
    try {
        // Calculate the date 6 months ago
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const year = sixMonthsAgo.getFullYear();
        const month = sixMonthsAgo.getMonth() + 1; // JavaScript months are 0-indexed
        const day = sixMonthsAgo.getDate();
        const cutoffDate = `${year}/${month}/${day}`;
        
        // Get all members
        const allMembers = await Members.find({});
        
        // Track IDs of members to delete
        const membersToDelete = [];
        
        for (const member of allMembers) {
            if (!member.subscriptionDurationEnd) continue;
            
            // Parse the end date
            const [endYear, endMonth, endDay] = member.subscriptionDurationEnd.split('/').map(Number);
            const endDate = new Date(endYear, endMonth - 1, endDay);
            
            
            if (endDate <= sixMonthsAgo) {
                membersToDelete.push(member._id);
            }
        }
        
        if (membersToDelete.length > 0) {
            const result = await Members.deleteMany({ _id: { $in: membersToDelete } });
        } else {
        }
    } catch (error) {
        throw error;
    }
}

MembersRouter.post("/addPlayer", async (req, res) => 
    {
        try 
        {
            
            const receivedData = req.body; // receive json file
            // Get subscription dates and current time from the function

            const existingPlayer = await MembersModel.findOne({ phoneNumber: receivedData.phoneNumber });
            if (existingPlayer) {
                return res.status(400).json({ 
                    message: "رقم الهاتف مسجل بالفعل", 
                    error: "duplicate_phone" 
                });
            }
            const subscriptionInfo = calculateSubscriptionDates(receivedData.subscriptionDuration);

            const start= subscriptionInfo.startDate;
            const end = subscriptionInfo.endDate;
            
            /// Create unique ID with current timestamp
            receivedData.id = 'direvain' + arabicToNumber(receivedData.playerName) + subscriptionInfo.currentTime.getTime();
    
            // Create the new player object
            const newplayer = new MembersModel({
                name: receivedData.playerName,
                age: receivedData.age,
                weight: receivedData.weight,
                phoneNumber: receivedData.phoneNumber,
                subscriptionDurationStart: start,
                subscriptionDurationEnd: end,
                qrCodeValue: receivedData.id
            });
            
            // Save to database and only return success if this completes
            await newplayer.save();
            
            // Only sends success response if database save succeeded
            res.status(201).json({
                name: newplayer.name,
                subscriptionDurationStart: newplayer.subscriptionDurationStart,
                subscriptionDurationEnd: newplayer.subscriptionDurationEnd,
                qrCodeValue: newplayer.qrCodeValue
            });
        } 
        catch (error) {
            res.status(500).json({ 
                message: "Failed to register player", 
                error: error.message 
            });
        }
});

MembersRouter.patch("/updateSubscription", async (req, res) => 
{
    try 
    {
        const playerInfo = req.body;
        const newDate = new Date();
        const playerSearch = await MembersModel.updateMany(
            {qrCodeValue : playerInfo.value},
                {
                    $set:{
                        subscriptionDurationStart:`${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`,
                        subscriptionDurationEnd:playerInfo.date
                    }
                }
        );
        if (playerSearch.modifiedCount === 0) {
            return res.status(404).json({ error: " فشل في تحديث البيانات" });
        }
        res.status(201).json({ 
            message: "تم تحديث البيانات",
            subscriptionDurationStart: `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`
        });

    } catch (error) {
        res.status(500).json({ error: " فشل في تحديث البيانات" });
    }
});


MembersRouter.get("/SearchforMembers/:id", async (req, res)=>
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
                subscriptionDurationStart:1,
                subscriptionDurationEnd:1,
                qrCodeValue:1
            });
        res.status(201).json(playerFind);
    }catch (error) {{res.status(500).json({ message: "Server error", error: error.message })};}
});

MembersRouter.get("/SearchforMembersName/:name", async (req, res)=>
{        
    try 
    {
        const playerName = req.params.name;
        const playersFind = await MembersModel.find({name: playerName},
            {
                _id:0,
                name: 1,
                age: 1,
                weight: 1,
                phoneNumber: 1,
                subscriptionDurationStart: 1,
                subscriptionDurationEnd: 1,
                qrCodeValue: 1
            });

            if (playersFind.length === 0) {
                return res.status(404).json({ message: "لا يوجد لاعب بهذا الاسم" });
            }
        res.status(201).json(playersFind);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

deleteExpiredSubscriptions();
export default MembersRouter;