const rapid_key = "7edbf71a72msh044cf35e2d47b12p1c6938jsn9b9365ea081f";
const express = require("express");
const unirest = require("unirest");
const app = express();
var arr = require("./jsonobjs");

const react = require("react");
const url = "";
var db;

// app.set('views', __dirname + '/views');
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/keys.js", (req, res) => {
  res.sendFile(__dirname + "/keys.js");
});

app.get("/sneakers", (req, res) => {
  res.sendFile(__dirname + "/sneakers.html");
});

app.get("/us.json", (req, res) => {
  res.sendFile(__dirname + "/us.json");
});

app.get("/index.js", (req, res) => {
  res.sendFile(__dirname + "/index.js");
});

app.get("/sneakers.js", (req, res) => {
  res.sendFile(__dirname + "/sneakers.js");
});

app.get("/resources/twomonthsample.js", (req, res) => {
  res.sendFile(__dirname + "/resources/twomonthsample.js");
});

app.get("/css/styles.css", (req, res) => {
  res.sendFile(__dirname + "/css/styles.css");
});

app.get("/css/sneakers.css", (req, res) => {
  res.sendFile(__dirname + "/css/sneakers.css");
});

app.get("/data-all", (req, res) => {
  res.send("Data page!");
});

app.get("/json-all", (req, res) => {
  res.send(arr["arr"]);
});

app.get("/data-twitter", (req, res) => {});

app.get("/search-image", (req, res) => {
  unirest
    .get(
      `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?autoCorrect=true&pageNumber=1&pageSize=1&q=${
        req.query.name
      }&safeSearch=false`
    )
    .header("X-RapidAPI-Key", rapid_key)
    .end(function(result) {
      res.send(result.body);
    });
});

app.get("/search-news", (req, res) => {
  unirest
    .get(
      `https://microsoft-azure-bing-news-search-v1.p.rapidapi.com/search?q=${
        req.query.name
      }`
    )
    .header("X-RapidAPI-Key", rapid_key)
    .end(function(result) {
      res.send(result.body);
    });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
