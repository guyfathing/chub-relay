const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Universal catch-all listener configuration route
app.all('*', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        // Correct base completion domain route layout
        const response = await axios.post('https://chub.ai', req.body, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        // Pass the raw AI JSON text block back to your Roblox game session
        res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            console.error("Platform Error Code Exception:", error.response.status);
            res.status(error.response.status).send(JSON.stringify(error.response.data));
        } else {
            console.error("Relay Pipeline Connection Failure Error:", error.message);
            res.status(500).send(error.message);
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Secure Relay Node active on port ${PORT}`));
