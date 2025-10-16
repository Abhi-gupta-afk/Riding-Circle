package com.ridecircle.config;

import com.ridecircle.entity.Role;
import com.ridecircle.entity.User;
import com.ridecircle.enums.RoleEnum;
import com.ridecircle.repository.RoleRepository;
import com.ridecircle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeDefaultUsers();
    }
    
    private void initializeRoles() {
        // Initialize roles if they don't exist
        if (roleRepository.findByName(RoleEnum.USER).isEmpty()) {
            Role userRole = new Role();
            userRole.setName(RoleEnum.USER);
            roleRepository.save(userRole);
            System.out.println("✅ USER role created");
        }
        
        if (roleRepository.findByName(RoleEnum.ADMIN).isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName(RoleEnum.ADMIN);
            roleRepository.save(adminRole);
            System.out.println("✅ ADMIN role created");
        }
    }
    
    private void initializeDefaultUsers() {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@ridecircle.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEnabled(true);
            
            Set<Role> adminRoles = new HashSet<>();
            roleRepository.findByName(RoleEnum.ADMIN).ifPresent(adminRoles::add);
            roleRepository.findByName(RoleEnum.USER).ifPresent(adminRoles::add);
            admin.setRoles(adminRoles);
            
            userRepository.save(admin);
            System.out.println("✅ Default admin user created (username: admin, password: admin123)");
        }
        
        // Create test user if it doesn't exist
        if (!userRepository.existsByUsername("testuser")) {
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setEmail("test@ridecircle.com");
            testUser.setPassword(passwordEncoder.encode("test123"));
            testUser.setEnabled(true);
            
            Set<Role> userRoles = new HashSet<>();
            roleRepository.findByName(RoleEnum.USER).ifPresent(userRoles::add);
            testUser.setRoles(userRoles);
            
            userRepository.save(testUser);
            System.out.println("✅ Default test user created (username: testuser, password: test123)");
        }
    }
}
