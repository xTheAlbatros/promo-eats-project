package org.example.promoserver.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class RestaurantsCategories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurants restaurants;

    @ManyToOne
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categories categories;
}
