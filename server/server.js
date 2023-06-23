const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.get('/api/users', (req, res) => {
  axios
    .get('https://reqres.in/api/users')
    .then(response => {
      const users = response.data.data;

      // Additional users to be added
      const additionalUsers = [
        {
          id: 7,
          email: "michael.lawson@reqres.in",
          first_name: "Michael",
          last_name: "Lawson",
          avatar: "https://reqres.in/img/faces/7-image.jpg",
        },
        {
          id: 8,
          email: "lindsay.ferguson@reqres.in",
          first_name: "Lindsay",
          last_name: "Ferguson",
          avatar: "https://reqres.in/img/faces/8-image.jpg",
        },
        {
          id: 9,
          email: "tobias.funke@reqres.in",
          first_name: "Tobias",
          last_name: "Funke",
          avatar: "https://reqres.in/img/faces/9-image.jpg",
        },
        {
          id: 10,
          email: "byron.fields@reqres.in",
          first_name: "Byron",
          last_name: "Fields",
          avatar: "https://reqres.in/img/faces/10-image.jpg",
        },
        {
          id: 11,
          email: "george.edwards@reqres.in",
          first_name: "George",
          last_name: "Edwards",
          avatar: "https://reqres.in/img/faces/11-image.jpg",
        },
        {
          id: 12,
          email: "rachel.howell@reqres.in",
          first_name: "Rachel",
          last_name: "Howell",
          avatar: "https://reqres.in/img/faces/12-image.jpg",
        },
      ];

      const allUsers = [...users, ...additionalUsers];
      res.json(allUsers);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
