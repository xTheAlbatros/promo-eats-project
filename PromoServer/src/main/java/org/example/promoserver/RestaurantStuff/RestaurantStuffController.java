package org.example.promoserver.RestaurantStuff;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Categories;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class RestaurantStuffController {

    private final RestaurantStuffService restaurantStuffService;

    @PostMapping("/category")
    public ResponseEntity<Void> addCategory(@RequestBody Categories category) {
        restaurantStuffService.addCategory(category);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        restaurantStuffService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories")
    public List<Categories> getAllCategories() {
        return restaurantStuffService.getAllCategories();
    }

    @GetMapping("/restaurant/{id}/categories")
    public List<Categories> getAllCategoriesForRestaurant(@PathVariable Integer id) {
        return restaurantStuffService.getAllCategoriesForRestaurant(id);
    }

    @PostMapping("/restaurant/{restaurant_id}/category/{category_id}")
    public ResponseEntity<Void> addCategoryToRestaurant(@PathVariable Integer restaurant_id, @PathVariable Integer category_id) {
        restaurantStuffService.addCategoryToRestaurant(restaurant_id, category_id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/restaurant/favourites")
    public List<ViewRestaurant> getAllFavourites(Principal connectedUser) {
        return restaurantStuffService.getAllFavouritesRestaurantsForUser(connectedUser);
    }

    @PostMapping("/restaurant/{id}/favourite")
    public ResponseEntity<?> addFavouriteRestaurantToUser(@PathVariable Integer id, Principal connectedUser) {
        restaurantStuffService.addFavouriteRestaurantForUser(connectedUser, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/restaurant/{id}/favourite")
    public ResponseEntity<?> deleteFavouriteRestaurantFromUser(@PathVariable Integer id, Principal connectedUser) {
        restaurantStuffService.deleteFavouriteRestaurantForUser(connectedUser, id);
        return ResponseEntity.ok().build();
    }
}
