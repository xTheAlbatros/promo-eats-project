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
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  FormFeedback,
} from "reactstrap";
import { Link } from "react-router-dom";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import LocationPicker from "./LocationPicker";

function Index() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState({});
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
  const [confirmationId, setConfirmationId] = useState(null);

  const isLoggedIn = !!localStorage.getItem("access_token");

  useEffect(() => {
    if (isLoggedIn) {
      fetchOwnerRestaurants();
      fetchCategories();
    }
  }, [isLoggedIn]);

  const fetchOwnerRestaurants = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8082/api/restaurants/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      }
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8082/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania kategorii:", error);
    }
  };

  const handleCategoryChange = (restaurantId, categoryId) => {
    setSelectedCategories((prev) => {
      const currentCategories = prev[restaurantId] || [];
      const isSelected = currentCategories.includes(categoryId);

      return {
        ...prev,
        [restaurantId]: isSelected
            ? currentCategories.filter((id) => id !== categoryId)
            : [...currentCategories, categoryId],
      };
    });
  };

  const handleSaveCategories = async (restaurantId) => {
    const token = localStorage.getItem("access_token");
    const categoriesToSave = selectedCategories[restaurantId] || [];

    try {
      for (const categoryId of categoriesToSave) {
        await fetch(
            `http://localhost:8082/restaurant/${restaurantId}/category/${categoryId}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
        );
      }
      alert("Kategorie zostały zapisane.");
    } catch (error) {
      console.error("Błąd podczas zapisywania kategorii:", error);
    }
  };

  const toggleCategoryMenu = (restaurantId) => {
    setCategoryMenuOpen((prev) => ({
      ...prev,
      [restaurantId]: !prev[restaurantId],
    }));
  };

  const confirmDeleteRestaurant = async (restaurantId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
          `http://localhost:8082/api/restaurant/${restaurantId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      if (response.ok) {
        setRestaurants((prev) =>
            prev.filter((restaurant) => restaurant.id !== restaurantId)
        );
        setConfirmationId(null);
      } else {
        console.error("Nie udało się usunąć restauracji:", response.statusText);
        alert("Wystąpił problem podczas usuwania restauracji.");
      }
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
      alert("Nie udało się połączyć z serwerem.");
    }
  };

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

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
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
      setTimeout(() => setSuccessMessage(""), 3000);
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

      fetchOwnerRestaurants();
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
                      <CardBody className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <CardTitle tag="h5" className="text-warning">
                              {restaurant.name}
                            </CardTitle>
                            <CardSubtitle className="mb-2 phone">
                              Telefon: <span className="text-success">{restaurant.phone}</span>
                            </CardSubtitle>
                            <a
                                href={restaurant.webside}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-success"
                            >
                              {restaurant.webside}
                            </a>
                          </div>
                          <Button
                              color="danger"
                              className="mt-3"
                              onClick={() => setConfirmationId(restaurant.id)}
                          >
                            Usuń
                          </Button>
                        </div>
                        {confirmationId === restaurant.id && (
                            <div className="text-center mt-3">
                              <p>Czy na pewno chcesz usunąć tę restaurację?</p>
                              <Button
                                  color="success"
                                  onClick={() => confirmDeleteRestaurant(restaurant.id)}
                                  style={{ marginRight: "10px" }}
                              >
                                Tak
                              </Button>
                              <Button
                                  color="danger"
                                  onClick={() => setConfirmationId(null)}
                              >
                                Nie
                              </Button>
                            </div>
                        )}
                        <div className="mt-3">
                          <Button
                              color="primary"
                              className="mt-2"
                              onClick={() => toggleCategoryMenu(restaurant.id)}
                          >
                            Wybierz kategorie dla restauracji
                          </Button>
                          {categoryMenuOpen[restaurant.id] && (
                              <div className="mt-2">
                                <h6 className="text-muted">Kategorie:</h6>
                                <div className="categories-container">
                                  {categories.map((category) => (
                                      <div
                                          key={category.id}
                                          className={`category-item ${
                                              selectedCategories[restaurant.id]?.includes(category.id)
                                                  ? "selected"
                                                  : ""
                                          }`}
                                          onClick={() => handleCategoryChange(restaurant.id, category.id)}
                                      >
                                        {category.name}
                                      </div>
                                  ))}
                                </div>
                                <div className="form-button-container">
                                <Button
                                    color="success"
                                    className="mt-2"
                                    onClick={() => handleSaveCategories(restaurant.id)}
                                >
                                  Zapisz kategorie
                                </Button>
                                </div>
                              </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                ))}
                {restaurants.length === 0 && isLoggedIn && (
                    <h4 className="text-center text-muted text-primary">
                      Brak restauracji do wyświetlenia.
                    </h4>
                )}
                {!isLoggedIn && (
                    <>
                      <h4 className="text-center text-muted text-primary">
                        Załóż konto, żeby móc dodawać restauracje
                      </h4>
                      <div className="form-button-container">
                        <Link to="/register-page">
                          <Button color="primary">Zarejestruj się</Button>
                        </Link>
                      </div>
                    </>
                )}
              </div>
            </Col>
          </Row>

          {isLoggedIn && (
              <Row id="add-restaurant" className="form-button-container">
                <Col className="text-center">
                  <Button
                      color="primary"
                      onClick={() => {
                        setIsAddingRestaurant(!isAddingRestaurant);
                        setSuccessMessage("");
                      }}
                  >
                    {isAddingRestaurant ? "Anuluj" : "Dodaj Restaurację"}
                  </Button>
                </Col>
              </Row>
          )}

          {isLoggedIn && isAddingRestaurant && (
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
                      <Label>Wybierz lokalizację na mapie lub wpisz adres poniżej</Label>
                      <LocationPicker onLocationSelect={handleLocationSelect} />
                    </FormGroup>
                    <p>
                      Wybrana lokalizacja: {formData.location.latitude}, {formData.location.longitude}
                    </p>
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
        <DemoFooter />
      </>
  );
}

export default Index;
