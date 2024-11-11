package org.example.promoserver.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.AccountType;
import org.example.promoserver.Models.Users;
import org.example.promoserver.User.dto.ChangePasswordRequest;
import org.example.promoserver.User.dto.RegisterUser;
import org.example.promoserver.User.dto.ViewUser;
import org.example.promoserver.User.exception.UserBadRequestException;
import org.example.promoserver.User.exception.UserNotFoundException;
import org.example.promoserver.User.validator.UserValidator;
import org.example.promoserver.token.TokenRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.example.promoserver.User.exception.InvalidAccountTypeException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;


    @Transactional
    public Users registerUser(RegisterUser registerUser) {

        UserValidator.validateRegisterUser(registerUser, userRepository);

        Users user = userMapper.toUser(registerUser);

        String encodedPassword = passwordEncoder.encode(registerUser.getPassword());
        user.setPassword(encodedPassword);

        AccountType accountType = accountTypeRepository.findByName(registerUser.getAccountType())
                .orElseThrow(InvalidAccountTypeException::new);

        user.setAccountType(accountType);

        return userRepository.save(user);
    }

    public List<ViewUser> getAllUsers(){
        List<Users> users = userRepository.findAll();

        return Optional.ofNullable(users)
                .filter(list -> !list.isEmpty())
                .map(list -> list.stream()
                        .map(userMapper::toView)
                        .collect(Collectors.toList()))
                .orElseThrow(UserNotFoundException::new);
    }

    public ViewUser findUserById(Integer id) {
        Users user = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        return userMapper.toView(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        Optional<Users> foundUser = Optional.ofNullable(userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new));
        tokenRepository.deleteAllByUser(foundUser.get());
        foundUser.ifPresent(userRepository::delete);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, Principal connectedUser){
        Users user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UserBadRequestException("Wrong password");
        }
        if(!request.getNewPassword().equals(request.getConfirmationPassword())){
            throw new UserBadRequestException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}
