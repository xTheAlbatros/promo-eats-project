import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";
import PromotionManager from "./PromotionManager";

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
                // Dodaj kategorię do bazy danych
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
            {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="mb-3 shadow-sm">
                    <CardBody className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
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
                            </div>
                            <div>
                                <Button
                                    color="warning"
                                    className="mt-3"
                                    onClick={() => handleEditRestaurant(restaurant)}
                                    style={{ marginRight: "10px" }}
                                >
                                    Edytuj
                                </Button>
                                <Button
                                    color="danger"
                                    className="mt-3"
                                    onClick={() => setConfirmationId(restaurant.id)}
                                >
                                    Usuń
                                </Button>
                            </div>
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
                                <Button color="danger" onClick={() => setConfirmationId(null)}>
                                    Nie
                                </Button>
                            </div>
                        )}
                        <div className="mt-3">
                            <Button
                                color="info"
                                className="mt-2"
                                onClick={() => toggleCategoryMenu(restaurant.id)}
                            >
                                Wybierz kategorie dla restauracji
                            </Button>
                            {categoryMenuOpen[restaurant.id] && (
                                <div className="mt-2">
                                    <h6 className="text-muted">Kategorie:</h6>
                                    <div className="categories-container">
                                        {categories.map((category) => {
                                            const isPersisted =
                                                persistedCategories[restaurant.id]?.includes(
                                                    category.id
                                                );

                                            return (
                                                <div
                                                    key={category.id}
                                                    className={`category-item ${
                                                        isPersisted ? "selected" : ""
                                                    }`}
                                                    style={{
                                                        backgroundColor: isPersisted
                                                            ? "green"
                                                            : "transparent",
                                                        color: isPersisted ? "white" : "black",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleCategoryClick(
                                                            restaurant.id,
                                                            category.id,
                                                            isPersisted
                                                        )
                                                    }
                                                >
                                                    {category.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {notificationMessage && (
                                        <div className={`notification-${notificationType}`}>
                                            {notificationMessage}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <PromotionManager restaurantId={restaurant.id} token={token} />
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default RestaurantList;
