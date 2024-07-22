const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000

//mongodb 
mongoose.connect("mongodb://127.0.0.1/27017/expensetracker", {
    useNewUrlParser : true,
    useUnifiedTopology: true,
});

//middlewares
app.use(cors());
app.use(bodyparser.json());

const db = mongoose.connection;
db.on("error" , (error)=>{
    console.error("Mongodb connection error:" , error)
});
db.once("open" , ()=>{
    console.log("connected to the Mongodb successfully");
})


//schema

const expenceSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    }
});

const Expense = mongoose.model("expense" , expenceSchema);

//Api routes
app.get("/expense" , async(req,res)=>{
 try{
    const expence = await Expense.find();
    res.json(expence);
 }catch(error){
    console.error("error");
    res.status(500).json({error: "Internal Server error", error})
 }
})

app.post("/expense", async(req,res)=>{
    const {description , amount} = await req.body;
    try{
      
        if(!description || !amount){
            return res.status(400).json({message: "Description and amount are required field"});
        }

        const newExpence = new Expense({description, amount});
        await newExpence.save();
        res.json(newExpence);
    }catch(error){
        console.error("error");
        res.status(500).json({error: "Internal server error"});
    }
})

//port listen
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})