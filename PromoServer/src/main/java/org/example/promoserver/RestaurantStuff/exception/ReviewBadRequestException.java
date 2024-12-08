package org.example.promoserver.RestaurantStuff.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class ReviewBadRequestException extends CustomException {

    public ReviewBadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
