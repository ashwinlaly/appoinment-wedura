const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./Routes/routes")();

app.use(cors());
app.use(express.json());
app.use("/api/", routes);

app.all("*", (request, response) => {
    console.log(request.path, request.method);
    return response.status(404).json({
        status: 404,
        message: "INVALID URL"
    });
});

module.exports = {
    app
};