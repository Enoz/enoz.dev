import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/test", async function (req, res) {
  res.status(200).send(process.env.DISCORD_APP_ID);
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
