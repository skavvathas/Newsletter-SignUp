const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https");

const app = express();

//For static files like images and styles.css (public/images  public/css)
app.use(express.static("public"));

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/e98208cb9a"; // us18 from API key 

    const options = {
        method: "POST",
        auth: "skavv:830bc4431544945d6dafb841442eef0a-us18"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData); // write the data
    request.end();
});


// redirect from /failure to / route
app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running in Port 3000!!!");
});

//API key
//830bc4431544945d6dafb841442eef0a-us18

//list id
//e98208cb9a