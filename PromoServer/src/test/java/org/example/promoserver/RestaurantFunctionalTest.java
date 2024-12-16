package org.example.promoserver;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.promoserver.Models.Location;
import org.example.promoserver.Models.Images;
import org.example.promoserver.Models.Promotions;
import org.example.promoserver.Models.Categories;
import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.example.promoserver.User.dto.RegisterUser;
import org.example.promoserver.auth.data.AuthenticationRequest;
import org.example.promoserver.auth.data.AuthenticationResponse;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Testy funkcjonalne dla ścieżki biznesowej "end-to-end" z perspektywy właściciela restauracji, który chce
 * Rejestracja użytkownika
 * Dodanie restauracji
 * Dodanie promocji
 * Dodanie zdjecia do jedenej z promocji
 * Dodanie kategori do restauracji
 * Usuniecie restauracji
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RestaurantFunctionalTest {

    private static final String BASE_URL = "http://localhost:8082/api";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TestRestTemplate restTemplate;

    private String token;
    private Integer restaurantId;
    private Integer promotionId;

    @BeforeAll
    void setUp() throws Exception {
        RegisterUser registerData = new RegisterUser();
        registerData.setName("Test");
        registerData.setSurname("Testowy");
        registerData.setEmail("test@gmail.com");
        registerData.setPassword("password123");
        registerData.setAccountType("USER");

        ResponseEntity<String> rawResponse = restTemplate.postForEntity(BASE_URL + "/auth/register", registerData, String.class);

        System.out.println("Status code: " + rawResponse.getStatusCode());
        System.out.println("Response body: " + rawResponse.getBody());

        assertEquals(HttpStatus.OK, rawResponse.getStatusCode(), "Oczekiwano statusu 200, a otrzymano: " + rawResponse.getStatusCode());

        AuthenticationResponse authResponse = new ObjectMapper().readValue(rawResponse.getBody(), AuthenticationResponse.class);
        token = authResponse.getAccessToken();
        assertNotNull(token, "Token nie powinien być nullem.");
    }


    @AfterAll
    void cleanUp() {
        jdbcTemplate.execute("TRUNCATE TABLE promo_eats_test.token CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE promo_eats_test.users CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE promo_eats_test.categories CASCADE");
        jdbcTemplate.execute("ALTER SEQUENCE promo_eats_test.restaurants_id_seq RESTART WITH 1");
        jdbcTemplate.execute("ALTER SEQUENCE promo_eats_test.categories_id_seq RESTART WITH 1");
    }

    @Test
    @Order(1)
    void testAddRestaurant() {
        AddRestaurant addRestaurant = new AddRestaurant();
        addRestaurant.setName("Testowa Restauracja");
        addRestaurant.setPhone("+48123456789");
        addRestaurant.setEmail("test@example.com");

        Location loc = new Location();
        loc.setLatitude(52.2297);
        loc.setLongitude(21.0122);
        addRestaurant.setLocation(loc);

        Map<String, String> openingHours = new HashMap<>();
        openingHours.put("Poniedziałek", "09:00-17:00");
        addRestaurant.setOpeningHours(openingHours);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AddRestaurant> request = new HttpEntity<>(addRestaurant, headers);
        ResponseEntity<Void> response = restTemplate.postForEntity(BASE_URL + "/restaurant", request, Void.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(2)
    void testGetOwnerRestaurantsAndSetId() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<List<ViewRestaurant>> response = restTemplate.exchange(
                BASE_URL + "/restaurants/owner",
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<List<ViewRestaurant>>() {}
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody(), "Lista restauracji jest null");
        assertFalse(response.getBody().isEmpty(), "Lista restauracji jest pusta");

        restaurantId = response.getBody().get(0).getId();
        assertNotNull(restaurantId, "ID restauracji nie powinno być null");
    }

    @Test
    @Order(3)
    void testAddPromotion() {
        Map<String, Object> promotionData = new HashMap<>();
        promotionData.put("description", "Promocja na pizze");
        promotionData.put("startTime", java.time.LocalDateTime.now().toString());
        promotionData.put("endTime", java.time.LocalDateTime.now().plusDays(7).toString());

        Map<String, Object> restaurantMap = new HashMap<>();
        restaurantMap.put("id", restaurantId);
        promotionData.put("restaurant", restaurantMap);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(promotionData, headers);
        ResponseEntity<Void> response = restTemplate.postForEntity(BASE_URL + "/promotion", request, Void.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(4)
    void testGetPromotionsForRestaurantAndSetPromotionId() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<List<Promotions>> response = restTemplate.exchange(
                BASE_URL + "/restaurant/" + restaurantId + "/promotions",
                HttpMethod.GET,
                request,
                new ParameterizedTypeReference<List<Promotions>>() {}
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody(), "Lista promocji jest null");
        assertFalse(response.getBody().isEmpty(), "Lista promocji jest pusta");

        promotionId = response.getBody().get(0).getId();
        assertNotNull(promotionId, "ID promocji nie powinno być null");
    }

    @Test
    @Order(5)
    void testAddImageToPromotion() {
        Map<String, Object> imageData = new HashMap<>();
        imageData.put("name", "promo-image-4");
        imageData.put("path", "/images/promo4.jpg");

        Map<String, Object> promotionMap = new HashMap<>();
        promotionMap.put("id", promotionId);
        imageData.put("promotion", promotionMap);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(imageData, headers);
        ResponseEntity<Void> response = restTemplate.postForEntity(BASE_URL + "/image", request, Void.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(6)
    void testAddCategoryToRestaurant() {
        Categories category = new Categories();
        category.setName("Pizza");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Categories> catRequest = new HttpEntity<>(category, headers);
        ResponseEntity<Void> catResponse = restTemplate.postForEntity(BASE_URL + "/category", catRequest, Void.class);
        assertEquals(HttpStatus.OK, catResponse.getStatusCode());

        ResponseEntity<Void> assignResponse = restTemplate.postForEntity(
                BASE_URL + "/restaurant/" + restaurantId + "/category/1", catRequest, Void.class);

        assertEquals(HttpStatus.OK, assignResponse.getStatusCode());
    }

    @Test
    @Order(7)
    void testDeleteRestaurant() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Void> response = restTemplate.exchange(
                BASE_URL + "/restaurant/" + restaurantId, HttpMethod.DELETE, request, Void.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
}
