import express from express
import cors from cors;
const corsOptions={
    origin:true,
    credentials:true,
    optionSuccessStatus:200,
}


const app=express();
app.use(cors(corsOptions));

