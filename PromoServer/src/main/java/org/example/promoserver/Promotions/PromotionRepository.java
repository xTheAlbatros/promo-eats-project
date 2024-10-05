package org.example.promoserver.Promotions;

import org.example.promoserver.Models.Promotions;
import org.example.promoserver.Models.Restaurants;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotions, Integer> {

    List<Promotions> findByRestaurant(Restaurants restaurant);

}
