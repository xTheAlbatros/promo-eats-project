package org.example.promoserver.RestaurantStuff.validator;

import org.example.promoserver.Models.Categories;
import org.example.promoserver.Models.Reviews;
import org.example.promoserver.RestaurantStuff.exception.CategoryBadRequestException;
import org.example.promoserver.RestaurantStuff.exception.ReviewBadRequestException;

public class RestaurantStuffValidator {

    public static void checkCategory(Categories categories) {
        if(categories.getName() == null || categories.getName().isEmpty()){
            throw new CategoryBadRequestException("Name cannot be empty");
        }

        if(categories.getName().length() < 4){
            throw new CategoryBadRequestException("Name must be have at least 3 letters");
        }
    }

    public static void checkReview(Reviews review) {
        if (review.getRate() == null) {
            throw new ReviewBadRequestException("Rate cannot be null");
        }
        if (review.getRate() < 1 || review.getRate() > 5) {
            throw new ReviewBadRequestException("Rate must be between 1 and 5");
        }
        if (review.getComment() != null && review.getComment().length() > 500) {
            throw new ReviewBadRequestException("Comment cannot exceed 500 characters");
        }
    }
}
