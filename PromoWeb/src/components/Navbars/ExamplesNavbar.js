import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classnames from "classnames";
import { Collapse, NavbarBrand, Navbar, NavItem, Nav, Container } from "reactstrap";

function ExamplesNavbar() {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [navbarCollapse, setNavbarCollapse] = React.useState(false);
  const navigate = useNavigate();

  const toggleNavbarCollapse = () => {
    setNavbarCollapse(!navbarCollapse);
    document.documentElement.classList.toggle("nav-open");
  };

  // Sprawdzenie, czy użytkownik jest zalogowany
  const isLoggedIn = !!localStorage.getItem("access_token");

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
      navigate("/index"); // Przekieruj na stronę główną
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
      <Navbar className={classnames("fixed-top", navbarColor)} expand="lg">
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
                      <Link onClick={handleLogout} className="nav-link" style={{ cursor: "pointer", color: "yellow"  }}>
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

export default ExamplesNavbar;
