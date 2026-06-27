const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Universal Listener: Bypasses path routing completely
app.all('*', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        // Connects straight to Chub's definitive proxy engine
        const response = await axios.post('https://chub.ai', req.body, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
            }
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Relay Error Processing Request:", error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Universal Relay active on port ${PORT}`));
