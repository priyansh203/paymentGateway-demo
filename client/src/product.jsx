import 'bootstrap/dist/css/bootstrap.css';
function Product() {

    const paymentHandler = async (e) => {
        const amount = 50000;
        const currency="INR";
        const receiptId = "dfa";

        const response = await fetch("https://62fa-2401-4900-1f3f-785e-b40e-ab4-81b3-c582.ngrok-free.app/order",{
            method: "POST",
            body: JSON.stringify({
                amount,
                currency,
                receipt: receiptId
            }),
            headers:{
                "Content-Type" : "application/json"
            }
        });
        const order = await response.json();
        console.log(order,"product");
        // {
        //     id: 'order_NFRLZPHZHrz6Es',
        //     entity: 'order',
        //     amount: 500,
        //     amount_paid: 0,
        //     amount_due: 500,
        //     currency: 'INR',
        //     receipt: 'dfa',
        //     offer_id: null,
        //     status: 'created',
        //     attempts: 0,
        //     notes: [],
        //     created_at: 1703258801
        // }
          

        var options = {
            "key": "rzp_test_cpQCkptOoWacuj", // Enter the Key ID generated from the Dashboard
            amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency,
            "name": "Acme Corp", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (response){

                const body = {...response};
                console.log(body);
                const validateRes = await fetch("https://62fa-2401-4900-1f3f-785e-b40e-ab4-81b3-c582.ngrok-free.app/validate",{
                    method: "POST",
                    body: JSON.stringify(body), //stringify is used to convert js Object to JSON string
                    headers:{ //header contain additional info about request
                        "Content-Type" : "application/json" //data being sent in the body is in the JSON format
                    }
                });
                const jsonRes = await validateRes.json();
                console.log(jsonRes);

                if(jsonRes.msg === "success"){
                    document.write("Payment done");
                }
            },
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                "name": "Gaurav Kumar", //your customer's name
                "email": "gaurav.kumar@example.com", 
                "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
        });

        rzp1.open();
        e.preventDefault();
    };

    return ( 
        <center>
            <h1>Pay 500 INR</h1>
            <button className='btn btn-primary btn-lg' onClick={paymentHandler}>Pay</button>
        </center>

     );
}

export default Product;
