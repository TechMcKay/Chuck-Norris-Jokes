import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const jokesURL = "https://api.chucknorris.io/jokes/";

app.use(express.static("public"));

// Function to fetch categories
async function fetchCategories() {
  try {
    const categoryResponse = await axios.get(jokesURL + "categories");
    return categoryResponse.data;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
}

// Initial home route
app.get("/", async (req, res) => {
  try {
    const categories = await fetchCategories();
    const response = await axios.get(jokesURL + "random");
    res.render("index.ejs", {
      joke: response.data.value,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching jokes");
  }
});

// Category route
app.get("/category", async (req, res) => {
  try {
    const selectedCategory = req.query.selected;
    const categoryResponse = await axios.get(jokesURL + "categories");
    const response = await axios.get(
      jokesURL + `random?category=${selectedCategory}`
    );
    res.render("index.ejs", {
      joke: response.data.value,
      categories: categoryResponse.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching jokes for the selected category");
  }
});

// Text search route
app.get("/text-search", async (req, res) => {
  try {
    const searchText = req.query.query;
    const categories = await fetchCategories();
    const response = await axios.get(jokesURL + `search?query=${searchText}`);

    if (response.data.total > 0) {
      const randomIndex = Math.floor(Math.random() * response.data.total);
      const randomChoice = response.data.result[randomIndex];
      res.render("index.ejs", {
        joke: randomChoice.value,
        categories,
      });
    } else {
      res.render("index.ejs", {
        joke: "NO JOKES FOUND WITH THAT TEXT",
        categories,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching jokes that include that text");
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}.`);
});
