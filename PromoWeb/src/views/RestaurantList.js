import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";
import PromotionManager from "./PromotionManager";
import "./RestaurantList.css"
function RestaurantList({
                            restaurants,
                            categories,
                            categoryMenuOpen,
                            toggleCategoryMenu,
                            confirmDeleteRestaurant,
                            setConfirmationId,
                            confirmationId,
                            token,
                            handleEditRestaurant,
                            notificationMessage,
                            notificationType,
                            showNotification,
                        }) {
    const [persistedCategories, setPersistedCategories] = useState({});

    useEffect(() => {
        const fetchPersistedCategories = async () => {
            try {
                const newPersistedCategories = {};
                for (const restaurant of restaurants) {
                    const response = await fetch(
                        `http://localhost:8082/api/restaurant/${restaurant.id}/categories`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        newPersistedCategories[restaurant.id] = data.map(
                            (category) => category.id
                        );
                    }
                }
                setPersistedCategories(newPersistedCategories);
            } catch (error) {
                console.error("Błąd podczas pobierania kategorii:", error);
            }
        };

        if (restaurants.length > 0) {
            fetchPersistedCategories();
        }
    }, [restaurants, token]);


    const [promotionVisibility, setPromotionVisibility] = useState({});

    const togglePromotionsVisibility = (restaurantId) => {
        setPromotionVisibility((prev) => ({
            ...prev,
            [restaurantId]: !prev[restaurantId], // Przełącz widoczność
        }));
    };


    const handleCategoryClick = async (restaurantId, categoryId, isPersisted) => {
        try {
            if (isPersisted) {
                const response = await fetch(
                    `http://localhost:8082/api/restaurant/${restaurantId}/category/${categoryId}`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    setPersistedCategories((prev) => ({
                        ...prev,
                        [restaurantId]: prev[restaurantId].filter((id) => id !== categoryId),
                    }));
                    showNotification("Kategoria została usunięta.", "success");
                } else {
                    showNotification("Nie udało się usunąć kategorii.", "error");
                }
            } else {
                const response = await fetch(
                    `http://localhost:8082/api/restaurant/${restaurantId}/category/${categoryId}`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    setPersistedCategories((prev) => ({
                        ...prev,
                        [restaurantId]: [...(prev[restaurantId] || []), categoryId],
                    }));
                    showNotification("Kategoria została dodana.", "success");
                } else {
                    showNotification("Nie udało się dodać kategorii.", "error");
                }
            }
        } catch (error) {
            showNotification("Błąd połączenia z serwerem.", "error");
        }
    };

    return (
        <div className="restaurant-list">
            <h1 className="restaurant-header">Twoje restauracje:</h1>
            {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="restaurant-card">
                    <CardBody>
                        <div className="d-flex justify-content-between align-items-start">
                            <div className="restaurant-data">
                                <CardTitle tag="h4" className="card-title">
                                    {restaurant.name}
                                </CardTitle>
                                <CardSubtitle className="card-subtitle">
                                    <strong>Telefon:</strong> {restaurant.phone}
                                </CardSubtitle>
                                <p className="card-subtitle">
                                    <strong>Strona:</strong> {restaurant.webside || "Brak danych"}
                                </p>

                                <h2 className="categories-header">Kategorie Twojej restauracji:</h2>
                                <div className="added-categories">
                                    {persistedCategories[restaurant.id]?.map((categoryId) => {
                                        const category = categories.find((cat) => cat.id === categoryId);
                                        return (
                                            <div key={categoryId} className="category-rectangle">
                                                {category?.name || "Nieznana kategoria"}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="button-container">
                                <Button
                                    color="info"
                                    onClick={() => handleEditRestaurant(restaurant)}
                                >
                                    Edytuj
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={() => setConfirmationId(restaurant.id)}
                                >
                                    Usuń
                                </Button>
                            </div>
                        </div>

                        {confirmationId === restaurant.id && (
                            <div className="confirmation-container">
                                <p>Czy na pewno chcesz usunąć tę restaurację?</p>
                                <div className="confirm-btn-container">
                                    <Button
                                        className="confirm-btn confirm-btn-yes"
                                        onClick={() => confirmDeleteRestaurant(restaurant.id)}
                                    >
                                        TAK
                                    </Button>
                                    <Button
                                        className="confirm-btn confirm-btn-no"
                                        onClick={() => setConfirmationId(null)}
                                    >
                                        NIE
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="category-section">
                            <div className="d-flex justify-content-center mt-3">
                                <Button
                                    className="category-button"
                                    onClick={() => toggleCategoryMenu(restaurant.id)}
                                >
                                    Zarządzaj kategoriami
                                </Button>
                            </div>
                            {categoryMenuOpen[restaurant.id] && (
                                <div className="categories-list mt-3">
                                    {categories.map((category) => (
                                        <span
                                            key={category.id}
                                            className={`category-badge ${
                                                persistedCategories[restaurant.id]?.includes(category.id)
                                                    ? "category-selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleCategoryClick(
                                                    restaurant.id,
                                                    category.id,
                                                    persistedCategories[restaurant.id]?.includes(category.id)
                                                )
                                            }
                                        >
              {category.name}
            </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Przycisk do wyświetlania/ukrywania promocji */}
                        <div className="d-flex justify-content-center mt-3">
                            <Button
                                color="primary"
                                className="toggle-promotions-button"
                                onClick={() => togglePromotionsVisibility(restaurant.id)}
                            >
                                {promotionVisibility[restaurant.id] ? (
                                    <>
                                        <i className="nc-icon nc-minimal-up"></i> Ukryj promocje
                                    </>
                                ) : (
                                    <>
                                        <i className="nc-icon nc-minimal-down"></i> Wyświetl promocje
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Sekcja promocji - widoczna tylko gdy aktywna */}
                        {promotionVisibility[restaurant.id] && (
                            <div className="promotion-section">
                                <PromotionManager
                                    restaurantId={restaurant.id}
                                    token={token}
                                />
                            </div>
                        )}
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default RestaurantList;
