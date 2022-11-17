const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client")));

const data = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  "mailto:test@test.com",
  data.publicKey,
  data.privateKey
);

console.log(data);

app.post("/subscribe/1", (req, res) => {
  console.log(req.body);
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({
    title: "Teste1",
    body: "Teste1",
  });
  webpush.sendNotification(subscription, payload);
});

app.post("/subscribe/2", (req, res) => {
  console.log(req.body);
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({
    title: "Teste2",
    body: "Teste2",
  });
  webpush.sendNotification(subscription, payload);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
