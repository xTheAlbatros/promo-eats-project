package org.example.promoserver.Restaurant.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AddRestaurant {
    private String name;
    private String address;
    private String phone;
    private String email;
    private String webside;
}
