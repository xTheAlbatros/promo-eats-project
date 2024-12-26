package org.example.promoserver;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.example.promoserver.Models.Location;
import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Models.Users;
import org.example.promoserver.Restaurant.RestaurantMapper;
import org.example.promoserver.Restaurant.RestaurantRepository;
import org.example.promoserver.Restaurant.RestaurantService;
import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.dto.UpdateRestaurant;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.example.promoserver.Restaurant.exception.RestaurantNotFoundException;
import org.example.promoserver.Restaurant.exception.RestaurantBadRequestException;
import org.example.promoserver.Shared.DistanceCalculator;
import org.example.promoserver.User.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

/**
 * Testy jednostkowe do testostowania serwisu restauracji
 */
public class RestaurantServiceUnitTest {

    @InjectMocks
    private RestaurantService restaurantService;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private RestaurantMapper restaurantMapper;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test 1: Sprawdza metodę getAllRestaurant() gdy restauracje są dostępne
    @Test
    public void testGetAllRestaurant_WhenRestaurantsArePresent() {

        Restaurants restaurant = new Restaurants();
        restaurant.setName("Testowa Restauracja");
        List<Restaurants> restaurantList = Arrays.asList(restaurant);

        when(restaurantRepository.findAll()).thenReturn(restaurantList);

        ViewRestaurant viewRestaurant = new ViewRestaurant();
        viewRestaurant.setName("Testowa Restauracja");

        when(restaurantMapper.mapRestaurantsToView(restaurant)).thenReturn(viewRestaurant);

        List<ViewRestaurant> result = restaurantService.getAllRestaurant();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Testowa Restauracja", result.get(0).getName());
    }

    // Test 2: Sprawdza metodę getAllRestaurant() gdy nie ma restauracji
    @Test
    public void testGetAllRestaurant_WhenNoRestaurantsPresent() {
        when(restaurantRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(RestaurantNotFoundException.class, () -> restaurantService.getAllRestaurant());
    }

    // Test 3: Sprawdza metodę saveRestaurant() - dane poprawne
    @Test
    public void testSaveRestaurant_WithValidData() {
        Users user = new Users();
        user.setId(10);
        UsernamePasswordAuthenticationToken authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.getPrincipal()).thenReturn(user);

        AddRestaurant addRestaurant = new AddRestaurant();
        addRestaurant.setName("Testowa Restauracja");
        addRestaurant.setPhone("+48123456789");
        addRestaurant.setEmail("test@example.com");
        addRestaurant.setLocation(new Location());
        Map<String, String> openingHours = new HashMap<>();
        openingHours.put("Poniedziałek", "09:00-17:00");
        addRestaurant.setOpeningHours(openingHours);

        Restaurants restaurant = new Restaurants();
        when(restaurantMapper.mapAddToRestaurants(addRestaurant)).thenReturn(restaurant);

        restaurantService.saveRestaurant(addRestaurant, authentication);

        verify(restaurantRepository, times(1)).save(restaurant);
        assertEquals(user, restaurant.getUsers());
    }

    // Test 4: Sprawdza metodę saveRestaurant() - nieprawidłowe dane
    @Test
    public void testSaveRestaurant_WithInvalidData() {
        // Mock Principal
        Users user = new Users();
        UsernamePasswordAuthenticationToken authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.getPrincipal()).thenReturn(user);

        AddRestaurant addRestaurant = new AddRestaurant();

