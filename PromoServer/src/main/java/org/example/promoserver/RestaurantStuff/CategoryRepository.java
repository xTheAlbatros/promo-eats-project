package org.example.promoserver.RestaurantStuff;

import org.example.promoserver.Models.Categories;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryRepository extends JpaRepository<Categories, Integer> {
}
