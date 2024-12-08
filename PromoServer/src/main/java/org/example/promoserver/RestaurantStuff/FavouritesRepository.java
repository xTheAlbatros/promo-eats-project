package org.example.promoserver.RestaurantStuff;

import org.example.promoserver.Models.Favourites;
import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavouritesRepository extends JpaRepository<Favourites, Integer> {

    List<Favourites> findByUsers(Users user);

    void deleteByUsersAndRestaurants(Users user, Restaurants restaurant);

}
