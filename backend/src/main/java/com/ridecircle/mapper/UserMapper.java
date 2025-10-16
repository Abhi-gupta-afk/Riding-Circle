
package com.ridecircle.mapper;

import com.ridecircle.dto.request.UserRequestDTO;
import com.ridecircle.dto.response.UserResponseDTO;
import com.ridecircle.entity.User;
import org.springframework.stereotype.Component;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public static User toEntity(UserRequestDTO userRequestDTO) {
        if (userRequestDTO == null) {
            return null;
        }

        User user = new User();
        user.setUsername(userRequestDTO.getUsername());
        user.setEmail(userRequestDTO.getEmail());
        // Note: password and other fields are handled by the service layer
        return user;
    }

    public static UserResponseDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setId(user.getId());
        userResponseDTO.setUsername(user.getUsername());
        userResponseDTO.setEmail(user.getEmail());
        userResponseDTO.setEnabled(user.isEnabled());
        
        if (user.getRoles() != null) {
            Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
            userResponseDTO.setRoles(roleNames);
        }

        return userResponseDTO;
    }
}