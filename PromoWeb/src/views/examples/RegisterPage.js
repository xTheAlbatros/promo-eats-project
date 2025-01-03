import React, { useState } from "react";
import { Button, Card, Form, Input, Container, Row, Col, FormFeedback } from "reactstrap";
import { useNavigate } from "react-router-dom";
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";

function RegisterPage() {
  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("register-page");
    return function cleanup() {
      document.body.classList.remove("register-page");
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    accountType: 'OWNER'
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = 'Imię jest wymagane';
    if (!formData.surname.trim()) formErrors.surname = 'Nazwisko jest wymagane';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = 'Wymagany jest poprawny adres e-mail';
    if (!formData.password || formData.password.length < 6) formErrors.password = 'Hasło musi mieć co najmniej 6 znaków';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8082/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        setSuccessMessage('Rejestracja zakończona sukcesem!');
        setTimeout(() => navigate('/index'), 2000);
      } else if (response.status === 409) {
        setErrors({ email: 'Podany e-mail jest już zarejestrowany.' });
      } else {
        const errorData = await response.json();
        setErrors({ form: errorData.message || 'Nieznany błąd' });
      }
    } catch (error) {
      console.error('Błąd połączenia:', error);
      setErrors({ form: 'Wystąpił błąd podczas połączenia z serwerem.' });
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
                  <h3 className="title mx-auto">Rejestracja</h3>
                  <Form className="register-form" onSubmit={handleSubmit}>
                    <label>Imię</label>
                    <Input
                        placeholder="Imię"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        invalid={!!errors.name}
                    />
                    <FormFeedback>{errors.name}</FormFeedback>

                    <label>Nazwisko</label>
                    <Input
                        placeholder="Nazwisko"
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        invalid={!!errors.surname}
                    />
                    <FormFeedback>{errors.surname}</FormFeedback>

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

                    <Button block className="btn-round mt-2" color="success" type="submit">
                      Zarejestruj się
                    </Button>
                    {errors.form && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{errors.form}</p>}
                    {successMessage && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{successMessage}</p>}
                  </Form>
                  <div className="forgot mt-2">
                    <Button
                        className="btn-link"
                        color="danger"
                        href="/login-page"
                    >
                      Masz już konto? Zaloguj się
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

export default RegisterPage;
