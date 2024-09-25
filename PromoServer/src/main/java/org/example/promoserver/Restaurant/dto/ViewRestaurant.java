package org.example.promoserver.Restaurant.dto;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ViewRestaurant {
    private String name;
    private String address;
    private String phone;
    private String email;
    private String webside;

}
