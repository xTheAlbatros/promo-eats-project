package org.example.promoserver.User.dto;

import lombok.Data;

@Data
public class RegisterUser {

    private String name;
    private String surname;
    private String email;
    private String username;
    private String password;
    private String accountType;
}
