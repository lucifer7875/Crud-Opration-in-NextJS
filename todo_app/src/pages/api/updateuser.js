import axios from 'axios';

export default async function handleGetAllUser(req, res) {
    const { body } = req
    const { id } = req.body
    try {
        console.log("Request received for user data retrieval.");

        // Retrieve the bearer token from the 'token' cookie
        const bearerToken = req?.cookies?.token;

        if (!bearerToken) {
            console.error("Error: Bearer token is missing.");
            return res.status(401).end(); // Unauthorized
        }

        // Configure the request
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`,
            },
        };

        // Make an HTTP GET request to retrieve user data
        const response = await axios.put(`http://localhost:5012/auth/users/${id}`, body, config);

        // Respond with the data received from the server
        return res.status(response?.data?.status).json(response?.data);

    } catch (err) {
        console.error("Error:", err.response?.data);
        return res.status(500).json(err.response?.data); // Internal Server Error
    }
}
