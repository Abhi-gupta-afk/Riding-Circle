package com.ridecircle.servicelayer.service;

import com.ridecircle.entity.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {
    List<Role> getAllRoles();
    Optional<Role> getRoleById(Long id);
    Role createRole(Role role);
    Role updateRole(Long id, Role roleDetails);
    void deleteRole(Long id);
}
