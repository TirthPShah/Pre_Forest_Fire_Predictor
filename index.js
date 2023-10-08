var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Replace with your actual MySQL password
  database: "nodetest",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

$query = "SELECT * FROM `UserInfo`";

connection.query($query, function (err, rows, fields) {
  if (err) {
    console.error("An error occurred with the query:", err);
    return;
  }

  console.log("Query successfully executed", rows);
});

connection.end(function () {
  console.log("Connection closed");
});
