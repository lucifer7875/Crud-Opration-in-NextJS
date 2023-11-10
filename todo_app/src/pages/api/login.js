import axios from 'axios';

export default async function handleLogin(req, res) {
  const body = req?.body;

  try {
    const loginUser = await axios.post('http://localhost:5012/login', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (loginUser.status === 200) {
      const response = loginUser.data;
      res.status(200).json({ message: response, status: 200 });
    } else {
      // Handle other error cases
      res.status(loginUser.status).json({ error: 'Login failed' });
    }
  } catch (error) {
    if (error.response) {

      res.status(error?.response?.status).json({ message: error?.response?.data, status: 401 });
    } else if (error?.request) {
      // The request was made but no response was received
      res.status(500).json({ error: 'No response received from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: 'Request failed to be sent' });
    }
  }
}