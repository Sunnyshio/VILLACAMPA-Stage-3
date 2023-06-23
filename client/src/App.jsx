import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const cardGridRef = useRef(null);
  const lastCardRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setDisplayedUsers(data.slice(0, 3));
        if (data.length > 3) {
          setLoadMore(true);
        } else {
          setNoMoreData(true);
        }
      })
      .catch(error => {
        console.error(error);
        console.log('Error fetching data');
      });
  };

  const handleLoadMore = () => {
    const currentLength = displayedUsers.length;
    const nextUsers = users.slice(currentLength, currentLength + 3);
    const updatedUsers = [...displayedUsers, ...nextUsers];
    setDisplayedUsers(updatedUsers);
    if (updatedUsers.length >= users.length) {
      setLoadMore(false);
      setNoMoreData(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const cardGrid = cardGridRef.current;
      if (cardGrid) {
        const cardElements = cardGrid.getElementsByClassName('card');
        if (cardElements.length > 0) {
          const cardHeight = cardElements[0].offsetHeight;
          const cardGridRect = cardGrid.getBoundingClientRect();
          const numRows = Math.ceil(cardGridRect.height / cardHeight);
          if (numRows > 2) {
            document.body.style.height = 'auto';
          } else {
            document.body.style.height = '100vh';
          }
        }
      }
    };
    

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [displayedUsers]);

  useEffect(() => {
    if (lastCardRef.current) {
      lastCardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedUsers]);

  return (
    <div className="App">

      <div className="card-grid" ref={cardGridRef}>
        <TransitionGroup component={null}>
          {displayedUsers.map((user, index) => (
            <CSSTransition key={user.id} timeout={500} classNames="card-transition">
              
              <div className='card-outer'>
                <div className="card" ref={index === displayedUsers.length - 1 ? lastCardRef : null}>
              
                  {/* card-front */}
                  <div className="card-info">
                      <div className="card-avatar"><img src={user.avatar} alt="Avatar" /></div>
                      <div className="card-name">{user.first_name} {user.last_name}</div>
                      <div className="card-id">ID number: {user.id}</div>
                  </div>
                  
                  {/* card-back */}
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
        <button onClick={handleLoadMore} className="load-more-button btn">
          <p>Load More</p>
          <i class="fa-solid fa-plus sign"></i>
        </button>
      )}
      {noMoreData && (
      <button className="no-more-data-button">
          No Data
        </button>
      )}
    </div>
  );
}

export default App;
