package org.example.promoserver.RestaurantStuff;

import jakarta.transaction.Transactional;
import org.example.promoserver.Models.*;
import org.example.promoserver.Restaurant.RestaurantMapper;
import org.example.promoserver.Restaurant.dto.ViewRestaurant;
import org.example.promoserver.Restaurant.exception.RestaurantNotFoundException;
import org.example.promoserver.RestaurantStuff.exception.FavouritesNotFoundException;
import org.example.promoserver.RestaurantStuff.exception.ReviewNotFoundException;
import org.example.promoserver.RestaurantStuff.exception.ReviewUnauthorizedException;
import org.example.promoserver.RestaurantStuff.validator.RestaurantStuffValidator;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Restaurant.RestaurantRepository;
import org.example.promoserver.RestaurantStuff.exception.CategoryNotFoundException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RestaurantStuffService {

    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantsCategoriesRepository restaurantsCategoriesRepository;
    private final FavouritesRepository favouritesRepository;
    private final RestaurantMapper restaurantMapper;
    private final ReviewsRepository reviewsRepository;

    public void addCategory(Categories category) {
        RestaurantStuffValidator.checkCategory(category);
        categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Integer id) {
        Categories category = categoryRepository.findById(id)
                .orElseThrow(CategoryNotFoundException::new);
        categoryRepository.delete(category);
    }

    @Transactional
    public void deleteConnectionCategoryToRestaurant(Integer restaurant_id, Integer category_id) {
        Restaurants restaurant = restaurantRepository.findById(restaurant_id)
                .orElseThrow(RestaurantNotFoundException::new);

        Categories category = categoryRepository.findById(category_id)
                .orElseThrow(CategoryNotFoundException::new);

        restaurantsCategoriesRepository.deleteByRestaurantsAndCategories(restaurant, category);
    }

    public List<Categories> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Categories> getAllCategoriesForRestaurant(Integer restaurantId) {
        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);
        List<RestaurantsCategories> restaurantCategories = restaurantsCategoriesRepository.findAllByRestaurants(restaurant);

        return restaurantCategories.stream()
                .map(RestaurantsCategories::getCategories)
                .collect(Collectors.toList());
    }

    public void addCategoryToRestaurant(Integer restaurantId, Integer categoryId) {
        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);
        Categories category = categoryRepository.findById(categoryId)
                .orElseThrow(CategoryNotFoundException::new);

        RestaurantsCategories restaurantsCategories = new RestaurantsCategories();
        restaurantsCategories.setRestaurants(restaurant);
        restaurantsCategories.setCategories(category);

        restaurantsCategoriesRepository.save(restaurantsCategories);
    }

    public void addFavouriteRestaurantForUser(Principal connectedUser, Integer restaurantId) {
        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);

        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        favouritesRepository.save(
                Favourites.builder()
                .users(user)
                .restaurants(restaurant)
                .build());
    }

    @Transactional
    public List<ViewRestaurant> getAllFavouritesRestaurantsForUser(Principal connectedUser) {
        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        List<Favourites> favourites = favouritesRepository.findByUsers(user);

        return Optional.ofNullable(favourites)
                .filter(list -> !list.isEmpty())
                .map(list -> list.stream()
                        .map(fav -> restaurantMapper.mapRestaurantsToView(fav.getRestaurants()))
                        .collect(Collectors.toList()))
                .orElseThrow(FavouritesNotFoundException::new);
    }

    @Transactional
    public void deleteFavouriteRestaurantForUser(Principal connectedUser, Integer restaurantId) {
        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Restaurants restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);

        favouritesRepository.deleteByUsersAndRestaurants(user, restaurant);
    }

    @Transactional
    public void addReviewToRestaurant(Principal connectedUser, Reviews reviews) {
        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        RestaurantStuffValidator.checkReview(reviews);

        reviews.setUsers(user);
        reviewsRepository.save(reviews);
    }

    @Transactional
    public List<Reviews> getAllReviewsForRestaurant(Integer restaurantId) {
        List<Reviews> foundReviews = reviewsRepository.findAll();

        Restaurants foundRestaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(RestaurantNotFoundException::new);

        return Optional.ofNullable(foundReviews)
                .map(reviews -> reviews.stream()
                        .filter(review -> review.getRestaurants().equals(foundRestaurant))
                        .collect(Collectors.toList()))
                        .orElseThrow(ReviewNotFoundException::new);

    }

    public void deleteReviewFromRestaurant(Integer reviewId) {
        Optional<Reviews> review = reviewsRepository.findById(reviewId);
        if (review.isPresent()) {
            reviewsRepository.delete(review.get());
        }
        else{
            throw new ReviewNotFoundException();
        }
    }

    @Transactional
    public void updateReview(Principal connectedUser, Reviews reviews){
        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        Reviews existingReview = reviewsRepository.findById(reviews.getId())
                .orElseThrow(ReviewNotFoundException::new);

        if (!existingReview.getUsers().getId().equals(user.getId())) {
            throw new ReviewUnauthorizedException();
        }

        RestaurantStuffValidator.checkReview(reviews);
        
        if (reviews.getRate() != null) {
            existingReview.setRate(reviews.getRate());
        }
        if (reviews.getComment() != null) {
            existingReview.setComment(reviews.getComment());
        }

        reviewsRepository.save(existingReview);

    }

}

