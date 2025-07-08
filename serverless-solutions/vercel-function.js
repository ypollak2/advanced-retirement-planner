// Vercel Function for Yahoo Finance API Proxy
// Deploy this to /api/yahoo-finance.js

const fetch = require('node-fetch');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const targetUrl = decodeURIComponent(url);
        
        // Validate that it's a Yahoo Finance URL
        if (!targetUrl.includes('query1.finance.yahoo.com') && 
            !targetUrl.includes('query2.finance.yahoo.com')) {
            return res.status(400).json({ error: 'Only Yahoo Finance URLs are allowed' });
        }

        console.log('Fetching:', targetUrl);

        // Make the request to Yahoo Finance
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Referer': 'https://finance.yahoo.com'
            },
            timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`Yahoo Finance API responded with ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Set cache headers
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
        
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching from Yahoo Finance:', error);
        
        return res.status(500).json({ 
            error: 'Failed to fetch data from Yahoo Finance',
            message: error.message 
        });
    }
}