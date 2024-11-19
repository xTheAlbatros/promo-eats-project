package org.example.promoserver.Restaurant.dto;

import lombok.Data;
import org.example.promoserver.Models.Location;

import java.util.Map;

@Data
public class UpdateRestaurant {
    private Integer id;
    private String name;
    private String phone;
    private String email;
    private String webside;

    private Map<String, String> openingHours;

    private Location location;
}
