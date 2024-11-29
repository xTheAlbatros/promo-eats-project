import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, FormFeedback } from "reactstrap";
import LocationPicker from "./LocationPicker";

function RestaurantForm({
                            formData,
                            handleInputChange,
                            handleOpeningHoursChange,
                            handleLocationSelect,
                            handleFormSubmit,
                            editingRestaurant,
                        }) {
    const [formErrors, setFormErrors] = useState({});

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateWebsite = (website) => {
        const websiteRegex = /^[^\s@]+\.[^\s@]+$/;
        return websiteRegex.test(website);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = "Nazwa restauracji jest wymagana.";
        }
        if (!formData.email || !validateEmail(formData.email)) {
            errors.email = "Wprowadź poprawny adres e-mail.";
        }
        if (formData.webside && !validateWebsite(formData.webside)) {
            errors.webside = "Wprowadź poprawny adres strony internetowej.";
        }
        if (!formData.phone) {
            errors.phone = "Numer telefonu jest wymagany.";
        }
        if (!formData.location.latitude || !formData.location.longitude) {
            errors.location = "Wybierz lokalizację na mapie.";
        }
        if (Object.values(formData.openingHours).some((hours) => !hours)) {
            errors.openingHours = "Uzupełnij godziny otwarcia dla wszystkich dni.";
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            handleFormSubmit(e);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h4>{editingRestaurant ? "Edytuj restaurację" : "Dodaj restaurację"}</h4>
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
                    invalid={!!formErrors.phone}
                />
                <FormFeedback>{formErrors.phone}</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label for="webside">Strona internetowa</Label>
                <Input
                    type="text"
                    name="webside"
                    id="webside"
                    value={formData.webside}
                    onChange={handleInputChange}
                    invalid={!!formErrors.webside}
                />
                <FormFeedback>{formErrors.webside}</FormFeedback>
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
                {formErrors.location && (
                    <p className="text-danger">{formErrors.location}</p>
                )}
            </FormGroup>
            <p>
                Wybrana lokalizacja: {formData.location.latitude},{" "}
                {formData.location.longitude}
            </p>
            <div className="form-button-container">
                <Button color="success" type="submit">
                    {editingRestaurant ? "Zapisz zmiany" : "Dodaj restaurację"}
                </Button>
            </div>
        </Form>
    );
}

export default RestaurantForm;
