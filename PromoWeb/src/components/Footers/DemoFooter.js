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
import { Row, Container } from "reactstrap";

function DemoFooter() {
  return (
      <footer className="footer footer-black">
        <Container>
          <Row>
            <nav className="footer-nav">
              <ul>
                <li>
                  <a href="/" target="_self">
                    Strona Główna
                  </a>
                </li>
                <li>
                  <a href="/profile-page" target="_self">
                    Profil
                  </a>
                </li>
              </ul>
            </nav>
          </Row>
        </Container>
      </footer>
  );
}

export default DemoFooter;

