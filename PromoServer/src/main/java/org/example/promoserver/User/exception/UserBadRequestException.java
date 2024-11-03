package org.example.promoserver.User.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class UserBadRequestException extends CustomException {
    public UserBadRequestException() {
        super("Bad Request", HttpStatus.BAD_REQUEST);
    }

    public UserBadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
