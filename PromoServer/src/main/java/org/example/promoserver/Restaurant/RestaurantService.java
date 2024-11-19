package org.example.promoserver.Restaurant;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Location;
import org.example.promoserver.Models.Restaurants;
import org.example.promoserver.Models.Users;
import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.dto.UpdateRestaurant;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.example.promoserver.Restaurant.exception.RestaurantNotFoundException;
import org.example.promoserver.Restaurant.validator.RestaurantValidator;
import org.example.promoserver.Shared.DistanceCalculator;
import org.example.promoserver.User.UserRepository;
import org.example.promoserver.User.exception.UserNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    private final RestaurantMapper restaurantMapper;

    private final UserRepository userRepository;


    @Transactional
    public List<ViewRestaurant> getAllRestaurant() {
        List<Restaurants> restaurants = restaurantRepository.findAll();
        return Optional.ofNullable(restaurants)
                .filter(list -> !list.isEmpty())
                .map(list -> list.stream()
                        .map(restaurantMapper::mapRestaurantsToView)
                        .collect(Collectors.toList()))
                .orElseThrow(RestaurantNotFoundException::new);
    }

    @Transactional
    public List<ViewRestaurant> getAllRestaurantForOwner(Principal connectedUser) {
        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        List<Restaurants> restaurants = restaurantRepository.findAllByUsers(user);

        return Optional.ofNullable(restaurants)
                .filter(list -> !list.isEmpty())
                .map(list -> list.stream()
                        .map(restaurantMapper::mapRestaurantsToView)
                        .collect(Collectors.toList()))
                .orElseThrow(RestaurantNotFoundException::new);
    }

    @Transactional
    public void saveRestaurant(AddRestaurant addRestaurant, Principal connectedUser){
        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        RestaurantValidator.validateAddRestaurant(addRestaurant);
        Restaurants restaurant = restaurantMapper.mapAddToRestaurants(addRestaurant);
        restaurant.setUsers(user);
        restaurantRepository.save(restaurant);
    }

    @Transactional
    public void updateRestaurant(UpdateRestaurant updateRestaurant){
        Restaurants existingRestaurant = restaurantRepository.findById(updateRestaurant.getId())
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found"));
        RestaurantValidator.validateUpdateRestaurant(updateRestaurant);

        if (updateRestaurant.getName() != null) {
            existingRestaurant.setName(updateRestaurant.getName());
        }
        if (updateRestaurant.getPhone() != null) {
            existingRestaurant.setPhone(updateRestaurant.getPhone());
        }
        if (updateRestaurant.getEmail() != null) {
            existingRestaurant.setEmail(updateRestaurant.getEmail());
        }
        if (updateRestaurant.getWebside() != null) {
            existingRestaurant.setWebside(updateRestaurant.getWebside());
        }
        if (updateRestaurant.getOpeningHours() != null) {
            existingRestaurant.setOpeningHours(updateRestaurant.getOpeningHours());
        }
        if (updateRestaurant.getLocation() != null) {
            existingRestaurant.setLocation(updateRestaurant.getLocation());
        }

        restaurantRepository.save(existingRestaurant);
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

    @Transactional
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

    @Transactional
    public List<ViewRestaurant> findRestaurantsByLocationAndRange(Location location, int range) {
        List<Restaurants> allRestaurants = restaurantRepository.findAll();

        Double rangeD = Double.valueOf(range);

        List<Restaurants> filteredRestaurants = allRestaurants.stream()
                .filter(restaurant -> {
                    double distance = DistanceCalculator.calculateDistance(location, restaurant.getLocation());
                    return distance <= rangeD;
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