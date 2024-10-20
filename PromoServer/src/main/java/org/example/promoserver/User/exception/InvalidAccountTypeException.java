package org.example.promoserver.User.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class InvalidAccountTypeException extends CustomException {

    public InvalidAccountTypeException() {
        super("Invalid Account Type", HttpStatus.BAD_REQUEST);
    }

    public InvalidAccountTypeException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
