import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Input,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";

function ProfilePage() {
  const [userData, setUserData] = useState({});
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login-page");
        return;
      }

      try {
        const response = await fetch("http://localhost:8082/api/user/token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user data");
          navigate("/login-page");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login-page");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      setPasswordErrors({
        ...passwordErrors,
        currentPassword: "Użytkownik nie jest zalogowany.",
      });
      return;
    }

    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Podaj bieżące hasło.";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "Podaj nowe hasło.";
    }
    if (passwordForm.newPassword !== passwordForm.confirmationPassword) {
      errors.confirmationPassword = "Hasła nie pasują do siebie.";
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await fetch("http://localhost:8082/api/user/new-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmationPassword: passwordForm.confirmationPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Hasło zostało zmienione pomyślnie!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmationPassword: "",
        });
        setPasswordErrors({});
        setChangePasswordVisible(false);
      } else {
        const errorData = await response.json();
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: errorData.message || "Wystąpił błąd przy zmianie hasła.",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordErrors({
        ...passwordErrors,
        currentPassword: "Błąd połączenia z serwerem.",
      });
    }
  };

  return (
      <>
        <div className="page-container">
          <ExamplesNavbar />
          <ProfilePageHeader />
          <div className="section profile-content">
            <Container>
              <div className="owner">
                <div className="avatar">
                  <img
                      alt="..."
                      className="img-circle img-no-padding img-responsive"
                      src={require("assets/img/default-avatar.png")}
                  />
                </div>
                <div className="name">
                  <h4 className="title text-primary font-weight-bold">
                    Witaj, {userData.name} {userData.surname}!
                    <br />
                  </h4>
                </div>
              </div>
              <Row>
                <Col className="ml-auto mr-auto text-center" md="6">
                  <div style={{ marginBottom: "10px" }}>
                    <Button
                        className="btn-round"
                        color="primary"
                        onClick={() => {
                          navigate("/");
                          setTimeout(() => {
                            const targetElement = document.getElementById("add-restaurant");
                            if (targetElement) {
                              targetElement.scrollIntoView({ behavior: "smooth" });
                            }
                          }, 100);
                        }}
                    >
                      Twoje restauracje
                    </Button>
                  </div>
                  <div>
                    <Button
                        className="btn-round"
                        color="info"
                        onClick={() => {
                          setSuccessMessage("");
                          setChangePasswordVisible(!changePasswordVisible);
                        }}
                    >
                      Zmień hasło
                    </Button>
                  </div>
                  {changePasswordVisible && (
                      <Form onSubmit={handlePasswordChange} className="mt-3">
                        <FormGroup>
                          <Label for="currentPassword">Bieżące hasło</Label>
                          <Input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              placeholder="Wpisz swoje bieżące hasło"
                              value={passwordForm.currentPassword}
                              onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value,
                                  })
                              }
                              invalid={!!passwordErrors.currentPassword}
                          />
                          <FormFeedback>{passwordErrors.currentPassword}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          <Label for="newPassword">Nowe hasło</Label>
                          <Input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              placeholder="Wpisz nowe hasło"
                              value={passwordForm.newPassword}
                              onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value,
                                  })
                              }
                              invalid={!!passwordErrors.newPassword}
                          />
                          <FormFeedback>{passwordErrors.newPassword}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                          <Label for="confirmationPassword">Potwierdź nowe hasło</Label>
                          <Input
                              type="password"
                              id="confirmationPassword"
                              name="confirmationPassword"
                              placeholder="Potwierdź nowe hasło"
                              value={passwordForm.confirmationPassword}
                              onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    confirmationPassword: e.target.value,
                                  })
                              }
                              invalid={!!passwordErrors.confirmationPassword}
                          />
                          <FormFeedback>{passwordErrors.confirmationPassword}</FormFeedback>
                        </FormGroup>
                        <Button color="success" type="submit">
                          Zmień hasło
                        </Button>
                      </Form>
                  )}
                  {successMessage && (
                      <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
                  )}
                </Col>
              </Row>
            </Container>
          </div>
          <DemoFooter />
        </div>
      </>
  );
}

export default ProfilePage;
