package org.example.promoserver.Restaurant;

import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurants, Integer> {

    List<Restaurants> findAllByUsers(Users users);

}
