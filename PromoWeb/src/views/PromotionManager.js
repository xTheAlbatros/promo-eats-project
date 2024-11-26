import React, { useState, useEffect, useCallback, useRef } from "react";
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
    const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
    const [promotionData, setPromotionData] = useState({
        description: "",
        startTime: "",
        endTime: "",
    });
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [promotionImages, setPromotionImages] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const formContainerRef = useRef(null); // Referencja do kontenera formularza

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

                // Fetch images for each promotion
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

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPromotionData({ ...promotionData, [name]: value });
    };

    const handleAddOrEditPromotion = async (e) => {
        e.preventDefault();

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

        // Przewiń do formularza
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

        // Prześlij obraz do Cloudinary
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

        // Zapisz obraz w bazie danych
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
                fetchPromotionImages(promotionId); // Aktualizuj obrazy dla promocji
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
                fetchPromotionImages(promotionId); // Aktualizuj obrazy dla promocji
            } else {
                console.error("Failed to delete image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <div>
            <h1 className="text-primary text-center">Promocje:</h1>
            {promotions.map((promotion) => (
                <Card key={promotion.id} className="promotion-card">
                    <CardBody>
                        <h5>{promotion.description}</h5>
                        <CardSubtitle>
                            Od: {new Date(promotion.startTime).toLocaleString()} <br/>
                            Do: {new Date(promotion.endTime).toLocaleString()}
                        </CardSubtitle>
                        <div className="images-container mt-3">
                            {promotionImages[promotion.id]?.map((image) => (
                                <div
                                    key={image.id}
                                    style={{
                                        display: "inline-block",
                                        margin: "10px",
                                        position: "relative",
                                    }}
                                >
                                    <img
                                        src={image.path}
                                        alt={image.name}
                                        style={{
                                            maxWidth: "100px",
                                            borderRadius: "5px",
                                        }}
                                    />
                                    <Button
                                        color="danger"
                                        size="sm"
                                        style={{
                                            position: "absolute",
                                            top: "5px",
                                            right: "5px",
                                            borderRadius: "50%",
                                            padding: "0",
                                            width: "20px",
                                            height: "20px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onClick={() => handleDeleteImage(image.id, promotion.id)}
                                    >
                                        &times;
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddImage(promotion.id);
                            }}
                            className="mt-3"
                        >
                            <FormGroup>
                                <Label for={`imageFile-${promotion.id}`}>
                                    Dodaj obraz do promocji:
                                </Label>
                                <Input
                                    type="file"
                                    name="imageFile"
                                    id={`imageFile-${promotion.id}`}
                                    onChange={handleFileChange}
                                />
                            </FormGroup>
                            <Button color="success" type="submit">
                                Dodaj obraz
                            </Button>
                        </Form>
                        <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                            <Button
                                color="warning"
                                onClick={() => handleEditPromotion(promotion)}
                            >
                                Edytuj
                            </Button>
                            <Button
                                color="danger"
                                onClick={() => handleDeletePromotion(promotion.id)}
                            >
                                Usuń
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            ))}

            <div ref={formContainerRef}>
                {isAddingOrEditing && (
                    <Form onSubmit={handleAddOrEditPromotion} className="mt-3">
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

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "10px"
                        }}>
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
                    <Button
                        color="info"
                        className="mt-3"
                        onClick={() => setIsAddingOrEditing(true)}
                    >
                        Dodaj Promocję
                    </Button>
                )}
            </div>
        </div>
    );
}

export default PromotionManager;
