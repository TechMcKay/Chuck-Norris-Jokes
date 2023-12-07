// Import of need libraries
import express from "express";
import axios from "axios";

// Creation of standard variables
const app = express();
const port = 3000;
const jokesURL = "https://api.chucknorris.io/"

// Setting public folder as static
app.use(express.static("public"));

// Initial home route
app.get("/", (req, res) => {
    res.render("index.ejs")
})


// Starting server
app.listen(port, () => {
    console.log(`Server running on ${port}.`)
})