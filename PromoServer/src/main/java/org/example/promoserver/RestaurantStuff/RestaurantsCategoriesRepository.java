package org.example.promoserver.RestaurantStuff;

import org.example.promoserver.Models.Categories;
import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Models.RestaurantsCategories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantsCategoriesRepository extends JpaRepository<RestaurantsCategories, Integer> {

    List<RestaurantsCategories> findAllByRestaurants(Restaurants restaurant);

    void deleteByCategories(Categories categories);
}

