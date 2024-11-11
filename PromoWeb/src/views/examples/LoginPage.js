import React, { useState } from "react";
import { Button, Card, Form, Input, Container, Row, Col, FormFeedback } from "reactstrap";
import { useNavigate } from "react-router-dom";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setSuccessMessage('');

        const validationErrors = {};
        if (!formData.email) validationErrors.email = 'Email jest wymagany';
        if (!formData.password) validationErrors.password = 'Hasło jest wymagane';
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const response = await fetch('http://localhost:8082/api/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccessMessage('Logowanie zakończone sukcesem!');
                setTimeout(async () => {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    navigate('/index');
                }, 2000);
            } else {
                setLoginError('Niepoprawne dane logowania');
            }
        } catch (error) {
            console.error('Błąd połączenia:', error);
            setLoginError('Wystąpił błąd podczas logowania.');
        }
    };


    return (
        <>
            <ExamplesNavbar />
            <div
                className="page-header"
                style={{
                    backgroundImage: "url(" + require("assets/img/login-image.jpg") + ")",
                }}
            >
                <div className="filter" />
                <Container>
                    <Row>
                        <Col className="ml-auto mr-auto" lg="4">
                            <Card className="card-register ml-auto mr-auto">
                                <h3 className="title mx-auto">Logowanie</h3>
                                <Form className="register-form" onSubmit={handleSubmit}>
                                    <label>Email</label>
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        invalid={!!errors.email}
                                    />
                                    <FormFeedback>{errors.email}</FormFeedback>

                                    <label>Hasło</label>
                                    <Input
                                        placeholder="Hasło"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        invalid={!!errors.password}
                                    />
                                    <FormFeedback>{errors.password}</FormFeedback>

                                    <Button block className="btn-round" color="success" type="submit">
                                        Zaloguj się
                                    </Button>
                                    {loginError && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{loginError}</p>}
                                    {successMessage && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
                                </Form>
                                <div className="forgot mt-2">
                                    <Button
                                        className="btn-link"
                                        color="danger"
                                        href="/register-page"
                                    >
                                        Nie masz konta? Zarejestruj się
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default LoginPage;
