import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";
import PromotionManager from "./PromotionManager";

function RestaurantList({
                            restaurants,
                            categories,
                            selectedCategories,
                            toggleCategoryMenu,
                            handleCategoryChange,
                            handleSaveCategories,
                            categoryMenuOpen,
                            confirmDeleteRestaurant,
                            setConfirmationId,
                            confirmationId,
                            token,
                            handleEditRestaurant,
                            notificationMessage, // Dodano
                            notificationType,    // Dodano
                        }) {

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
                                        {categories.map((category) => (
                                            <div
                                                key={category.id}
                                                className={`category-item ${
                                                    selectedCategories[restaurant.id]?.includes(
                                                        category.id
                                                    )
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleCategoryChange(restaurant.id, category.id)
                                                }
                                            >
                                                {category.name}
                                            </div>
                                        ))}
                                    </div>
                                    {notificationMessage && (
                                        <div className={`notification-${notificationType}`}>
                                            {notificationMessage}
                                        </div>
                                    )}

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
                        <PromotionManager restaurantId={restaurant.id} token={token} />
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default RestaurantList;
