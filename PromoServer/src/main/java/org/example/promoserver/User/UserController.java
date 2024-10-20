package org.example.promoserver.User;

import lombok.RequiredArgsConstructor;
import org.example.promoserver.Models.Users;
import org.example.promoserver.User.dto.ViewUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    @GetMapping("/user/{id}")
    public ViewUser getUserById(@PathVariable Integer id){
        return userService.findUserById(id);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id){
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public List<ViewUser> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/user/token")
    public ViewUser getUserFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users userPrincipal = (Users) authentication.getPrincipal();
        Integer userId = userPrincipal.getId();

        return userService.findUserById(userId);
    }
}
