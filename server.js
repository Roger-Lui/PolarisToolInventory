var express = require("express");
var app = express();
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("db/tools.db");
var db2 = new sqlite3.Database("db/RSSIreadings.db");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db.run("DELETE FROM tools");
//db2.run("DELETE FROM RSSI");
// db2.run(`CREATE TABLE RSSI(
//   Xreading TEXT,
//   Yreading TEXT,
//   tagId TEXT UNIQUE
//   )`);

// db.run("ALTER TABLE tools RENAME COLUMN toolNames TO name");
// db.run("ALTER TABLE tools DROP COLUMN toolNames");
// db.run("ALTER TABLE tools ADD toolName varchar");
// db.run("ALTER TABLE tools ADD serialNumber varchar");
// db.run("ALTER TABLE tools ADD storageLocation varchar");
// db.run("ALTER TABLE tools ADD toolCal varchar");
// db.run("ALTER TABLE tools ADD nextCalibration varchar");
// db.run("ALTER TABLE tools ADD toolsextradetails varchar");

// CRUD - CREATE, READ, UPDATE, DESTROY
// HTTP Verbs - POST, GET, PUT, DELETE

//routes
app.get("/tools", function(request, response) {
  console.log("GET request received at /tools");

  db.all("SELECT rowid, * FROM tools", function(err, rows) {
    if (err) {
      console.log("Error:" + err);
    } else {
      response.send(rows);
    }
  });
});

app.post("/tools", function(request, response) {
  console.log("POST request received at /tools");
  db.run(
    "INSERT INTO tools VALUES (?,?,?,?,?,?,?,?)",
    [
      request.body.name,
      request.body.serialNumber,
      request.body.storageLocation,
      request.body.toolsextradetails,
      request.body.nextCalibration,
      request.body.toolCal,
      request.body.toolName,
      request.body.RSSI
    ],

    function(err) {
      if (err) {
        console.log("Error:" + err);
        response.status(400).redirect("index.html");
      } else {
        response.status(201).redirect("tools.html");
      }
    }
  );
});

// EDIT SECTION
app.put("/tools", function(request, response) {
  const newData = request.body;
  const id = request.query.id;
  db.run(
    "UPDATE tools SET name= ?, serialNumber = ?, storageLocation = ?, toolsextradetails = ?, nextCalibration = ?, toolCal = ?,toolName = ? WHERE rowid = ?",
    [
      newData.name,
      newData.serialNumber,
      newData.storageLocation,
      newData.toolsextradetails,
      newData.nextCalibration,
      newData.toolCal,
      newData.toolName,
      id
    ],

    function(err) {
      if (err) {
        console.log("Error: " + err);
        response.status(400).redirect("index.html");
      } else {
        response.status(202).redirect("tools.html");
      }
    }
  );
});

// DELETE SECTION
app.delete("/tools", function(request, response) {
  const id = request.query.id;
  db.run("DELETE FROM tools WHERE rowid = ?;", [id], function(err) {
    if (err) {
      console.log("Error: " + err);
      response.status(400).redirect("index.html");
    } else {
      response.status(202).json({ message: "tool of id " + id + " deleted" });
    }
  });
});

//TESTING
//CREATED TABLE RSSI IN RSSIreading.db

// Xreading, Yreading, tagId, rowid
// UPDATE RSSI SET Xreading=?, Yreading=?, WHERE tagId = tag1

app.post("/RSSI", function(request, response) {
  const queryParams = request.query;
  console.log(queryParams);

  db2.exec(
    `INSERT INTO RSSI (Xreading, Yreading, tagId) VALUES(${queryParams.x},${queryParams.y}, ${queryParams.tagId}) ON CONFLICT(tagId) DO UPDATE SET Xreading=${queryParams.x} , Yreading=${queryParams.y}`,
    function(err) {
      if (err) {
        console.log("Error: " + err);
        response.status(400).json({
          message: "something went wrong when saving data to RSSI table"
        });
      } else {
        response.status(200).end();
      }
    }
  );
});

app.listen(process.env.PORT || 3000, function() {
  const portNumber = process.env.PORT || 3000;
  console.log("Server is running on: " + portNumber);
});
