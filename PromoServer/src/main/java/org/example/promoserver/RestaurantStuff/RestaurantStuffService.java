package org.example.promoserver.RestaurantStuff;

import org.example.promoserver.Restaurant.exception.RestaurantNotFoundException;
import org.example.promoserver.RestaurantStuff.validator.RestaurantStuffValidator;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Categories;
import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Models.RestaurantsCategories;
import org.example.promoserver.Restaurant.RestaurantRepository;
import org.example.promoserver.RestaurantStuff.exception.CategoryNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RestaurantStuffService {

    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantsCategoriesRepository restaurantsCategoriesRepository;

    public void addCategory(Categories category) {
        RestaurantStuffValidator.checkCategory(category);
        categoryRepository.save(category);
    }

    public void deleteCategory(Integer id) {
        Categories category = categoryRepository.findById(id)
                .orElseThrow(CategoryNotFoundException::new);
        categoryRepository.delete(category);
    }

    public List<Categories> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Categories> getAllCategoriesForRestaurant(Integer restaurantId) {
        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);
        List<RestaurantsCategories> restaurantCategories = restaurantsCategoriesRepository.findAllByRestaurants(restaurant);

        return restaurantCategories.stream()
                .map(RestaurantsCategories::getCategories)
                .collect(Collectors.toList());
    }

    public void addCategoryToRestaurant(Integer restaurantId, Integer categoryId) {
        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);
        Categories category = categoryRepository.findById(categoryId)
                .orElseThrow(CategoryNotFoundException::new);

        RestaurantsCategories restaurantsCategories = new RestaurantsCategories();
        restaurantsCategories.setRestaurants(restaurant);
        restaurantsCategories.setCategories(category);

        restaurantsCategoriesRepository.save(restaurantsCategories);
    }
}

