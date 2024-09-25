package org.example.promoserver.Restaurant.exceptions;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class RestaurantBadRequestException extends CustomException {

    public RestaurantBadRequestException() {
        super("Bad Request", HttpStatus.BAD_REQUEST);
    }

    public RestaurantBadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
