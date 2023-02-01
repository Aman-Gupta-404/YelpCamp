import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import "./Navbar.css";

function Navbar() {
  const userLoginState = useSelector((state) => state.userReducer.isLoggedIn);
  const cartListState = useSelector((state) => state.userReducer.user.cart);

  const [navBarShow, setNavBarShow] = useState(false);


  useEffect(() => {
    // console.log(cartListState.length)
  }, [cartListState])
  

  const handleBurgerClick = () => {
    setNavBarShow(!navBarShow);
  }

  return (
    <div className='navbar' id={navBarShow ? "navbar-open_main": null}>
      <div className="navbar__left">
        <p className='navbar__left--text'>Yelp Camp</p>
      </div>

      <div className="navbar__right" id={navBarShow ? "navbar-open": null}>
        <div className="navbar__right--item">
          <Link to="/" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
            Home
          </Link>
        </div>
        {/* <div className="navbar__right--item">
          <Link to="/" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
            About
          </Link>
        </div> */}
        <div className="navbar__right--item">
          <Link to="/shop" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
            Shop
          </Link>
        </div>
        {userLoginState? 
          <div className="navbar__right--item">
            <Link to="/wishlist" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
              Wishlist
            </Link>
          </div>:
          null
        }
        {userLoginState? 
          <div className="navbar__right--item">
            <Link to="/cart" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
              cart
            </Link>
            {cartListState.length !== 0?
              <div className="navbar__right-cart">
                <p className="navbar__right-cart-text">
                  {/* {cartListState.length} */}
                </p>
              </div>:
              null
            }
          </div>:
          null
        }
        {userLoginState? null: 
          <div className="navbar__right--item">
            <Link to="/login" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
              Login
            </Link>
          </div>
        }
        {userLoginState? null:
          <div className="navbar__right--item">
            <Link to="/signup" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
              Signup
            </Link>
          </div>
        }
        {userLoginState?
          <div className="navbar__right--item">
            <Link to="/account" className="navbar__right--link" onClick={() => setNavBarShow(!navBarShow)}>
              Account
            </Link>
          </div>:
          null
        }
      </div>
      <div className="burger_container">
        <div className="nav_burger_icon" onClick={handleBurgerClick}>
          <div className="burger_line"></div>
          <div className="burger_line"></div>
          <div className="burger_line"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar