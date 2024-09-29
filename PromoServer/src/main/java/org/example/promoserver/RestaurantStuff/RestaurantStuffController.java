package org.example.promoserver.RestaurantStuff;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Categories;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
