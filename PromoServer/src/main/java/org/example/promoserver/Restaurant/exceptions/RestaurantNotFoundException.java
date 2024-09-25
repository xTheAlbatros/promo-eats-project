package org.example.promoserver.Restaurant.exceptions;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class RestaurantNotFoundException extends CustomException {

    public RestaurantNotFoundException() {
        super("Restaurant not found", HttpStatus.NOT_FOUND);
    }

    public RestaurantNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
