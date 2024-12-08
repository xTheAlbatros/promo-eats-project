package org.example.promoserver.Promotions.exceptions;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class PromotionBadRequestException extends CustomException {

    public PromotionBadRequestException() {
        super("Bad Request", HttpStatus.BAD_REQUEST);
    }

    public PromotionBadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
