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
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.example.promoserver.Restaurant.exception.RestaurantNotFoundException;
import org.example.promoserver.Restaurant.exception.RestaurantBadRequestException;
import org.example.promoserver.Shared.DistanceCalculator;
import org.example.promoserver.User.UserRepository;
import org.example.promoserver.User.exception.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

public class RestaurantServiceTest {

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

    // Test 1: Sprawdza metode getAllRestaurant() gdy restauracje sa dostepne
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

    // Test 2: Sprawdza metode getAllRestaurant() gdy nie ma restauracji
    @Test
    public void testGetAllRestaurant_WhenNoRestaurantsPresent() {

        when(restaurantRepository.findAll()).thenReturn(Collections.emptyList());


        assertThrows(RestaurantNotFoundException.class, () -> {
            restaurantService.getAllRestaurant();
        });
    }

    // Test 3: Sprawdza metode saveRestaurant()
    @Test
    public void testSaveRestaurant() {

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


        restaurantService.saveRestaurant(addRestaurant);


        verify(restaurantRepository, times(1)).save(restaurant);
    }

    // Test 4: Sprawdza metode deleteRestaurant() gdy restauracja istnieje
    @Test
    public void testDeleteRestaurant_WhenRestaurantIsPresent() {

        Integer restaurantId = 1;
        Restaurants restaurant = new Restaurants();
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));


        restaurantService.deleteRestaurant(restaurantId);


        verify(restaurantRepository, times(1)).deleteById(restaurantId);
    }

    // Test 5: Sprawdza metode deleteRestaurant() gdy restauracja nie istnieje
    @Test
    public void testDeleteRestaurant_WhenRestaurantIsNotPresent() {

        Integer restaurantId = 1;
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.empty());

        assertThrows(RestaurantNotFoundException.class, () -> {
            restaurantService.deleteRestaurant(restaurantId);
        });
    }

    // Test 6: Sprawdza metode findRestaurantById() gdy restauracja istnieje
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

    // Test 7: Sprawdza metode findRestaurantById() gdy restauracja nie istnieje
    @Test
    public void testFindRestaurantById_WhenRestaurantIsNotPresent() {
        Integer restaurantId = 1;
        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.empty());

        assertThrows(RestaurantNotFoundException.class, () -> {
            restaurantService.findRestaurantById(restaurantId);
        });
    }

    // Test 8: Sprawdza metode findRestaurantsByLocationAndRange() gdy restauracje sa w zasiegu
    @Test
    public void testFindRestaurantsByLocationAndRange_WhenRestaurantsWithinRange() {
        Location location = new Location();
        location.setLatitude(52.2297);
        location.setLongitude(21.0122);
        int range = 10;

        Restaurants restaurant = new Restaurants();
        restaurant.setLocation(location);
        List<Restaurants> restaurantList = Arrays.asList(restaurant);

        when(restaurantRepository.findAll()).thenReturn(restaurantList);
        when(restaurantMapper.mapRestaurantsToView(any())).thenReturn(new ViewRestaurant());

        try (MockedStatic<DistanceCalculator> utilities = mockStatic(DistanceCalculator.class)) {
            utilities.when(() -> DistanceCalculator.calculateDistance(any(), any())).thenReturn(5.0);

            List<ViewRestaurant> result = restaurantService.findRestaurantsByLocationAndRange(location, range);

            assertNotNull(result);
            assertEquals(1, result.size());
        }
    }

    // Test 9: Sprawdza metode findRestaurantsByLocationAndRange() gdy brak restauracji w zasiegu
    @Test
    public void testFindRestaurantsByLocationAndRange_WhenNoRestaurantsWithinRange() {
        Location location = new Location();
        location.setLatitude(52.2297);
        location.setLongitude(21.0122);
        int range = 10;

        Restaurants restaurant = new Restaurants();
        restaurant.setLocation(location);
        List<Restaurants> restaurantList = Arrays.asList(restaurant);

        when(restaurantRepository.findAll()).thenReturn(restaurantList);

        try (MockedStatic<DistanceCalculator> utilities = mockStatic(DistanceCalculator.class)) {
            utilities.when(() -> DistanceCalculator.calculateDistance(any(), any())).thenReturn(20.0);

            assertThrows(RestaurantNotFoundException.class, () -> {
                restaurantService.findRestaurantsByLocationAndRange(location, range);
            });
        }
    }

    // Test 10: Sprawdza metode addOwnerToRestaurant() gdy restauracja i uzytkownik istnieja
    @Test
    public void testAddOwnerToRestaurant_WhenBothExist() {
        Integer ownerId = 1;
        Integer restaurantId = 1;

        Restaurants restaurant = new Restaurants();
        Users user = new Users();

        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));
        when(userRepository.findById(ownerId)).thenReturn(Optional.of(user));

        restaurantService.addOwnerToRestaurant(ownerId, restaurantId);

        verify(restaurantRepository, times(1)).findById(restaurantId);
        verify(userRepository, times(1)).findById(ownerId);
        assertEquals(user, restaurant.getUsers());
    }

    // Test 11: Sprawdza metodę addOwnerToRestaurant() gdy restauracja nie istnieje
    @Test
    public void testAddOwnerToRestaurant_WhenRestaurantNotFound() {
        Integer ownerId = 1;
        Integer restaurantId = 1;

        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.empty());

        assertThrows(RestaurantNotFoundException.class, () -> {
            restaurantService.addOwnerToRestaurant(ownerId, restaurantId);
        });
    }

    // Test 12: Sprawdza metodę addOwnerToRestaurant() gdy uzytkownik nie istnieje
    @Test
    public void testAddOwnerToRestaurant_WhenUserNotFound() {
        Integer ownerId = 1;
        Integer restaurantId = 1;

        Restaurants restaurant = new Restaurants();

        when(restaurantRepository.findById(restaurantId)).thenReturn(Optional.of(restaurant));
        when(userRepository.findById(ownerId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            restaurantService.addOwnerToRestaurant(ownerId, restaurantId);
        });
    }

    // Test 13: Sprawdza metode saveRestaurant() z nieprawidlowymi danymi
    @Test
    public void testSaveRestaurant_WithInvalidData() {
        AddRestaurant addRestaurant = new AddRestaurant();

        assertThrows(RestaurantBadRequestException.class, () -> {
            restaurantService.saveRestaurant(addRestaurant);
        });
    }
}

