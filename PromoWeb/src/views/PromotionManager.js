import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Card,
    CardBody,
} from "reactstrap";
import "./PromotionManager.css";

function PromotionManager({ restaurantId, token }) {
    const [promotions, setPromotions] = useState([]);
    const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
    const [promotionData, setPromotionData] = useState({
        description: "",
        startTime: "",
        endTime: "",
    });
    const [promotionErrors, setPromotionErrors] = useState({});
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [promotionImages, setPromotionImages] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const formContainerRef = useRef(null);

    const fetchPromotionImages = async (promotionId) => {
        try {
            const response = await fetch(
                `http://localhost:8082/api/promotion/${promotionId}/images`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.ok) {
                const images = await response.json();
                setPromotionImages((prevImages) => ({
                    ...prevImages,
                    [promotionId]: images,
                }));
            } else {
                console.error("Failed to fetch images");
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

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

                for (const promotion of data) {
                    fetchPromotionImages(promotion.id);
                }
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

    const validatePromotionDates = (startTime, endTime) => {
        const errors = {};
        const now = new Date();

        if (new Date(startTime) < now) {
            errors.startTime = "Data rozpoczęcia nie może być wcześniejsza niż aktualna.";
        }

        if (new Date(endTime) < now) {
            errors.endTime = "Data zakończenia nie może być wcześniejsza niż aktualna.";
        }

        if (new Date(endTime) < new Date(startTime)) {
            errors.endTime = "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.";
        }

        return errors;
    };

    const handleAddOrEditPromotion = async (e) => {
        e.preventDefault();

        // Walidacja dat
        const dateErrors = validatePromotionDates(
            promotionData.startTime,
            promotionData.endTime
        );

        if (Object.keys(dateErrors).length > 0) {
            setPromotionErrors(dateErrors);
            return;
        }

        setPromotionErrors({});

        const url = editingPromotion
            ? "http://localhost:8082/api/promotion"
            : `http://localhost:8082/api/promotion`;
        const method = editingPromotion ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: editingPromotion?.id,
                    description: promotionData.description,
                    startTime: promotionData.startTime,
                    endTime: promotionData.endTime,
                    restaurant: { id: restaurantId },
                }),
            });

            if (response.ok) {
                setEditingPromotion(null);
                setPromotionData({ description: "", startTime: "", endTime: "" });
                setIsAddingOrEditing(false);
                fetchPromotions();
            } else {
                const errorData = await response.json();
                console.error("Błąd przy dodawaniu/edytowaniu promocji:", errorData);
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
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.ok) {
                await fetchPromotions();
            } else {
                console.error("Failed to delete promotion");
            }
        } catch (error) {
            console.error("Error deleting promotion:", error);
        }
    };

    const handleEditPromotion = (promotion) => {
        setEditingPromotion(promotion);
        setPromotionData({
            description: promotion.description,
            startTime: promotion.startTime,
            endTime: promotion.endTime,
        });
        setIsAddingOrEditing(true);

        if (formContainerRef.current) {
            formContainerRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCancel = () => {
        setEditingPromotion(null);
        setPromotionData({ description: "", startTime: "", endTime: "" });
        setIsAddingOrEditing(false);
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAddImage = async (promotionId) => {
        if (!imageFile) {
            alert("Wybierz obraz przed dodaniem.");
            return;
        }

        let imageUrl = null;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "default_preset");

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/dsvml3sln/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                imageUrl = data.secure_url;
            } else {
                console.error("Image upload failed");
                return;
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            return;
        }

        try {
            const imageBody = {
                name: imageFile.name,
                path: imageUrl,
                promotion: { id: promotionId },
            };

            const imageResponse = await fetch("http://localhost:8082/api/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(imageBody),
            });

            if (imageResponse.ok) {
                setImageFile(null);
                fetchPromotionImages(promotionId);
            } else {
                console.error("Failed to save image in the database");
            }
        } catch (error) {
            console.error("Error saving image:", error);
        }
    };

    const handleDeleteImage = async (imageId, promotionId) => {
        try {
            const response = await fetch(`http://localhost:8082/api/image/${imageId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                fetchPromotionImages(promotionId);
            } else {
                console.error("Failed to delete image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div className="promotion-container">
            <h1 className="promotion-header">Promocje:</h1>
            {promotions.map((promotion) => (
                <Card key={promotion.id} className="promotion-card">
                    <CardBody>
                        <h5 className="promotion-title">{promotion.description}</h5>
                        <div className="promotion-dates">
                            <strong>Od:</strong> {new Date(promotion.startTime).toLocaleString()} <br />
                            <strong>Do:</strong> {new Date(promotion.endTime).toLocaleString()}
                        </div>
                        <div className="images-container">
                            {promotionImages[promotion.id]?.map((image) => (
                                <div className="image-wrapper" key={image.id}>
                                    <img
                                        src={image.path}
                                        alt={image.name}
                                        className="promotion-image"
                                    />
                                    <button
                                        className="delete-image-btn"
                                        onClick={() => handleDeleteImage(image.id, promotion.id)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <form
                            className="promotion-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddImage(promotion.id);
                            }}
                        >
                            <label htmlFor={`imageFile-${promotion.id}`}>Dodaj obraz:</label>
                            <input
                                type="file"
                                id={`imageFile-${promotion.id}`}
                                onChange={handleFileChange}
                            />
                            <button type="submit" className="btn btn-success">
                                Dodaj obraz
                            </button>
                        </form>
                        <div className="promotion-buttons" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleEditPromotion(promotion)}
                            >
                                Edytuj Promocję
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeletePromotion(promotion.id)}
                            >
                                Usuń Promocję
                            </button>
                        </div>
                    </CardBody>
                </Card>
            ))}
            <div ref={formContainerRef}>
                {isAddingOrEditing && (
                    <Form onSubmit={handleAddOrEditPromotion}>
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
                            <Label for="startTime">Data rozpoczęcia</Label>
                            <Input
                                type="datetime-local"
                                name="startTime"
                                id="startTime"
                                value={promotionData.startTime}
                                onChange={handleInputChange}
                                invalid={!!promotionErrors.startTime}
                                required
                            />
                            {promotionErrors.startTime && (
                                <div className="text-danger">{promotionErrors.startTime}</div>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="endTime">Data zakończenia</Label>
                            <Input
                                type="datetime-local"
                                name="endTime"
                                id="endTime"
                                value={promotionData.endTime}
                                onChange={handleInputChange}
                                invalid={!!promotionErrors.endTime}
                                required
                            />
                            {promotionErrors.endTime && (
                                <div className="text-danger">{promotionErrors.endTime}</div>
                            )}
                        </FormGroup>
                        <div className="form-buttons"
                             style={{display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px"}}>
                            <Button color="success" type="submit">
                                {editingPromotion ? "Zapisz Zmiany" : "Dodaj Promocję"}
                            </Button>
                            <Button color="danger" type="button" onClick={handleCancel}>
                                Anuluj
                            </Button>
                        </div>
                    </Form>
                )}
                {!isAddingOrEditing && (
                    <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                        <Button color="info" onClick={() => setIsAddingOrEditing(true)}>
                            <i className="nc-icon nc-simple-add" style={{ marginRight: "10px" }}></i>
                            Dodaj Promocję
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PromotionManager;
