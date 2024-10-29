import express from 'express';
import User from './models/user.js';
import Paper from './models/paper.js';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs/promises'; // using fs/promises for async/await
import BibTeXParser from 'bibtex-parser';
import { exec } from 'child_process';
const app = express();
app.use(express.json());

// Set up multer for file handling
const upload = multer({ dest: 'uploads/' });

app.post('/user',async(req, res)=> {
    try {
        const { email, name } = req.body;
        const user = await User.create({ name, email});
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});

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

app.get('/alluser', async (req, res) => {
    try{
        const user = await User.find({});
        res.status(200).json(user);
    }
    catch(error){
        res.status(404).json({message: 'NO USERS EXIST'});      
    }
});

app.post('/:id/paper', async(req, res) => {
    try{
        const { id } = req.params;
        const {title, authors, DOI, publisher, year} = req.body;
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({message: "There was a problem creating paper"});
        }
        const paper = await Paper.create({title, authors, DOI, publisher, year});
        user.DOI.push(DOI);
        await user.save();
        res.status(200).json(paper);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

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

app.get('/paper/DOI/:DOI', async(req, res) => {
    try{
        const { DOI } = req.params;
        const paper = await Paper.findOne({DOI});
        if(!paper){
            res.status(404).json({message: 'paper not found'})
        }
        res.status(200).json(paper);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

app.get('/allpapers', async (req, res) => {
    try{
        const paper = await Paper.find({});
        res.status(200).json(paper);
    }
    catch(error){
        res.status(404).json({message: 'NO PAPERS FOUND'});      
    }
});

app.delete('/paper/:DOI', async (req, res) => {
    try {
        const { DOI } = req.params;  // Get the user ID from the URL parameter
        const paper = await Paper.findByIdAndDelete(DOI);  // Find and delete the user
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        res.status(200).json({ message: 'Paper deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/paper/tag/:DOI/:email', async(req, res) => {
    try{
        const {DOI, email} = req.params;
        const user = await User.findOne({email});
        user.tagged_DOI.push(DOI);
        await user.save();
        res.status(200).json({DOI, email});
    }
    catch(error){
        res.status(404).json({ message : error.message})
    }
})


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



mongoose.connect("mongodb://localhost:27017/BITS-portal")
    .then(() => {
        console.log("MongoDB connected.");
        app.listen(3000, () => {
            console.log('Testing...');
        });
    })
    .catch(() => {
        console.log("Connection failed");
    });