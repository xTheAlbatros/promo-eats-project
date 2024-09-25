package org.example.promoserver.Restaurant;

import org.example.promoserver.Models.Restaurants;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurants, Integer> {

}
