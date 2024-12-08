package org.example.promoserver.Restaurant;


import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Location;
import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.dto.UpdateRestaurant;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping("/restaurant")
    public ResponseEntity<Void> addRestaurant(@RequestBody AddRestaurant addRestaurant, Principal connectedUser){
        restaurantService.saveRestaurant(addRestaurant, connectedUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/{id}")
    public ViewRestaurant getRestaurantById(@PathVariable Integer id){
        return restaurantService.findRestaurantById(id);
    }

    @DeleteMapping("/restaurant/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Integer id){
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurants")
    public List<ViewRestaurant> getAllRestaurants(){
        return restaurantService.getAllRestaurant();
    }

    @GetMapping("/restaurants/owner")
    public List<ViewRestaurant> getAllRestaurantsForOwner(Principal connectedUser){
        return restaurantService.getAllRestaurantForOwner(connectedUser);
    }

    @GetMapping("/restaurants/location")
    public List<ViewRestaurant> getRestaurantsByLocationAndRange(@RequestParam Double latitude, @RequestParam Double longitude, @RequestParam int range){
        Location location = new Location();
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        return restaurantService.findRestaurantsByLocationAndRange(location, range);
    }

    @PostMapping("/restaurants/location/categories")
    public List<ViewRestaurant> getRestaurantsByLocationAndRangeAndCategories(@RequestParam Double latitude, @RequestParam Double longitude, @RequestParam int range, @RequestBody List<String> categories){
        Location location = new Location();
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        return restaurantService.findRestaurantsByLocationAndRangeAndCategories(location, range, categories);
    }

    @PutMapping("/restaurant")
    public ResponseEntity<Void> updateRestaurant(@RequestBody UpdateRestaurant updateRestaurant){
        restaurantService.updateRestaurant(updateRestaurant);
        return ResponseEntity.ok().build();
    }
}