
package com.ridecircle.controller;
import org.springframework.security.access.prepost.PreAuthorize;


import com.ridecircle.dto.request.RoleRequestDTO;
import com.ridecircle.dto.response.RoleResponseDTO;
import com.ridecircle.servicelayer.service.RoleService;
import com.ridecircle.mapper.RoleMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RoleResponseDTO>> getAllRoles() {
        List<RoleResponseDTO> roles = roleService.getAllRoles().stream()
                .map(RoleMapper::toRoleResponseDTO)
                .toList();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleResponseDTO> getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id)
                .map(RoleMapper::toRoleResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleResponseDTO> createRole(@RequestBody RoleRequestDTO roleRequestDTO) {
        // MapStruct can map RoleEnum to String if configured, else do it manually
        com.ridecircle.entity.Role role = new com.ridecircle.entity.Role();
        role.setName(roleRequestDTO.getName());
        RoleResponseDTO createdRole = RoleMapper.toRoleResponseDTO(roleService.createRole(role));
        return ResponseEntity.ok(createdRole);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleResponseDTO> updateRole(@PathVariable Long id, @RequestBody RoleRequestDTO roleRequestDTO) {
        com.ridecircle.entity.Role role = new com.ridecircle.entity.Role();
        role.setName(roleRequestDTO.getName());
        RoleResponseDTO updatedRole = RoleMapper.toRoleResponseDTO(roleService.updateRole(id, role));
        return ResponseEntity.ok(updatedRole);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
