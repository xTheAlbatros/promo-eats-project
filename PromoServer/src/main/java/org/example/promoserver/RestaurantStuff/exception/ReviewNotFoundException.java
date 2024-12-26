package org.example.promoserver.RestaurantStuff.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class ReviewNotFoundException extends CustomException {

    public ReviewNotFoundException () {
        super("Reviews Not Found", HttpStatus.NOT_FOUND);
    }
}
