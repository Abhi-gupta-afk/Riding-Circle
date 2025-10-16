package com.ridecircle.mapper;

import com.ridecircle.dto.response.RoleResponseDTO;
import com.ridecircle.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    
    public static RoleResponseDTO toRoleResponseDTO(Role role) {
        if (role == null) {
            return null;
        }
        
        RoleResponseDTO roleResponseDTO = new RoleResponseDTO();
        roleResponseDTO.setId(role.getId());
        roleResponseDTO.setName(role.getName().name());
        return roleResponseDTO;
    }
}