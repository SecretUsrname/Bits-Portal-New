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
app.use(cors());

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


//Deleting paper by ID
app.delete('/paper/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Get the paper ID from the URL parameter
        const paper = await Paper.findByIdAndDelete(id);  // Find and delete the paper
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json({ message: 'Paper deleted successfully' });
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

//Create Paper details by User_id
app.post('/:id/paper', async(req, res) => {
    try{
        const { id } = req.params;
        const {title, author, DOI, publisher, year, journal} = req.body;
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({message: "There was a problem creating paper"});
        }
        const paper = await Paper.create({title, author, DOI, publisher, year, journal});
        user.DOI.push(DOI);
        await user.save();
        res.status(200).json(paper);
    }
    catch(error){
        res.status(500).json({message: error.message});
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

//Finding paper by DOI
app.get('/paper/doi/:encodedDOI', async (req, res) => {
    try {
        const encodedDOI = req.params.encodedDOI;
        const DOI = decodeURIComponent(encodedDOI);

        const paper = await Paper.findOne({ DOI });
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        
        res.status(200).json(paper);
    } catch (error) {
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

//Delete Paper using DOI
app.delete('/paper/:encodedDOI', async (req, res) => {
    try {
        const encodedDOI = req.params.encodedDOI;
        const DOI = decodeURIComponent(encodedDOI);
        const paper = await Paper.findByIdAndDelete(DOI);  // Find and delete the user
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json({ message: 'Paper deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Tagging paper and users
app.post('/paper/tag/:encodedDOI/:email', async(req, res) => {
    try{
        const {encodedDOI, email} = req.params;
        const DOI = decodeURIComponent(encodedDOI);
        const user = await User.findOne({email});
        user.tagged_DOI.push(DOI);
        await user.save();
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
app.get('/login/user/:email', async(req, res) => {
    try{
        const {email} = req.params;
        const user = User.findOne({ email });
        if (!user) {
            return res.status(404).json({ authorize: 'NO' });
        }
        res.status(200).json({ authorize: 'YES' });
    }
    catch(error){
        res.status(200).json({ authorize: 'NO' });
    }
});

//Admin login checking
app.get('/login/admin/:email', async(req, res) => {
    try{
        const {email} = req.params;
        const user = Admin.findOne({ email });
        if (!user) {
            return res.status(404).json({ authorize: 'NO' });
        }
        res.status(200).json({ authorize: 'YES' });
    }
    catch(error){
        res.status(200).json({ authorize: 'NO' });
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