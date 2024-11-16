import React, { useState, useEffect, useCallback } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Card,
    CardBody,
    CardSubtitle,
} from "reactstrap";

function PromotionManager({ restaurantId, token }) {
    const [promotions, setPromotions] = useState([]);
    const [isAddingPromotion, setIsAddingPromotion] = useState(false);
    const [promotionData, setPromotionData] = useState({
        description: "",
        startTime: "",
        endTime: "",
    });

    const fetchPromotions = useCallback(async () => {
        try {
            const response = await fetch(
                `http://localhost:8082/api/restaurant/${restaurantId}/promotions`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setPromotions(data);
            } else {
                console.error("Failed to fetch promotions");
            }
        } catch (error) {
            console.error("Error fetching promotions:", error);
        }
    }, [restaurantId, token]);

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPromotionData({ ...promotionData, [name]: value });
    };

    const handleAddPromotion = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8082/api/promotion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description: promotionData.description,
                    startTime: promotionData.startTime,
                    endTime: promotionData.endTime,
                    restaurant: { id: restaurantId }, // kluczowy element
                }),
            });

            if (response.ok) {
                setPromotionData({ description: "", startTime: "", endTime: "" });
                setIsAddingPromotion(false);
                fetchPromotions();
            } else {
                const errorData = await response.json();
                console.error("Błąd przy dodawaniu promocji:", errorData);
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
        }
    };


    const handleDeletePromotion = async (promotionId) => {
        try {
            const response = await fetch(
                `http://localhost:8082/api/promotion/${promotionId}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.ok) {
                await fetchPromotions(); // Odśwież promocje

                // Jeśli po usunięciu nie ma już żadnych promocji, odśwież stronę
                if (promotions.length === 1) {
                    window.location.reload();
                }
            } else {
                console.error("Failed to delete promotion");
            }
        } catch (error) {
            console.error("Error deleting promotion:", error);
        }
    };


    return (
        <div>
            <h5 className="text-warning">Promocje</h5>
            {promotions.map((promotion) => (
                <Card key={promotion.id} className="promotion-card">
                    <CardBody>
                        <h5>{promotion.description}</h5>
                        <CardSubtitle>
                            Od: {new Date(promotion.startTime).toLocaleString()} <br/>
                            Do: {new Date(promotion.endTime).toLocaleString()}
                        </CardSubtitle>
                        <Button
                            color="danger"
                            className="mt-2"
                            onClick={() => handleDeletePromotion(promotion.id)}
                        >
                            Usuń
                        </Button>
                    </CardBody>
                </Card>
            ))}

            <Button
                color="info"
                className="mt-3"
                onClick={() => setIsAddingPromotion(!isAddingPromotion)}
            >
                {isAddingPromotion ? "Anuluj" : "Dodaj Promocję"}
            </Button>

            {isAddingPromotion && (
                <Form onSubmit={handleAddPromotion} className="mt-3">
                    <FormGroup>
                        <Label for="description">Opis Promocji</Label>
                        <Input
                            type="text"
                            name="description"
                            id="description"
                            value={promotionData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="startTime">Czas rozpoczęcia</Label>
                        <Input
                            type="datetime-local"
                            name="startTime"
                            id="startTime"
                            value={promotionData.startTime}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="endTime">Czas zakończenia</Label>
                        <Input
                            type="datetime-local"
                            name="endTime"
                            id="endTime"
                            value={promotionData.endTime}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <Button color="success" type="submit">
                        Zapisz Promocję
                    </Button>
                </Form>
            )}
        </div>

    );
}

export default PromotionManager;
