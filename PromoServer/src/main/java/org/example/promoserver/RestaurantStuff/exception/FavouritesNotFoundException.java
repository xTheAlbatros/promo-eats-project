package org.example.promoserver.RestaurantStuff.exception;

import org.example.promoserver.Shared.exceptionhandle.CustomException;
import org.springframework.http.HttpStatus;

public class FavouritesNotFoundException extends CustomException {

    public FavouritesNotFoundException () {
        super("Favourites Restaurants Not Found", HttpStatus.NOT_FOUND);
    }
}
