package org.example.promoserver.RestaurantStuff.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class CategoryBadRequestException extends CustomException {

    public CategoryBadRequestException() {
        super("Bad Request", HttpStatus.BAD_REQUEST);
    }

    public CategoryBadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
