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
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";

function Index() {
  const [restaurants, setRestaurants] = useState([]);
  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    webside: "",
    openingHours: {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    },
    location: { latitude: "", longitude: "" },
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setErrorMessage("Użytkownik nie jest zalogowany.");
          return;
        }

        const response = await fetch("http://localhost:8082/api/restaurants", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
        } else {
          setErrorMessage("Nie udało się pobrać listy restauracji.");
        }
      } catch (error) {
        console.error("Błąd połączenia z serwerem:", error);
        setErrorMessage("Nie udało się połączyć z serwerem.");
      }
    };

    fetchRestaurants();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpeningHoursChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      openingHours: { ...formData.openingHours, [name]: value },
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorMessage("Użytkownik nie jest zalogowany.");
      return;
    }

    const errors = {};
    if (!formData.name) errors.name = "Nazwa restauracji jest wymagana.";
    if (!formData.email) errors.email = "Email restauracji jest wymagany.";
    if (!formData.location.latitude || !formData.location.longitude)
      errors.location = "Współrzędne geograficzne są wymagane.";
    if (Object.values(formData.openingHours).some((hours) => !hours)) {
      errors.openingHours =
          "Godziny otwarcia muszą być podane dla każdego dnia tygodnia.";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const restaurantResponse = await fetch(
          "http://localhost:8082/api/restaurant",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...formData,
              users: { id: 1 },
            }),
          }
      );

      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json().catch(() => ({}));
        setErrorMessage(
            errorData.message || "Wystąpił błąd przy dodawaniu restauracji."
        );
        return;
      }

      setSuccessMessage("Restauracja została dodana pomyślnie!");
      setIsAddingRestaurant(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        webside: "",
        openingHours: {
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
        location: { latitude: "", longitude: "" },
      });
      const updatedRestaurants = await fetch(
          "http://localhost:8082/api/restaurants",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      ).then((res) => res.json());
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
      setErrorMessage("Nie udało się połączyć z serwerem.");
    }
  };

  return (
      <>
        <IndexNavbar />
        <IndexHeader />
        <Container className="mt-5">
          <Row>
            <Col>
              <h3 className="text-center mb-4 text-warning">Twoje restauracje</h3>
              <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <Card key={restaurant.id} className="mb-3 shadow-sm">
                      <CardBody>
                        <CardTitle tag="h5" className="text-warning">
                          {restaurant.name}
                        </CardTitle>
                        <CardSubtitle className="mb-2 phone">
                          Telefon:{" "}
                          <span className="text-success">{restaurant.phone}</span>
                        </CardSubtitle>
                        <a
                            href={restaurant.webside}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-success"
                        >
                          {restaurant.webside}
                        </a>
                      </CardBody>
                    </Card>
                ))}
                {restaurants.length === 0 && (
                    <p className="text-center text-muted">
                      Brak restauracji do wyświetlenia.
                    </p>
                )}
              </div>
            </Col>
          </Row>

          <Row id="add-restaurant" className="form-button-container">
            <Col className="text-center">
              <Button
                  color="primary"
                  onClick={() => setIsAddingRestaurant(!isAddingRestaurant)}
              >
                {isAddingRestaurant ? "Anuluj" : "Dodaj Restaurację"}
              </Button>
            </Col>
          </Row>

          {isAddingRestaurant && (
              <Row className="mt-3">
                <Col>
                  <Form onSubmit={handleFormSubmit}>
                    <FormGroup>
                      <Label for="name">Nazwa restauracji</Label>
                      <Input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          invalid={!!formErrors.name}
                      />
                      <FormFeedback>{formErrors.name}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          invalid={!!formErrors.email}
                      />
                      <FormFeedback>{formErrors.email}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Label for="phone">Telefon</Label>
                      <Input
                          type="text"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="webside">Strona internetowa</Label>
                      <Input
                          type="text"
                          name="webside"
                          id="webside"
                          value={formData.webside}
                          onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Godziny otwarcia</Label>
                      {Object.keys(formData.openingHours).map((day) => (
                          <div key={day}>
                            <Label for={day}>{day}</Label>
                            <Input
                                type="text"
                                name={day}
                                id={day}
                                placeholder="Np. 08:00-18:00"
                                value={formData.openingHours[day]}
                                onChange={handleOpeningHoursChange}
                                invalid={!!formErrors.openingHours}
                            />
                          </div>
                      ))}
                      <FormFeedback>{formErrors.openingHours}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Label for="latitude">Szerokość geograficzna</Label>
                      <Input
                          type="number"
                          name="latitude"
                          id="latitude"
                          value={formData.location.latitude}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  latitude: e.target.value,
                                },
                              })
                          }
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="longitude">Długość geograficzna</Label>
                      <Input
                          type="number"
                          name="longitude"
                          id="longitude"
                          value={formData.location.longitude}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                location: {
                                  ...formData.location,
                                  longitude: e.target.value,
                                },
                              })
                          }
                      />
                    </FormGroup>
                    {successMessage && (
                        <p className="text-success">{successMessage}</p>
                    )}
                    {errorMessage && (
                        <p className="text-danger">{errorMessage}</p>
                    )}
                    <div className="form-button-container">
                      <Button color="success" type="submit">
                        Dodaj restaurację
                      </Button>
                    </div>

                  </Form>
                </Col>
              </Row>
          )}
        </Container>
        <DemoFooter/>
      </>
  );
}

export default Index;
