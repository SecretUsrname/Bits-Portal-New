import express from 'express';
import User from './models/user.js';
import Paper from './models/paper.js';
import Admin from './models/admin.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',  // Allow frontend at localhost:3001
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const originalExtension = path.extname(file.originalname); // Get original file extension
        const uniqueFilename = `${file.fieldname}-${Date.now()}${originalExtension}`; // Create a unique filename with the original extension
        cb(null, uniqueFilename);
    }
});

// Set up multer for file handling
const upload = multer({ storage });

//Creating new user. 
app.post('/user',async(req, res)=> {
    try {
        const { email, name } = req.body;
        const user = await User.create({ name, email});
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});

app.post('/admin',async(req, res)=> {
    try {
        const { email, name } = req.body;
        const admin = await Admin.create({ name, email});
        res.status(200).json(admin);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});

//getting user details by email
app.get('/user/:email', async (req, res) => {
    try{
        const {email} = req.params;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch (error){
        res.status(404).json({ message: error.message });
    }
});


app.get('/user_id/:email', async (req, res) => {
    try{
        const {email} = req.params;
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user._id);
    }
    catch (error){
        res.status(404).json({ message: error.message });
    }
});

//Deleting user by ID
app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Get the user ID from the URL parameter
        const user = await User.findByIdAndDelete(id);  // Find and delete the user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Deleting admin by id

app.delete('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Get the user ID from the URL parameter
        const user = await Admin.findByIdAndDelete(id);  // Find and delete the user
        if (!user) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//List of all users
app.get('/alluser', async (req, res) => {
    try{
        const user = await User.find({});
        res.status(200).json(user);
    }
    catch(error){
        res.status(404).json({message: 'NO USERS EXIST'});      
    }
});

//List of all Admin
app.get('/allAdmin', async (req, res) => {
    try{
        const admin = await Admin.find({});
        res.status(200).json(admin);
    }
    catch(error){
        res.status(404).json({message: 'NO ADMINS EXIST'});      
    }
});

//Create Paper details by User_id
app.post('/:id/paper', async(req, res) => {
    try{
        const { id } = req.params;
        const {title, author, DOI, publisher, year, journal, volume, pages} = req.body;
        const dup_paper = await Paper.findOne({ DOI });
        if(dup_paper){
            return res.status(400).json({message: "Citation Already Published By You or someone else"})
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({message: "There was a problem creating paper"});
        }
        const creator = id;
        const paper = await Paper.create({title, author, DOI, publisher, year, journal, volume, pages, creator});
        user.DOI.push(DOI);
        await user.save();
        res.status(200).json(paper);
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

app.get('/user/:id/papers', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);  
      const DOIs = user.DOI;
      const papers = [];
  
      for (const DOI of DOIs) {
        const paper = await Paper.findOne({ DOI });
        if (paper) {
          papers.push(paper);
        }
      }
      res.json(papers);
    } catch (error) {
      console.error('Error fetching papers:', error);
      res.status(500).json({ message: 'Error fetching papers' });
    }
  });
  

    app.get('/user/:id/tagged/papers', async (req, res) => {
        try {
        const { id } = req.params;
        const user = await User.findById(id);  
        const DOIs = user.tagged_DOI;
        const papers = [];
    
        for (const DOI of DOIs) {
            const paper = await Paper.findOne({ DOI });
            if (paper) {
            papers.push(paper);
            }
        }
        res.json(papers);
        } catch (error) {
        console.error('Error fetching papers:', error);
        res.status(500).json({ message: 'Error fetching papers' });
        }
    });

//Finding paper details by id
app.get('/paper/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const paper = await Paper.findById(id);
        if(!paper){
            res.status(404).json({message: 'paper not found'})
        }
        res.status(200).json(paper);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

//Delete paper by id
app.delete('/paper/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Find and delete the paper
        const paper = await Paper.findById(id);
        const DOI = paper.DOI;
        console.log(paper);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Find users with DOI in their DOI array
        const usersWithDOI = await User.findById(paper.creator);
        usersWithDOI.DOI = usersWithDOI.DOI.filter(item => item !== DOI);
        await usersWithDOI.save();

        // Find users with DOI in their tagged_DOI array
        const usersWithTaggedDOI = await User.find({ tagged_DOI: paper.DOI });
        console.log(usersWithTaggedDOI);
        if(usersWithTaggedDOI){
            for (const user of usersWithTaggedDOI) {
                user.tagged_DOI = user.tagged_DOI.filter(item => item !== DOI);
                await user.save();
            }
        }
        await Paper.findByIdAndDelete(paper._id);
        res.status(200).json({ message: 'Paper and associated DOI entries deleted successfully' });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


//List of all papers
app.get('/allpapers', async (req, res) => {
    try{
        const paper = await Paper.find({});
        res.status(200).json(paper);
    }
    catch(error){
        res.status(404).json({message: 'NO PAPERS FOUND'});      
    }
});

//Tagging paper and users
app.post('/paper/tag/:encodedDOI/:email', async(req, res) => {
    try{
        const {encodedDOI, email} = req.params;
        const DOI = decodeURIComponent(encodedDOI);
        const user = await User.findOne({email});
        const paper = await Paper.findOne({DOI});
        paper.taggers.push(user._id);
        user.tagged_DOI.push(DOI);
        await user.save();
        await paper.save();
        res.status(200).json({DOI, email});
    }
    catch(error){
        res.status(404).json({ message : error.message})
    }
})

//Uploading file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    // Run Python script and pass the file path
    exec(`python process_citation.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Error executing Python script:", error);
            return res.status(500).json({ error: 'Failed to process file' });
        }
        if (stderr) {
            console.error("Python script error output:", stderr);
            return res.status(500).json({ error: 'Python script error' });
        }

        // Parse and send back the result from Python script
        const result = JSON.parse(stdout);
        res.json(result);
    });
});

//login checking
// Login checking for user
app.get('/login/user/:email', async (req, res) => {
    try {
        const { email } = req.params; // Retrieve email from URL
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ authorize: 'NO' }); // User not found
        }

        // User found, return authorized response
        res.status(200).json({ authorize: 'YES' });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({ authorize: 'NO' });
    }
});


// Admin login checking
app.get('/login/admin/:email', async(req, res) => {
    try {
        const { email } = req.params; // Retrieve email from URL
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ authorize: 'NO' }); // User not found
        }

        // User found, return authorized response
        res.status(200).json({ authorize: 'YES' });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({ authorize: 'NO' });
    }
});


mongoose.connect("mongodb+srv://f20220012:yNXnhFCr1niFyTiM@cluster0.gyzwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("MongoDB connected.");
        app.listen(3000, () => {
            console.log('Testing...');
        });
    })
    .catch(() => {
        console.log("Connection failed");
    });