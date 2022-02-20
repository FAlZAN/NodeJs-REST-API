const express = require("express");
const app = express();
const CORS = require("cors");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");

app.use(bodyParser.json());
app.use(CORS({origin: "*"}));

const URI =
  "mongodb+srv://<username>:<password>cluster0.3y2q9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
MongoClient.connect(URI, {useUnifiedTopology: true}).then((client) => {
  console.log("Connect to MongoDB Successfully..");
  const DB = client.db("CRUD-BUILD");
  const Collection = DB.collection("crud-ops");

  app.get("/users", (req, res) => {
    Collection.find()
      .toArray()
      .then((result) => res.send(result));
  });

  app.post("/post", (req, res) => {
    Collection.insertOne(req.body)
      .then((result) => {
        res.send("Document Submitted Successfully!");
      })
      .catch((e) => console.error(e));
  });

  app.put("/post", (req, res) => {
    console.log(req.body);
    Collection.findOneAndUpdate(
      {
        username: req.body.userToChange,
      },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
        },
      },
      {
        upsert: true,
      }
    )
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  });
});
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
