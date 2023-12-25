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

    async onLoadGoogleAPISearch(req, res) {
        try {
            const { lat, lng, type } = req.query;
            console.log(lat, lng, type);

            const apiKey = process.env.GOOGLE_API_KEY || '';
            let apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=${type}&key=${apiKey}`;

            if (!apiKey) {
                return res.status(401).json({ error: 'Server Error' });
            }

            const response = await axios.get(apiUrl, {
                headers: {
                    accept: 'application/json',
                },
            });
            const data = await response.data;
            return res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    async googlePlaceSearch(req, res) {
        try {
            const { searchText, near, radius } = req.query;
            const apiKey = process.env.GOOGLE_API_KEY || '';
            const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${near}&key=${apiKey}`;

            const geocodingResponse = await axios.get(geocodingUrl, {
                headers: {
                    accept: 'application/json',
                },
            });
            const geocodingData = await geocodingResponse.data;

            if (geocodingData.results.length > 0) {
                const location = geocodingData.results[0].geometry.location;
                const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchText}&location=${location.lat},${location.lng}&radius=${radius}&key=${apiKey}`;

                const response = await axios.get(apiUrl, {
                    headers: {
                        accept: 'application/json',
                    },
                });
                const data = await response.data;
                return res.status(200).json(data);
            } else {
                return res.status(404).json({ error: 'Not Found' });
            }

        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    async placeDetails(req, res) {
        const { placeId } = req.query;
        const apiKey = process.env.GOOGLE_API_KEY || '';
        const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    accept: 'application/json',
                },
            });
            const data = await response.data;
            return res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}

module.exports = new APIsController();