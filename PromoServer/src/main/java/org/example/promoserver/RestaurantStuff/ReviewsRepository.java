package org.example.promoserver.RestaurantStuff;

import org.example.promoserver.Models.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewsRepository extends JpaRepository<Reviews, Integer> {
}
