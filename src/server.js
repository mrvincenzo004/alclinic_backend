import { connectDatabase } from "./db/database.js";
import express from "express";
import cors from "cors";
import 'dotenv/config';
import ledgerRoute from "./routes/ledgerRoute.js";
import paitentRoute from "./routes/patientRoute.js";
const corsOptions={
    origin:true,
    credentials:true,
    optionSuccessStatus:200,
}


const app=express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT=process.env.PORT || 4040;
connectDatabase();


app.get('/',(req,res)=>{
    res.send("Hello World!");
});

app.use('/api/ledger',ledgerRoute);
app.use('/api/patient',paitentRoute);



app.listen(PORT,()=>{
    console.log(`Http server is running on ${PORT}`);
})