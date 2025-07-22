const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File paths
const dataFilePath = path.join(__dirname, 'data.json');
const pythonScriptPath = path.join(__dirname, 'graph_analysis.py');

// Helper functions for file operations
function loadData() {
    try {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Error loading data:', err.message);
        return [];
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        console.log('Data written successfully');
    } catch (err) {
        console.error('Error writing data:', err.message);
    }
}

// Function to run Python graph analysis
function runGraphAnalysis() {
    return new Promise((resolve, reject) => {
        console.log('Running graph analysis...');
        
        exec(`python "${pythonScriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Python script error: ${error}`);
                reject(error);
                return;
            }
            
            if (stderr) {
                console.error(`Python stderr: ${stderr}`);
            }
            
            console.log('Graph analysis completed:');
            console.log(stdout);
            resolve(stdout);
        });
    });
}

// Routes
app.get('/', (req, res) => {
    console.log('GET request received at /');
    res.send('Server is working!');
});

// POST endpoint to receive form data and generate graph
app.post('/submit', async (req, res) => {
    console.log('Form submission received:', req.body);
    
    try {
        const formData = req.body;
        const existingData = loadData();
        
        // Add timestamp to the submission
        formData.timestamp = new Date().toISOString();
        formData.userId = `user_${existingData.length + 1}`; // Add user ID for graph
        
        existingData.push(formData);
        writeData(existingData);
        
        console.log(`Total users now: ${existingData.length}`);
        
        // Generate graph if we have at least 2 users
        let analysisResult = null;
        if (existingData.length >= 2) {
            try {
                analysisResult = await runGraphAnalysis();
            } catch (analysisError) {
                console.error('Graph analysis failed:', analysisError.message);
                // Continue even if graph generation fails
            }
        } else {
            console.log('Need at least 2 users for graph analysis');
        }
        
        res.status(200).json({ 
            message: 'Form data saved successfully!', 
            data: formData,
            totalUsers: existingData.length,
            graphGenerated: analysisResult !== null,
            analysisOutput: analysisResult,
            graphUrl: analysisResult !== null ? '/graph.png' : null
        });
        
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({
            message: 'Error processing submission',
            error: error.message
        });
    }
});

// GET endpoint for viewing stored data
app.get('/submissions', (req, res) => {
    console.log('GET request for all submissions');
    const data = loadData();
    res.status(200).json({
        message: `Found ${data.length} submissions`,
        submissions: data
    });
});

// GET endpoint for manually triggering graph analysis
app.get('/analyze', async (req, res) => {
    try {
        const data = loadData();
        
        if (data.length < 2) {
            return res.status(400).json({
                message: 'Need at least 2 users to generate graph',
                currentUsers: data.length
            });
        }
        
        const analysisResult = await runGraphAnalysis();
        
        res.status(200).json({
            message: 'Graph analysis completed',
            totalUsers: data.length,
            output: analysisResult
        });
        
    } catch (error) {
        console.error('Manual analysis failed:', error);
        res.status(500).json({
            message: 'Analysis failed',
            error: error.message
        });
    }
});

// GET endpoint for getting latest submission
// app.get('/submissions/latest', (req, res) => {
//     const data = loadData();
//     const latest = data.length > 0 ? data[data.length - 1] : null;
    
//     if (latest) {
//         res.status(200).json({
//             message: 'Latest submission found',
//             submission: latest
//         });
//     } else {
//         res.status(404).json({
//             message: 'No submissions found'
//         });
//     }
// });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Try accessing: http://127.0.0.1:${PORT}`);
    
    // Create data.json if it doesn't exist
    if (!fs.existsSync(dataFilePath)) {
        writeData([]);
        console.log('Created data.json file');
    }
    
    // Check if Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
        console.warn('Warning: graph_analysis.py not found. Graph generation will fail.');
        console.log('Make sure to create the Python script in the same directory as server.js');
    }
});