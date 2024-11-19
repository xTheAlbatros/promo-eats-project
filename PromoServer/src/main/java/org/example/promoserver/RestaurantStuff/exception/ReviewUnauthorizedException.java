package org.example.promoserver.RestaurantStuff.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class ReviewUnauthorizedException extends CustomException {
    public ReviewUnauthorizedException () { super("You are not authorized to update this review", HttpStatus.UNAUTHORIZED);}
}
