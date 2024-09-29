package org.example.promoserver.Restaurant;

import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface RestaurantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "users", ignore = true)
    Restaurants mapAddToRestaurants(AddRestaurant addRestaurant);

    AddRestaurant mapRestaurantsToAdd(Restaurants restaurants);

    Restaurants mapViewToRestaurants(ViewRestaurant viewRestaurant);

    ViewRestaurant mapRestaurantsToView(Restaurants restaurants);
}