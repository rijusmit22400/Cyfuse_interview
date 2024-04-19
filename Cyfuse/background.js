const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { initializeApp } = require("firebase/app");
//-------------------------DATABASE-------------------------
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfXBgqIqcrAFVDqMqU7kUpn1qWT0dImHs",
  authDomain: "cyfuse-interview.firebaseapp.com",
  projectId: "cyfuse-interview",
  storageBucket: "cyfuse-interview.appspot.com",
  messagingSenderId: "228540385447",
  appId: "1:228540385447:web:6c084451b106f06ea5b382"
};

const appdb = initializeApp(firebaseConfig);

// Initialize Firebase
const auth = getAuth(appdb);
//----------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/login');
});


app.use(express.static(path.join(__dirname, '/public')));

app.get('/login', (req, res) => {
    fs.readFile(path.join(__dirname, '/public/index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.send(data);
    });
});

app.get('/register', (req, res) => {
    fs.readFile(path.join(__dirname, '/public/register.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.send(data);
    });
});

app.get('/success', (req, res) => {
  if(req.query.user===undefined){
    res.redirect('/login');
    return
  }
  else{
    fs.readFile(path.join(__dirname, '/public/congo.html'), 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      res.send(data);
  });
  }
});


app.post('/register', (req, res) => {
    email = req.body.user;
    pass = req.body.password;
    createUserWithEmailAndPassword(auth, email, pass)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    res.redirect('/login');
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Invalid email or password");
    res.redirect('/register');
    // ..
  });
   
});

app.post('/login', (req, res) => {
    email = req.body.user;
    pass = req.body.password;
    console.log(req.user);
    signInWithEmailAndPassword(auth, email, pass)
  .then((userCredential) => {
    res.redirect('/success?user='+email);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.redirect('/register');
  });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
