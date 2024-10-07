package org.example.promoserver.User;

import org.example.promoserver.Models.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountTypeRepository extends JpaRepository<AccountType, Integer> {

    Optional<AccountType> findByName(String name);
}
