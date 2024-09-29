package org.example.promoserver.User;

import org.example.promoserver.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Integer> {
}
