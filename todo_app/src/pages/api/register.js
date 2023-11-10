import axios from 'axios';

export default async function handleRegister(req, res) {
  const body = req?.body;

  try {
    const registerUser = await axios.post('http://localhost:5012/register', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = registerUser?.data;
    res.status(registerUser?.status).json(response);

  } catch (err) {
    console.error("Error:", err);
    res.status(401).end();
  }
}