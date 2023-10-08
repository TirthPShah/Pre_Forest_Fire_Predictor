const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

// Create a MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Replace with your actual MySQL password
  database: "nodetest",
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form for registration
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle registration form submission and insert data into the database
app.post("/register", (req, res) => {
  const { username, password, email, number } = req.body;
  const user = { username, password, email, number };

  // Check if the email already exists in the 'UserInfo' table
  db.query("SELECT * FROM UserInfo WHERE email = ?", email, (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).send("Error checking email existence");
      return;
    }

    if (rows.length > 0) {
      // Email already exists, show an error message
      const errorMessage = "Account already exists with this email.";
      res.send(errorMessage);
    } else {
      // Email does not exist, insert the user data into the 'UserInfo' table
      db.query("INSERT INTO UserInfo SET ?", user, (err, result) => {
        if (err) {
          console.error("Error inserting data into the database:", err);
          res.status(500).send("Error registering user");
          return;
        }
        console.log("User registered:", result);
        res.send("User registered successfully");
      });
    }
  });
});

// Serve the HTML form for login
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/LogIn1.html");
});

// Handle login form submission and check password in the database
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password match in the 'UserInfo' table
  db.query("SELECT * FROM UserInfo WHERE email = ?", email, (err, rows) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).send("Error checking login information");
      return;
    }

    if (rows.length === 0) {
      // Email not found
      res.send("Email not found. Please register first.");
    } else {
      // Email found, check the password
      const user = rows[0];
      if (user.password === password) {
        res.send("Login successful");
      } else {
        // Incorrect password, show an error message
        const errorMessage = "Invalid username or password.";
        res.send(errorMessage);
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
