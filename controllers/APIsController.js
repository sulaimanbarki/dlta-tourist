const axios = require('axios');
require('dotenv').config();

class APIsController {
    async mainSearch(req, res) {
        try {
            const { query, lat, lng, min_price, max_price } = req.query;
            const apiKey = process.env.FOURSQUARE_API_KEY;

            if (!apiKey) {
                return res.status(401).json({ error: 'Server Error' });
            }

            let apiUrl = `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat},${lng}`;

            if (min_price !== undefined) {
                apiUrl += `&min_price=${min_price}`;
            }
            if (max_price !== undefined) {
                apiUrl += `&max_price=${max_price}`;
            }

            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: apiKey,
                    accept: 'application/json',
                },
            });

            const locations = response.data.results.map(result => ({
                fsq_id: result.fsq_id,
                name: result.name,
                categories: result.categories.map(category => category.name),
                address: result.location.formatted_address,
                latitude: result.location.latitude,
                longitude: result.location.longitude,
            }));

            res.json(locations);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}

module.exports = new APIsController();