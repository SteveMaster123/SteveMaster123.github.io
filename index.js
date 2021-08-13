const express = require("express");
const app = express();
const path = require("path");
const data = require("./data.json");
const TelegramBot = require('node-telegram-bot-api');

const token = '1915414245:AAEXuf46yYtie2CeG4V2dtbQDtxxhayNRAs';
const bot = new TelegramBot(token, { polling: true });

//Settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));


//Get
app.get('/', function (req, res) {
    const first = Object.keys(data)[0].replace(" (", "").replace(")", "");
    res.render("index", {first})
})

app.get('/checkout', function (req, res) {
    res.render("checkout")
})



app.get('/:id', function (req, res) {
    let { id } = req.params;
    let categories = [];
    for (let category in data) {
        categories.push(category)
    }
    let foods = data[id];
    res.render("menu", {categories, foods, id})
})


//Post
app.post("/submit", async function (req, res) {
    const request = await req.body;

    // '[{"name": "កាហ្វេទឹកដោះគោក្ដៅ ","price":"4000 ", "extras": "[គោក]", "description": ""}, 1]+[{"name": "កាហ្វេខ្មៅ ","price":"3000 ", "extras": "[គោក]", "description": ""}, 3]+[{"name": "តែក្រូចក្ដៅ ","price":"4000 ", "extras": "[គោក]", "description": ""}, 3]'
    let cart = "";
    
    request.cartInfo.split("+").forEach(info => {
        const OBJ = JSON.parse(info.slice(info.indexOf("[") + 1, info.lastIndexOf(",")));
        console.log(OBJ)
        cart += `${OBJ.name}${OBJ.extras ? OBJ.extras : ""}: ${info.slice(info.lastIndexOf(",")+1, info.lastIndexOf("]")).trim()} ${OBJ.description ? "បរិយាយ[" + OBJ.description + "]" : ""}\n`
    })
    
    bot.sendMessage(-453386342, `-----------------------------\nឈ្មោះ: ${request.name}\nលេខទូរស័ព្ទ: ${request.tel}\nទីតាំង: ${request.location}\n\n\n${cart}-----------------------------`)
    res.redirect('/')
})

//Others
app.listen(process.env.PORT|| 3000, function () {
    console.log("Listening on port 3000")
})