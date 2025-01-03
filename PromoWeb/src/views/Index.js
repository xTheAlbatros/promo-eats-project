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
import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Row, Col } from "reactstrap";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import RestaurantList from "./RestaurantList";
import RestaurantForm from "./RestaurantForm";

function Index() {
  const formRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState({});
  const [, setEditingRestaurant] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    webside: "",
    openingHours: {
      Poniedziałek: "",
      Wtorek: "",
      Środa: "",
      Czwartek: "",
      Piątek: "",
      Sobota: "",
      Niedziela: "",
    },
    location: { latitude: "", longitude: "" },
  });
  const [formErrors, setFormErrors] = useState({});
  const [, setSuccessMessage] = useState("");
  const [, setErrorMessage] = useState("");
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

  const showNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage("");
      setNotificationType("");
    }, 3000);
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
      console.error("Błąd podData pobierania kategorii:", error);
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
      const existingCategoriesResponse = await fetch(
          `http://localhost:8082/api/restaurant/${restaurantId}/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      if (!existingCategoriesResponse.ok) {
        showNotification("Błąd podczas pobierania istniejących kategorii.", "error");
        return;
      }

      const existingCategories = await existingCategoriesResponse.json();
      const categoriesNotSaved = categoriesToSave.filter(
          (categoryId) => !existingCategories.some((cat) => cat.id === categoryId)
      );

      if (categoriesNotSaved.length === 0) {
        showNotification("Wybrane kategorie są już przypisane.", "error");
        return;
      }

      for (const categoryId of categoriesNotSaved) {
        await fetch(
            `http://localhost:8082/api/restaurant/${restaurantId}/category/${categoryId}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
        );
      }

      showNotification("Kategorie zostały zapisane.", "success");
    } catch (error) {
      showNotification("Błąd podczas zapisywania kategorii.", "error");
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


      const promotionsResponse = await fetch(
          `http://localhost:8082/api/restaurant/${restaurantId}/promotions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      if (promotionsResponse.ok) {
        const promotions = await promotionsResponse.json();

        for (const promotion of promotions) {
          const deletePromotionResponse = await fetch(
              `http://localhost:8082/api/promotion/${promotion.id}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
          );

          if (!deletePromotionResponse.ok) {
            console.error(
                `Nie udało się usunąć promocji o ID ${promotion.id}:`,
                deletePromotionResponse.statusText
            );
          }
        }
      } else {
        console.error(
            "Nie udało się pobrać promocji przypisanych do restauracji:",
            promotionsResponse.statusText
        );
      }

      const restaurantResponse = await fetch(
          `http://localhost:8082/api/restaurant/${restaurantId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      if (restaurantResponse.ok) {
        setRestaurants((prev) =>
            prev.filter((restaurant) => restaurant.id !== restaurantId)
        );
        setConfirmationId(null);
        setSuccessMessage("Restauracja oraz jej promocje zostały usunięte.");
      } else {
        console.error(
            "Nie udało się usunąć restauracji:",
            restaurantResponse.statusText
        );
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
      const method = formData.id ? "PUT" : "POST";
      const url = "http://localhost:8082/api/restaurant";

      const restaurantResponse = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json().catch(() => ({}));
        setErrorMessage(
            errorData.message || "Wystąpił błąd przy zapisie restauracji."
        );
        return;
      }

      setSuccessMessage(
          formData.id
              ? "Restauracja została zaktualizowana pomyślnie!"
              : "Restauracja została dodana pomyślnie!"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsAddingRestaurant(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        webside: "",
        openingHours: {
          Poniedziałek: "",
          Wtorek: "",
          Środa: "",
          Czwartek: "",
          Piątek: "",
          Sobota: "",
          Niedziela: "",
        },
        location: { latitude: "", longitude: "" },
      });

      fetchOwnerRestaurants();
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
      setErrorMessage("Nie udało się połączyć z serwerem.");
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setFormData({
      id: restaurant.id,
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.phone,
      webside: restaurant.webside,
      openingHours: restaurant.openingHours,
      location: {
        latitude: restaurant.location.latitude,
        longitude: restaurant.location.longitude,
      },
    });
    setIsAddingRestaurant(true);

    // Przewinięcie do formularza
    const targetElement = document.getElementById("add-restaurant");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
      <>
        <IndexNavbar />
        <IndexHeader />
        <Container className="mt-5">
          <Row>
            <Col>
              {restaurants.length === 0 && isLoggedIn && (
                  <h4 className="text-center text-muted text-warning">
                    Brak restauracji do wyświetlenia.
                  </h4>
              )}
              {!isLoggedIn && (
                  <>
                    <h4 className="text-center text-muted text-primary">
                      Załóż konto, żeby móc dodawać restauracje
                    </h4>
                    <div className="form-button-container text-center">
                      <Button color="primary" href="/register-page">
                        Zarejestruj się
                      </Button>
                    </div>
                  </>
              )}
              <RestaurantList
                  restaurants={restaurants}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategoryMenu={toggleCategoryMenu}
                  handleCategoryChange={handleCategoryChange}
                  handleSaveCategories={handleSaveCategories}
                  categoryMenuOpen={categoryMenuOpen}
                  confirmDeleteRestaurant={confirmDeleteRestaurant}
                  setConfirmationId={setConfirmationId}
                  confirmationId={confirmationId}
                  token={localStorage.getItem("access_token")}
                  handleEditRestaurant={handleEditRestaurant}
                  notificationMessage={notificationMessage}
                  notificationType={notificationType}
                  showNotification={showNotification}
              />


            </Col>
          </Row>
          {isLoggedIn && (
              <Row id="add-restaurant" className="form-button-container">
                <Col className="text-center">
                  <Button
                      color="primary"
                      onClick={() => {
                        setIsAddingRestaurant((prev) => {
                          if (!prev) {
                            setFormData({
                              name: "",
                              email: "",
                              phone: "",
                              webside: "",
                              openingHours: {
                                Poniedziałek: "",
                                Wtorek: "",
                                Środa: "",
                                Czwartek: "",
                                Piątek: "",
                                Sobota: "",
                                Niedziela: "",
                              },
                              location: { latitude: "", longitude: "" },
                            });
                          }
                          return !prev;
                        });
                        setEditingRestaurant(null);
                        setSuccessMessage("");
                      }}
                  >
                    {isAddingRestaurant ? "Anuluj" : "Dodaj Restaurację"}
                  </Button>
                </Col>
              </Row>

          )}
          {isLoggedIn && isAddingRestaurant && (
              <Row className="mt-3" ref={formRef}>
                <Col>
                  <RestaurantForm
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleOpeningHoursChange={handleOpeningHoursChange}
                      handleLocationSelect={handleLocationSelect}
                      handleFormSubmit={handleFormSubmit}
                      formErrors={formErrors}
                      editingRestaurant={formData.id}
                  />
                </Col>
              </Row>
          )}
        </Container>
        <DemoFooter />
      </>
  );
}

export default Index;
