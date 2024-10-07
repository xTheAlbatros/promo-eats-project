package org.example.promoserver.User;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.AccountType;
import org.example.promoserver.Models.Users;
import org.example.promoserver.User.dto.RegisterUser;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    public Users registerUser(RegisterUser registerUser) {

        Users user = userMapper.toUser(registerUser);

        String encodedPassword = passwordEncoder.encode(registerUser.getPassword());
        user.setPassword(encodedPassword);

        AccountType accountType = accountTypeRepository.findByName(registerUser.getAccountType())
                .orElseThrow(() -> new IllegalArgumentException("Invalid account type: " + registerUser.getAccountType()));


        user.setAccountType(accountType);


        return userRepository.save(user);
    }
}
