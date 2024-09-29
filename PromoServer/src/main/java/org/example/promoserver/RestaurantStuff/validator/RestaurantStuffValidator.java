package org.example.promoserver.RestaurantStuff.validator;

import org.example.promoserver.Models.Categories;
import org.example.promoserver.RestaurantStuff.exception.CategoryBadRequestException;

public class RestaurantStuffValidator {

    public static void checkCategory(Categories categories) {
        if(categories.getName() == null || categories.getName().isEmpty()){
            throw new CategoryBadRequestException("Name cannot be empty");
        }

        if(categories.getName().length() < 4){
            throw new CategoryBadRequestException("Name must be have at least 3 letters");
        }
    }
}
