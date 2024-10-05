package org.example.promoserver.Promotions.exceptions;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class PromotionNotFoundException extends CustomException {

    public PromotionNotFoundException() {
        super("Promotion not found", HttpStatus.NOT_FOUND);
    }

    public PromotionNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
