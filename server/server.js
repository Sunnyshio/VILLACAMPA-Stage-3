const express = require("express"); //imports express framework
const axios = require("axios"); //imports axios for HTTP requests
const cors = require("cors"); //imports cors to enable cross-origin resource sharing

const app = express(); //creates an express application
const port = 3001; //setting the port number

app.use(cors()); //enable cors middleware

//setting up the route for handling GET requests to 'api/users'
app.get("/api/users", (req, res) => {
  axios
    .get("https://reqres.in/api/users")
    .then((response) => {
      const users = response.data.data;

      // additional users
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
    .catch((error) => {
      console.error(error); //logging errors for easier bug fixes
      res.status(500).json({ error: "Internal server error" });
    });
});

//starts the server on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
