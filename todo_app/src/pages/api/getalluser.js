import axios from 'axios';
import cookies from 'js-cookie';

export default async function handleGetAllUser(req, res) {
  try {
    const { search, orderBy, orderType } = req.body
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
    const response = await axios.get(`http://localhost:5012/auth/users?search=${search}&orderBy=${orderBy}&orderType=${orderType}`, config);

    // Respond with the data received from the server
    return res.status(response?.status).json(response?.data);

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).end(); // Internal Server Error
  }
}
