package org.example.promoserver.Restaurant;


import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Location;
import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping("/restaurant")
    public ResponseEntity<Void> addRestaurant(@RequestBody AddRestaurant addRestaurant){
        restaurantService.saveRestaurant(addRestaurant);
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

    @GetMapping("/restaurants/location/{range}")
    public List<ViewRestaurant> getRestaurantsByLocationAndRange(@RequestBody Location location, @PathVariable int range){
        return restaurantService.findRestaurantsByLocationAndRange(location, range);
    }

    @PostMapping("/restaurant/{restaurantId}/owner/{ownerId}")
    public ResponseEntity<Void> addOwnerToRestaurant(@PathVariable Integer ownerId, @PathVariable Integer restaurantId){
        restaurantService.addOwnerToRestaurant(ownerId, restaurantId);
        return ResponseEntity.ok().build();
    }

}
