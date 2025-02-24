require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const newsRoutes = require("./src/routes/newsRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API",
    });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
