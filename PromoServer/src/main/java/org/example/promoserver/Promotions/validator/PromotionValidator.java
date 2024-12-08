package org.example.promoserver.Promotions.validator;

import org.example.promoserver.Models.Promotions;
import org.example.promoserver.Promotions.exceptions.PromotionBadRequestException;
import org.example.promoserver.Restaurant.RestaurantRepository;
import org.example.promoserver.Restaurant.exception.RestaurantNotFoundException;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

public class PromotionValidator {

    public static void validatePromotion(Promotions promotions, RestaurantRepository restaurantRepository) {
        if (!StringUtils.hasText(promotions.getDescription())) {
            throw new PromotionBadRequestException("Promotion description cannot be empty");
        }

        if (promotions.getStartTime() == null) {
            throw new PromotionBadRequestException("Promotion start time cannot be null");
        }

        if (promotions.getEndTime() == null) {
            throw new PromotionBadRequestException("Promotion end time cannot be null");
        }

        if (promotions.getStartTime().isAfter(promotions.getEndTime())) {
            throw new PromotionBadRequestException("Promotion start time cannot be after end time");
        }

        if (promotions.getEndTime().isBefore(LocalDateTime.now())) {
            throw new PromotionBadRequestException("Promotion end time cannot be in the past");
        }

        if (promotions.getRestaurant() == null || promotions.getRestaurant().getId() == null) {
            throw new PromotionBadRequestException("Restaurant cannot be null");
        }

        boolean restaurantExists = restaurantRepository.existsById(promotions.getRestaurant().getId());
        if (!restaurantExists) {
            throw new RestaurantNotFoundException();
        }
    }

    public static void validateUpdatePromotion(Promotions promotions, RestaurantRepository restaurantRepository) {
        if (promotions.getId() == null) {
            throw new PromotionBadRequestException("Promotion ID cannot be empty");
        }

        if (promotions.getDescription() != null && !StringUtils.hasText(promotions.getDescription())) {
            throw new PromotionBadRequestException("Promotion description cannot be empty");
        }

        if (promotions.getStartTime() != null && promotions.getEndTime() != null) {
            if (promotions.getStartTime().isAfter(promotions.getEndTime())) {
                throw new PromotionBadRequestException("Promotion start time cannot be after end time");
            }
        }

        if (promotions.getEndTime() != null && promotions.getEndTime().isBefore(LocalDateTime.now())) {
            throw new PromotionBadRequestException("Promotion end time cannot be in the past");
        }

        if (promotions.getRestaurant() != null && promotions.getRestaurant().getId() != null) {
            boolean restaurantExists = restaurantRepository.existsById(promotions.getRestaurant().getId());
            if (!restaurantExists) {
                throw new RestaurantNotFoundException();
            }
        }
    }

}
