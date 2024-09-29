package org.example.promoserver.RestaurantStuff.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class CategoryNotFoundException extends CustomException {

    public CategoryNotFoundException() {
        super("Category not found", HttpStatus.NOT_FOUND);
    }

    public CategoryNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
