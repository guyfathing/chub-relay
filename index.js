const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Main relay endpoint that Roblox will talk to
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        // Forward the request to Chub's true proxy server
        const response = await axios.post('https://chub.ai', req.body, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                // This header tricks Chub's firewall into treating the request as a real browser
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        // Send the clean AI JSON data back to Roblox
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Relay Error:", error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Chub Relay running on port ${PORT}`));
