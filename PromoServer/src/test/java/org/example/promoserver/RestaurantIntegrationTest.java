package org.example.promoserver;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.promoserver.auth.data.AuthenticationResponse;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Testy integracyjne do testowania przepływu danych
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RestaurantIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String token;

    @BeforeAll
    void setUp() throws Exception {
        Map<String, Object> registerData = new HashMap<>();
        registerData.put("name", "Test");
        registerData.put("surname", "Testowy");
        registerData.put("email", "test@gmail.com");
        registerData.put("password", "test1234");
        registerData.put("accountType", "USER");

        MvcResult authResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerData)))
                .andDo(print()) // Dokładne informacje
                .andExpect(status().isOk())
                .andReturn();


        String authResponseBody = authResult.getResponse().getContentAsString();
        AuthenticationResponse authResponse = objectMapper.readValue(authResponseBody, AuthenticationResponse.class);
        token = authResponse.getAccessToken();
    }

    @AfterAll
    void cleanUp() {
        jdbcTemplate.execute("TRUNCATE TABLE promo_eats_test.token CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE promo_eats_test.users CASCADE");
        jdbcTemplate.execute("ALTER SEQUENCE promo_eats_test.restaurants_id_seq RESTART WITH 1");
    }


    @Test
    @Order(1)
    void testAddRestaurant() throws Exception {
        Map<String, String> openingHours = new HashMap<>();
        openingHours.put("Poniedziałek", "09:00-17:00");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("name", "Testowa Restauracja");
        requestBody.put("phone", "+48123456789");
        requestBody.put("email", "test@example.com");
        requestBody.put("location", Map.of("latitude", 52.2297, "longitude", 21.0122));
        requestBody.put("openingHours", openingHours);

        mockMvc.perform(post("/api/restaurant")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk());
    }

    @Test
    @Order(2)
    void testGetAllRestaurants() throws Exception {
        mockMvc.perform(get("/api/restaurants")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @Order(3)
    void testGetAllRestaurantsForOwner() throws Exception {
        mockMvc.perform(get("/api/restaurants/owner")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @Order(4)
    void testGetRestaurantById() throws Exception {
        mockMvc.perform(get("/api/restaurant/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @Order(5)
    void testUpdateRestaurant() throws Exception {
        Map<String, Object> updateBody = new HashMap<>();
        updateBody.put("id", 1);
        updateBody.put("name", "Zmieniona Nazwa");
        updateBody.put("phone", "+48000000000");

        mockMvc.perform(put("/api/restaurant")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateBody)))
                .andExpect(status().isOk());
    }

    @Test
    @Order(6)
    void testGetRestaurantsByLocationAndRange() throws Exception {
        mockMvc.perform(get("/api/restaurants/location")
                        .param("latitude", "52.2297")
                        .param("longitude", "21.0122")
                        .param("range", "10")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @Order(7)
    void testGetRestaurantsByLocationAndRangeAndCategories() throws Exception {
        mockMvc.perform(post("/api/restaurants/location/categories")
                        .param("latitude", "52.2297")
                        .param("longitude", "21.0122")
                        .param("range", "10")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"Pizza\", \"Kebab\"]"))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(8)
    void testDeleteRestaurant() throws Exception {
        mockMvc.perform(delete("/api/restaurant/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
