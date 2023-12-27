const express = require("express");
const Razorpay= require("razorpay");
const crypto = require("crypto");
const cors = require("cors") //cors for enabling cross-origin resource sharing. 
                            //bcz we will be making the api call from some other port

require("dotenv").config(); // inorder to get var for .env

const app=express();
const PORT=process.env.PORT;

//since this is post api and some payload involved we need to use middleware
//middleware functions is used to perform various tasks during the request-response cycle
app.use(express.json());
app.use(express.urlencoded({extended: false})); //is used to parse incoming requests with URL-encoded payloads
app.use(cors());

app.post("/order" , async (req,res)=>{
    try{
        const razorpay=new Razorpay({  
            key_id: process.env.RAZORPAY_KEY_ID, 
            key_secret: process.env.RAZORPAY_SECRET
        });

        //after the above razorpay instance is we will get payload from req.boby

        //Extracting options from the request body and using Razorpay to create an order. Responding with the order details.
        const options=req.body;
        console.log(options);
        const order = await razorpay.orders.create(options);

        if(!order){
            return res.status(500).send("Error");
        }

        res.json(order);
        console.log(order);

    }catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
    
})

app.post('/order/validate', async (req,res) => {
    // we will pass 3 fields that we got on the client side as the request.body
    const {razorpay_order_id , razorpay_payment_id , razorpay_signature } = req.body ; 
    console.log(req.body)

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`); 
    //digest is used to obtain the hexadecimal representation of the hash
    const digest = sha.digest("hex");   //This is compared with the received signature

    if(digest !== razorpay_signature){
        return res.status(400).json( {msg: "Transaction is not legit!"} );
    }

    res.json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
    });

});

app.listen(PORT, () =>{
    console.log("Listening on port ", PORT);
});