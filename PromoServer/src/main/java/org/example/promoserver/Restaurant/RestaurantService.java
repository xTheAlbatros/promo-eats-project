package org.example.promoserver.Restaurant;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Location;
import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.example.promoserver.Restaurant.exceptions.RestaurantNotFoundException;
import org.example.promoserver.Restaurant.validator.RestaurantValidator;
import org.example.promoserver.Shared.DistanceCalculator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    private final RestaurantMapper restaurantMapper;


    public List<ViewRestaurant> getAllRestaurant() {
        List<Restaurants> restaurants = restaurantRepository.findAll();

        return Optional.ofNullable(restaurants)
                .filter(list -> !list.isEmpty())
                .map(list -> list.stream()
                        .map(restaurantMapper::mapRestaurantsToView)
                        .collect(Collectors.toList()))
                .orElseThrow(RestaurantNotFoundException::new);
    }


    public void saveRestaurant(AddRestaurant addRestaurant){
        RestaurantValidator.validateAddRestaurant(addRestaurant);
        Restaurants restaurant = restaurantMapper.mapAddToRestaurants(addRestaurant);
        restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Integer id){
        Optional<Restaurants> foundRestaurant = restaurantRepository.findById(id);
        if(foundRestaurant.isPresent()){
            restaurantRepository.deleteById(id);
        }
        else{
            throw new RestaurantNotFoundException();
        }
    }

    public ViewRestaurant findRestaurantById(Integer id){
        Optional<Restaurants> foundRestaurant = restaurantRepository.findById(id);
        if(foundRestaurant.isPresent()){
            ViewRestaurant viewRestaurant = restaurantMapper.mapRestaurantsToView(foundRestaurant.get());
            return viewRestaurant;
        }
        else{
            throw new RestaurantNotFoundException();
        }
    }

    public List<ViewRestaurant> findRestaurantsByLocationAndRange(Location location, Double range) {
        List<Restaurants> allRestaurants = restaurantRepository.findAll();

        List<Restaurants> filteredRestaurants = allRestaurants.stream()
                .filter(restaurant -> {
                    double distance = DistanceCalculator.calculateDistance(location, restaurant.getLocation());
                    return distance <= range;
                })
                .collect(Collectors.toList());

        return Optional.ofNullable(filteredRestaurants)
                .filter(list -> !list.isEmpty())
                .map(list -> list.stream()
                        .map(restaurantMapper::mapRestaurantsToView)
                        .collect(Collectors.toList()))
                .orElseThrow(RestaurantNotFoundException::new);
    }



}