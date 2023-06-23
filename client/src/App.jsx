import React, { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "@fortawesome/fontawesome-free/css/all.css";
import cat from "./css/bonggo.png";

function App() {
  //state variables and references
  const [users, setUsers] = useState([]); // stores fetched user data
  const [displayedUsers, setDisplayedUsers] = useState([]); // displayed users in the card grid
  const [loadMore, setLoadMore] = useState(false); // state for the "Load More" button
  const [noMoreData, setNoMoreData] = useState(false); // state on when to show the "No Data" button
  const cardGridRef = useRef(null); // reference to the card grid
  const lastCardRef = useRef(null); //reference to the last card of the grid

  //fetches the user infos from the API when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // HTTP GET request to fetch data from the local server API
  const fetchUsers = () => {
    fetch("http://localhost:3001/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setDisplayedUsers(data.slice(0, 3));
        if (data.length > 3) {
          setLoadMore(true);
        } else {
          setNoMoreData(true);
        }
      })
      .catch((error) => {
        console.error(error); //logs errors for easier bug fixes
        console.log("Error fetching data");
      });
  };

  const handleLoadMore = () => {
    const currentLength = displayedUsers.length;
    const nextUsers = users.slice(currentLength, currentLength + 3);
    const updatedUsers = [...displayedUsers, ...nextUsers];
    setDisplayedUsers(updatedUsers); // append next set of users
    if (updatedUsers.length >= users.length) {
      setLoadMore(false); // disables the "Load More" button when there is no more data to be displayed
      setNoMoreData(true); // show the "No Data" button
    }
  };

  // handles resizing of the card grid
  // this avoids the cards being cut off
  // and allows the cards to be completely visible when scrolling to the top
  useEffect(() => {
    const handleResize = () => {
      const cardGrid = cardGridRef.current;
      if (cardGrid) {
        const cardElements = cardGrid.getElementsByClassName("card");
        if (cardElements.length > 0) {
          const cardHeight = cardElements[0].offsetHeight;
          const cardGridRect = cardGrid.getBoundingClientRect();
          const numRows = Math.ceil(cardGridRect.height / cardHeight);
          if (numRows > 2) {
            document.body.style.height = "auto"; // sets the body height to auto if the number of rows are more than 2
          } else {
            document.body.style.height = "100vh"; // sets the body height to 100vh if the number of rows are less than 2
          }
        }
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [displayedUsers]);

  // scrolls down automatically to the latest displayed cards
  useEffect(() => {
    if (lastCardRef.current) {
      lastCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedUsers]);

  // defines the App component to be rendered
  return (
    <div className="App">
      {/* greeting section */}
      <div className="hello">
        <img src={cat} className="cat" />
        <p className="title">Hello! Please hover for card animation :)</p>
      </div>

      {/* card grid section */}
      <div className="card-grid" ref={cardGridRef}>
        {/* container of CSSTransition */}
        <TransitionGroup component={null}>
          {/* iterate over the displayed users and renders the infos into a card */}
          {displayedUsers.map((user, index) => (
            // wraps the component and applies css transition
            <CSSTransition
              key={user.id}
              timeout={500}
              classNames="card-transition"
            >
              <div className="card-outer">
                <div
                  className="card"
                  ref={index === displayedUsers.length - 1 ? lastCardRef : null}
                >
                  {/* front of the card */}
                  <div className="card-info">
                    <div className="card-avatar">
                      <img src={user.avatar} alt="Avatar" />
                    </div>
                    <div className="card-name">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="card-id">ID number: {user.id}</div>
                  </div>

                  {/* back of the card */}
                  <div className="card-social-container">
                    <ul className="card-social">
                      <li className="card-social__item csi-p">
                        <i className="fas fa-solid fa-envelope"></i>Contact:
                      </li>
                      <li className="card-social__item csi-p">
                        <a href={`mailto:${user.email}`} className="tooltip">
                          {user.email}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>

      {loadMore && (
        // button for loading and displaying more data
        <button onClick={handleLoadMore} className="load-more-button btn">
          <p>Load More</p>
          <i class="fa-solid fa-plus sign"></i>
        </button>
      )}
      {noMoreData && (
        // disabled button to signify no more data
        <button className="no-more-data-button">No Data</button>
      )}
    </div>
  );
}

export default App;
