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
import { Link } from "react-router-dom";
import classnames from "classnames";
import { Button, Collapse, NavbarBrand, Navbar, NavItem, Nav, Container } from "reactstrap";

function IndexNavbar() {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [navbarCollapse, setNavbarCollapse] = React.useState(false);

  const toggleNavbarCollapse = () => {
    setNavbarCollapse(!navbarCollapse);
    document.documentElement.classList.toggle("nav-open");
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
  }, []);

  return (
      <Navbar className={classnames("fixed-top", navbarColor)} expand="lg">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand to="/index" tag={Link}>
              <img
                  src={require("assets/img/PromoEatsLogo.png")}
                  alt="PromoEats Logo"
                  style={{ height: "150px" }}
              />
            </NavbarBrand>
            <button
                aria-expanded={navbarCollapse}
                className={classnames("navbar-toggler navbar-toggler", {
                  toggled: navbarCollapse,
                })}
                onClick={toggleNavbarCollapse}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <Collapse className="justify-content-end" navbar isOpen={navbarCollapse}>
            <Nav navbar>
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
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
  );
}

export default IndexNavbar;
