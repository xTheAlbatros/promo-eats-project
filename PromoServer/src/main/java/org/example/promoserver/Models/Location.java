package org.example.promoserver.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double Longitude;

    private Double Latitude;

    @OneToOne(mappedBy = "location")
    private Restaurants restaurant;
}
