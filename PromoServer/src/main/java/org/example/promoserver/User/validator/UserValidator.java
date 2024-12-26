package org.example.promoserver.User.validator;

import org.example.promoserver.User.dto.RegisterUser;
import org.example.promoserver.User.exception.UserBadRequestException;
import org.example.promoserver.User.UserRepository;
import org.springframework.util.StringUtils;

public class UserValidator {

    public static void validateRegisterUser(RegisterUser registerUser, UserRepository userRepository) {
        if (!StringUtils.hasText(registerUser.getName())) {
            throw new UserBadRequestException("Name cannot be empty");
        }

        if (!StringUtils.hasText(registerUser.getSurname())) {
            throw new UserBadRequestException("Surname cannot be empty");
        }

        if (!StringUtils.hasText(registerUser.getEmail())) {
            throw new UserBadRequestException("Email cannot be empty");
        } else if (!isValidEmail(registerUser.getEmail())) {
            throw new UserBadRequestException("Invalid email address");
        } else if (userRepository.existsByEmail(registerUser.getEmail())) {
            throw new UserBadRequestException("Email already exists");
        }

        if (!StringUtils.hasText(registerUser.getPassword())) {
            throw new UserBadRequestException("Password cannot be empty");
        } else if (!isValidPassword(registerUser.getPassword())) {
            throw new UserBadRequestException("Password must be at least 5 characters long and contain at least one digit");
        }
    }

    private static boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");
    }

    private static boolean isValidPassword(String password) {
        return password.length() >= 5 && password.matches(".*\\d.*");
    }
}