        assertThrows(RestaurantBadRequestException.class, () -> {
            restaurantService.saveRestaurant(addRestaurant, authentication);
        });
    }

    // Test 5: Sprawdza metodę deleteRestaurant() gdy restauracja istnieje
    @Test
    public void testDeleteRestaurant_WhenRestaurantIsPresent() {
        Integer restaurantId = 1;
        Restaurants restaurant = new Restaurants();
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));

        restaurantService.deleteRestaurant(restaurantId);

        verify(restaurantRepository, times(1)).deleteById(restaurantId);
    }

    // Test 6: Sprawdza metodę deleteRestaurant() gdy restauracja nie istnieje
    @Test
    public void testDeleteRestaurant_WhenRestaurantIsNotPresent() {
        Integer restaurantId = 1;
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.empty());

        assertThrows(RestaurantNotFoundException.class, () -> {
            restaurantService.deleteRestaurant(restaurantId);
        });
    }

    // Test 7: Sprawdza metodę findRestaurantById() gdy restauracja istnieje
    @Test
    public void testFindRestaurantById_WhenRestaurantIsPresent() {
        Integer restaurantId = 1;
        Restaurants restaurant = new Restaurants();
        restaurant.setName("Testowa Restauracja");
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));

        ViewRestaurant viewRestaurant = new ViewRestaurant();
        viewRestaurant.setName("Testowa Restauracja");
        when(restaurantMapper.mapRestaurantsToView(restaurant)).thenReturn(viewRestaurant);

        ViewRestaurant result = restaurantService.findRestaurantById(restaurantId);

        assertNotNull(result);
        assertEquals("Testowa Restauracja", result.getName());
    }

    // Test 8: Sprawdza metodę findRestaurantById() gdy restauracja nie istnieje
    @Test
    public void testFindRestaurantById_WhenRestaurantIsNotPresent() {
        Integer restaurantId = 1;
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.empty());

        assertThrows(RestaurantNotFoundException.class, () -> {
            restaurantService.findRestaurantById(restaurantId);
        });
    }

    // Test 9: Sprawdza metodę findRestaurantsByLocationAndRange() gdy restauracje są w zasięgu
    @Test
    public void testFindRestaurantsByLocationAndRange_WhenWithinRange() {
        Location location = new Location();
        location.setLatitude(52.2297);
        location.setLongitude(21.0122);
        int range = 10;

        Restaurants restaurant = new Restaurants();
        restaurant.setLocation(location);
        List<Restaurants> restaurantList = Collections.singletonList(restaurant);

        when(restaurantRepository.findAll()).thenReturn(restaurantList);
        when(restaurantMapper.mapRestaurantsToView(any())).thenReturn(new ViewRestaurant());

        try (MockedStatic<DistanceCalculator> utilities = mockStatic(DistanceCalculator.class)) {
            utilities.when(() -> DistanceCalculator.calculateDistance(any(), any())).thenReturn(5.0);

            List<ViewRestaurant> result = restaurantService.findRestaurantsByLocationAndRange(location, range);

            assertNotNull(result);
            assertEquals(1, result.size());
        }
    }

    // Test 10: Sprawdza metodę findRestaurantsByLocationAndRange() gdy brak restauracji w zasięgu
    @Test
    public void testFindRestaurantsByLocationAndRange_WhenNoRestaurantsWithinRange() {
        Location location = new Location();
        location.setLatitude(52.2297);
        location.setLongitude(21.0122);
        int range = 10;

        Restaurants restaurant = new Restaurants();
        restaurant.setLocation(location);
        List<Restaurants> restaurantList = Collections.singletonList(restaurant);

        when(restaurantRepository.findAll()).thenReturn(restaurantList);

        try (MockedStatic<DistanceCalculator> utilities = mockStatic(DistanceCalculator.class)) {
            utilities.when(() -> DistanceCalculator.calculateDistance(any(), any())).thenReturn(20.0);

            assertThrows(RestaurantNotFoundException.class, () -> {
                restaurantService.findRestaurantsByLocationAndRange(location, range);
            });
        }
    }

    // Test 11: Sprawdza metodę getAllRestaurantForOwner() gdy właściciel ma restauracje
    @Test
    public void testGetAllRestaurantForOwner_WithRestaurants() {
        Users user = new Users();
        user.setId(2);

        UsernamePasswordAuthenticationToken authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.getPrincipal()).thenReturn(user);

        Restaurants restaurant = new Restaurants();
        restaurant.setName("Moja Restauracja");
        restaurant.setUsers(user);

        when(restaurantRepository.findAllByUsers(user)).thenReturn(Collections.singletonList(restaurant));

        ViewRestaurant viewRestaurant = new ViewRestaurant();
        viewRestaurant.setName("Moja Restauracja");
        when(restaurantMapper.mapRestaurantsToView(restaurant)).thenReturn(viewRestaurant);

        List<ViewRestaurant> result = restaurantService.getAllRestaurantForOwner(authentication);
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Moja Restauracja", result.get(0).getName());
    }

    // Test 12: Sprawdza metodę getAllRestaurantForOwner() gdy właściciel nie ma restauracji
    @Test
    public void testGetAllRestaurantForOwner_NoRestaurants() {
        Users user = new Users();
        user.setId(2);

        UsernamePasswordAuthenticationToken authentication = mock(UsernamePasswordAuthenticationToken.class);
        when(authentication.getPrincipal()).thenReturn(user);

        when(restaurantRepository.findAllByUsers(user)).thenReturn(Collections.emptyList());

        assertThrows(RestaurantNotFoundException.class, () -> {
            restaurantService.getAllRestaurantForOwner(authentication);
        });
    }

    // Test 13: Sprawdza metodę updateRestaurant()
    @Test
    public void testUpdateRestaurant() {
        UpdateRestaurant updateRestaurant = new UpdateRestaurant();
        updateRestaurant.setId(1);
        updateRestaurant.setName("Nowa Nazwa");
        updateRestaurant.setEmail("new@example.com");

        Restaurants existing = new Restaurants();
        existing.setId(1);
        existing.setName("Stara Nazwa");
        existing.setEmail("old@example.com");

        when(restaurantRepository.findById(1)).thenReturn(Optional.of(existing));

        restaurantService.updateRestaurant(updateRestaurant);

        verify(restaurantRepository, times(1)).save(existing);
        assertEquals("Nowa Nazwa", existing.getName());
        assertEquals("new@example.com", existing.getEmail());
    }

}
