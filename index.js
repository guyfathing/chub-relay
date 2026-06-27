const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Universal route listener
app.all('*', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        // Target Chub's official Mars chat completions engine
        const response = await axios.post('https://chub.ai', req.body, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        // Pass the raw AI generation response back to your Roblox game server
        res.status(200).json(response.data);
    } catch (error) {
        // If Chub rejects the call, pass the raw data error body back to Roblox to inspect
        if (error.response) {
            console.error("Chub Platform Response Error Code:", error.response.status);
            res.status(error.response.status).send(JSON.stringify(error.response.data));
        } else {
            console.error("Relay Framework Connection Error Failure:", error.message);
            res.status(500).send(error.message);
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Universal Proxy Node active on port ${PORT}`));

