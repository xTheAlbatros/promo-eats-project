import React from "react";
import {Row, Container, Button} from "reactstrap";
import { useNavigate } from "react-router-dom";

function DemoFooter() {
  const navigate = useNavigate();

  // Sprawdzenie, czy użytkownik jest zalogowany
  const isLoggedIn = !!localStorage.getItem("access_token");

  // Obsługa przycisku "Profil"
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile-page");
    } else {
      navigate("/login-page");
    }
  };

  return (
      <footer className="footer">
        <Container>
          <Row className="align-items-center justify-content-start">
            <img
                src={require("assets/img/PromoEatsLogo.png")}
                alt="PromoEats Logo"
                className="footer-logo"
            />
            <nav className="footer-nav">
              <ul>
                <li>
                  <Button color="link" onClick={() => navigate("/index")} className="nav-link" style={{ cursor: "pointer", color: "white" }}>
                    Strona Główna
                  </Button>
                </li>
                <li>
                  <Button color="link" onClick={handleProfileClick} className="nav-link" style={{ cursor: "pointer", color: "white" }}>
                    Profil
                  </Button>
                </li>
              </ul>
            </nav>
          </Row>
        </Container>
      </footer>
  );
}

export default DemoFooter;
