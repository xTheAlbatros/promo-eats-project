package org.example.promoserver.User.dto;

import lombok.Data;
import org.example.promoserver.Models.AccountType;

@Data
public class ViewUser {
    private Integer id;
    private String name;
    private String surname;
    private String email;
    private String username;
    private AccountType accountType;
}
