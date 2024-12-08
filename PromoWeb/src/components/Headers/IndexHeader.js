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
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function IndexHeader() {
    return (
        <>
            <div
                className="page-header section-dark"
                style={{
                    backgroundImage:
                        "url(" + require("assets/img/antoine-barres.jpg") + ")",
                }}
            >
                <div className="filter" />
                <div className="content-center">
                    <Container>
                        <div className="title-brand">
                            <h1 className="presentation-title">PromoEats</h1>
                        </div>
                        <h2 className="presentation-subtitle text-center">
                            Dołącz do nas i promuj swoje oferty gastranomiczne!
                        </h2>
                        <p className="text-center mt-4 text-light">
                            Wypełnij formularz, aby dodać swoją restaurację!
                        </p>
                        <div className="text-center mt-3">
                            {/* Link do sekcji formularza */}
                            <a
                                href="#add-restaurant"
                                className="btn-arrow"
                                aria-label="Przejdź do formularza dodawania restauracji"
                            >
                                ↓
                            </a>
                        </div>
                    </Container>
                </div>
                {/*<div*/}
                {/*    className="moving-clouds"*/}
                {/*    style={{*/}
                {/*        backgroundImage: "url(" + require("assets/img/clouds.png") + ")",*/}
                {/*    }}*/}
                {/*/>*/}
            </div>
        </>
    );
}

export default IndexHeader;

