package org.example.promoserver.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer rate;

    private String comment;

    @CreationTimestamp
    private LocalDateTime createdTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private Users users;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurants restaurants;
}
