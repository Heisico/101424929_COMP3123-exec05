const express = require('express');
const fs = require('fs'); // To read the user.json file
const bodyParser = require('body-parser'); // To parse JSON bodies
const path = require('path'); // To work with file paths
const app = express();
const router = express.Router();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public')));

/*
- Create new html file named home.html 
- add <h1> tag with the message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

/*
- Return all details from user.json file to client in JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read user data." });
    }
    res.json(JSON.parse(data));
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and password are valid then send response as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If password is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read user data." });
    }
    
    const users = JSON.parse(data);
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.json({ status: false, message: "User Name is invalid" });
    }
    
    if (user.password !== password) {
      return res.json({ status: false, message: "Password is invalid" });
    }

    res.json({ status: true, message: "User Is valid" });
  });
});

/*
- Modify /logout route to accept username as parameter and display a message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req, res) => {
  const { username } = req.query; // Using query parameters
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Server Error');
});

app.use('/', router);

app.listen(process.env.PORT || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 8081));
});