const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Customer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Create Registration Schema
const registrationSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Create Registration Model
const Registration = mongoose.model('register', registrationSchema);

// Create Shoe Schema
const shoeSchema = new mongoose.Schema({
  shoeName: String,
  brand: String,
  shoePhoto: String,
  shoePrice: Number,
});

// Create Shoe Model
const Shoe = mongoose.model('shoes', shoeSchema);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Log the received data
    console.log('Received data:', { username, email, password });

    // Validate the data (you can add more validation as needed)
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Save registration data to MongoDB
    const registration = new Registration({ username, email, password });
    await registration.save();

    // Send a successful response
    res.status(200).json({ success: true, message: 'Registration successful.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists in MongoDB
    const user = await Registration.findOne({ username });

    if (user) {
      // Valid username, check password
      if (user.password === password) {
        // Valid password
        res.status(200).json({ success: true, message: 'Login successful.' });
      } else {
        // Invalid password
        res.status(401).json({ success: false, message: 'Invalid password.' });
      }
    } else {
      // Invalid username
      res.status(401).json({ success: false, message: 'Invalid username.' });
    }
  } catch (error) {
    // Internal server error
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Product submission endpoint
app.post('/submit', upload.single('shoePhoto'), async (req, res) => {
  try {
    const { shoeName, brand, shoePrice } = req.body;
    const shoePhoto = req.file ? `/uploads/${req.file.filename}` : '';

    // Log the received data
    console.log('Received data:', { shoeName, brand, shoePrice, shoePhoto });

    // Validate the data (you can add more validation as needed)
    if (!shoeName || !brand || !shoePrice) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Save shoe data to MongoDB
    const shoe = new Shoe({ shoeName, brand, shoePhoto, shoePrice });
    await shoe.save();

    // Send a successful response
    res.status(200).json({ success: true, message: 'Product submitted successfully.' });
  } catch (error) {
    console.error('Error during submission:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Handle fetching sneakers
app.get('/getSneakers', async (req, res) => {
  try {
    const sneakers = await Shoe.find();
    console.log('Fetched sneakers:', sneakers); // Log the fetched sneakers
    res.json(sneakers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


