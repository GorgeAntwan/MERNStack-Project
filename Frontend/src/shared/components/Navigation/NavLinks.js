import React, { useContext } from "react";
import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
          <NavLink to="/" exact> 
            ALL USER
          </NavLink>
        </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICAT</NavLink>
        </li>
      )}
      {auth.isLoggedIn &&(
        <li>
          <button onClick={auth.logout}>
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
