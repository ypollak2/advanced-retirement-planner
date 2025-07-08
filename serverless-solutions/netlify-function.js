// Netlify Function for Yahoo Finance API Proxy
// Deploy this to /.netlify/functions/yahoo-finance.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { queryStringParameters } = event;
        
        if (!queryStringParameters || !queryStringParameters.url) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'URL parameter is required' })
            };
        }

        const targetUrl = decodeURIComponent(queryStringParameters.url);
        
        // Validate that it's a Yahoo Finance URL
        if (!targetUrl.includes('query1.finance.yahoo.com') && 
            !targetUrl.includes('query2.finance.yahoo.com')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Only Yahoo Finance URLs are allowed' })
            };
        }

        console.log('Fetching:', targetUrl);

        // Make the request to Yahoo Finance
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache'
            },
            timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`Yahoo Finance API responded with ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Error fetching from Yahoo Finance:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch data from Yahoo Finance',
                message: error.message 
            })
        };
    }
};