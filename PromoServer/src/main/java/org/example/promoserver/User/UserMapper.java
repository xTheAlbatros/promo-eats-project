package org.example.promoserver.User;

import org.example.promoserver.Models.Users;
import org.example.promoserver.User.dto.RegisterUser;
import org.example.promoserver.User.dto.ViewUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS
)
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "accountType", ignore = true)
    @Mapping(target = "password", ignore = true)
    Users toUser(RegisterUser registerUser);

    ViewUser toView(Users users);

}
