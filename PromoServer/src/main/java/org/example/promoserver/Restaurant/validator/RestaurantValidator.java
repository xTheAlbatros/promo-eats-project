package org.example.promoserver.Restaurant.validator;

import org.example.promoserver.Restaurant.dto.AddRestaurant;
import org.example.promoserver.Restaurant.exception.RestaurantBadRequestException;
import org.springframework.util.StringUtils;

import java.util.Map;

public class RestaurantValidator {

    public static void validateAddRestaurant(AddRestaurant addRestaurant) {
        if (!StringUtils.hasText(addRestaurant.getName())) {
            throw new RestaurantBadRequestException("Restaurant name cannot be empty");
        }

        if (!StringUtils.hasText(addRestaurant.getPhone())) {
            throw new RestaurantBadRequestException("Phone number cannot be empty");
        } else if (!isValidPhoneNumber(addRestaurant.getPhone())) {
            throw new RestaurantBadRequestException("Invalid phone number");
        }

        if (!StringUtils.hasText(addRestaurant.getEmail())) {
            throw new RestaurantBadRequestException("Email address cannot be empty");
        } else if (!isValidEmail(addRestaurant.getEmail())) {
            throw new RestaurantBadRequestException("Invalid email address");
        }

        if (addRestaurant.getLocation() == null) {
            throw new RestaurantBadRequestException("Restaurant location cannot be empty");
        }

        if (addRestaurant.getOpeningHours() == null || addRestaurant.getOpeningHours().isEmpty()) {
            throw new RestaurantBadRequestException("Opening hours cannot be empty");
        } else if (!isValidOpeningHours(addRestaurant.getOpeningHours())) {
            throw new RestaurantBadRequestException("Invalid opening hours format");
        }
    }

    private static boolean isValidPhoneNumber(String phone) {
        return phone.matches("\\+?[0-9]{7,15}");
    }

    private static boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");
    }

    private static boolean isValidOpeningHours(Map<String, String> openingHours) {
        for (Map.Entry<String, String> entry : openingHours.entrySet()) {
            if (!isValidDayOfWeek(entry.getKey()) || !isValidHours(entry.getValue())) {
                return false;
            }
        }
        return true;
    }

    private static boolean isValidDayOfWeek(String day) {
        return day.matches("(?i)(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Poniedziałek|Wtorek|Środa|Czwartek|Piątek|Sobota|Niedziela)");
    }

    private static boolean isValidHours(String hours) {
        return hours.matches("^([01]\\d|2[0-3]):([0-5]\\d)-([01]\\d|2[0-3]):([0-5]\\d)$");
    }
}
