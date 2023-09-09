require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true})); 

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data= {
        members :[
            {
                email_address : email,
                status:"subscribed",
                merge_field: {
                    FNAME : firstName,
                    LNAME : lastName,
                }
            }
        ]
    };

    const jsondata = JSON.stringify(data);
    const listid = process.env.LIST_ID;
    const url = "https://us21.api.mailchimp.com/3.0/lists/" + listid

    const apiid = process.env.API_ID;
    const options= {
        method : "POST",
        auth : "Harsh1:" + apiid
    }

    const request = https.request(url,options,function(response){

                      if(response.statusCode ===200){
                        res.sendFile(__dirname + "/success.html");
                      }else{
                        res.sendFile(__dirname + "/failure.html");
                      }

                      response.on("data",function(data){
                      console.log(JSON.parse(data));
                    });
    });

    request.write(jsondata);
    request.end();
    
});

app.post("/failure", function(req,res){
    res.redirect("/");
});


app.get("/",function(req,res){

    res.sendFile(__dirname + "/signup.html");

    
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});


