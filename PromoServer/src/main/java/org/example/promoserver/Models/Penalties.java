package org.example.promoserver.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Penalties {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDateTime startTme;

    private LocalDateTime endTime;

    @Column(nullable = false)
    private String reason;

    @ManyToOne
    @JoinColumn(name = "blocked_user_id", nullable = true)
    private Users blocked_user;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = true)
    private Users admin;

}
