/*!

=========================================================
* Paper Kit React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-kit-react

* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-kit-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classnames from "classnames";
import { Button, Collapse, NavbarBrand, Navbar, NavItem, Nav, Container } from "reactstrap";

function IndexNavbar() {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [navbarCollapse, setNavbarCollapse] = React.useState(false);
  const navigate = useNavigate();

  const toggleNavbarCollapse = () => {
    setNavbarCollapse(!navbarCollapse);
    document.documentElement.classList.toggle("nav-open");
  };

  // Sprawdzenie, czy użytkownik jest zalogowany
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile-page"); // Przekierowanie na stronę profilu
    } else {
      navigate("/login-page"); // Przekierowanie na stronę logowania
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetch("http://localhost:8082/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
      window.location.reload();
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };


  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (document.documentElement.scrollTop > 299 || document.body.scrollTop > 299) {
        setNavbarColor("");
      } else if (document.documentElement.scrollTop < 300 || document.body.scrollTop < 300) {
        setNavbarColor("navbar-transparent");
      }
    };

    window.addEventListener("scroll", updateNavbarColor);

    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });

  return (
      <Navbar className={classnames("fixed-top", navbarColor)} color-on-scroll="300" expand="lg">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand tag={Link} to="/index">
              <img
                  src={require("assets/img/PromoEatsLogo.png")}
                  alt="PromoEats Logo"
                  style={{ height: "150px" }}
              />
            </NavbarBrand>
            <button
                aria-expanded={navbarCollapse}
                className={classnames("navbar-toggler navbar-toggler", { toggled: navbarCollapse })}
                onClick={toggleNavbarCollapse}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <Collapse className="justify-content-end" navbar isOpen={navbarCollapse}>
            <Nav navbar>
              {!isLoggedIn ? (
                  <>
                    <NavItem>
                      <Link to="/register-page" className="nav-link">
                        Zarejestruj się
                      </Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/login-page" className="nav-link">
                        Zaloguj się
                      </Link>
                    </NavItem>
                  </>
              ) : (
                  <>
                    <NavItem>
                      <Button color="link" onClick={handleProfileClick} style={{ cursor: "pointer", color: "white" }}>
                        Profil
                      </Button>
                    </NavItem>
                    <NavItem>
                      <Link onClick={handleLogout} className="nav-link" style={{ cursor: "pointer" }}>
                        Wyloguj
                      </Link>
                    </NavItem>
                  </>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
  );
}

export default IndexNavbar;


