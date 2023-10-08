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

// Serve the HTML form (LogIn1.html)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/LogIn1.html");
});

// Handle form submission and check password in the database
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
        // Incorrect password, show an alert message using JavaScript
        const errorMessage = "Invalid username or password.";
        res.send(`
                    <script>
                        alert("${errorMessage}");
                        window.history.back();
                    </script>
                `);
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
