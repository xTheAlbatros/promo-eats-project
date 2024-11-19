package org.example.promoserver.Promotions.exceptions;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class ImageNotFoundException extends CustomException{

    public ImageNotFoundException () {
            super("Image not found", HttpStatus.NOT_FOUND);
        }

}
