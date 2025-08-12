package com.ridecircle.config;

import com.ridecircle.entity.Club;
import com.ridecircle.entity.Food;
import com.ridecircle.entity.Role;
import com.ridecircle.entity.Trip;
import com.ridecircle.entity.User;
import com.ridecircle.enums.RoleEnum;
import com.ridecircle.enums.TripType;
import com.ridecircle.repository.ClubRepository;
import com.ridecircle.repository.FoodRepository;
import com.ridecircle.repository.RoleRepository;
import com.ridecircle.repository.TripRepository;
import com.ridecircle.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {
    
    @Bean("rolesInitializer")
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            System.out.println("Initializing roles...");
            try {
                // Check and create ADMIN role
                Role adminRole = roleRepository.findByName(RoleEnum.ADMIN).orElse(null);
                if (adminRole == null) {
                    adminRole = new Role(RoleEnum.ADMIN);
                    roleRepository.save(adminRole);
                    System.out.println("Created role: ADMIN");
                } else {
                    System.out.println("Admin role already exists");
                }

                // Check and create USER role
                Role userRole = roleRepository.findByName(RoleEnum.USER).orElse(null);
                if (userRole == null) {
                    userRole = new Role(RoleEnum.USER);
                    roleRepository.save(userRole);
                    System.out.println("Created role: USER");
                } else {
                    System.out.println("User role already exists");
                }

                // Force roles to be persisted
                roleRepository.flush();
                
                // Verify roles were created
                if (roleRepository.findByName(RoleEnum.ADMIN).isEmpty()) {
                    throw new RuntimeException("Failed to create ADMIN role");
                }
                if (roleRepository.findByName(RoleEnum.USER).isEmpty()) {
                    throw new RuntimeException("Failed to create USER role");
                }
                
                System.out.println("Roles initialization completed successfully.");
            } catch (Exception e) {
                System.err.println("Error initializing roles: " + e.getMessage());
                throw e;
            }
        };
    }
    
    @Bean("userInitializer")
    public CommandLineRunner initAdminUser(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, CommandLineRunner rolesInitializer) {
        return args -> {
            // First run the roles initializer
            rolesInitializer.run(args);
            
            System.out.println("Initializing users...");
            // Check if admin user already exists
            if (!userRepository.existsByUsername("admin")) {
                // Create admin user
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@ridecircle.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setEnabled(true);
                
                // Assign ADMIN role
                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName(RoleEnum.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
                roles.add(adminRole);
                adminUser.setRoles(roles);
                
                userRepository.save(adminUser);
                System.out.println("=== ADMIN USER CREATED ===");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
                System.out.println("Email: admin@ridecircle.com");
                System.out.println("==========================");
            }
            
            // Create a regular test user if it doesn't exist
            if (!userRepository.existsByUsername("testuser")) {
                User testUser = new User();
                testUser.setUsername("testuser");
                testUser.setEmail("testuser@ridecircle.com");
                testUser.setPassword(passwordEncoder.encode("test123"));
                testUser.setEnabled(true);
                
                // Assign USER role
                Set<Role> roles = new HashSet<>();
                Role userRole = roleRepository.findByName(RoleEnum.USER)
                    .orElseThrow(() -> new RuntimeException("User role not found"));
                roles.add(userRole);
                testUser.setRoles(roles);
                
                userRepository.save(testUser);
                System.out.println("=== TEST USER CREATED ===");
                System.out.println("Username: testuser");
                System.out.println("Password: test123");
                System.out.println("Email: testuser@ridecircle.com");
                System.out.println("========================");
            }
        };
    }
    
    @Bean
    public CommandLineRunner initSampleData(ClubRepository clubRepository, TripRepository tripRepository, UserRepository userRepository) {
        return args -> {
            // Only create sample data if no clubs exist
            if (clubRepository.count() == 0) {
                // Get admin user for association
                User adminUser = userRepository.findByUsername("admin").orElse(null);
                
                // Create sample clubs
                Club club1 = new Club();
                club1.setName("Highway Riders Club");
                club1.setBrand("Harley-Davidson");
                club1.setDescription("A community of Harley enthusiasts who love long highway rides and brotherhood.");
                club1.setCity("New York");
                club1.setOwner(adminUser);
                clubRepository.save(club1);
                
                Club club2 = new Club();
                club2.setName("Speed Demons MC");
                club2.setBrand("Yamaha");
                club2.setDescription("For riders who crave speed and adrenaline on sport bikes.");
                club2.setCity("Los Angeles");
                club2.setOwner(adminUser);
                clubRepository.save(club2);
                
                Club club3 = new Club();
                club3.setName("Adventure Seekers");
                club3.setBrand("BMW");
                club3.setDescription("Exploring off-road trails and adventure touring on dual-sport bikes.");
                club3.setCity("Denver");
                club3.setOwner(adminUser);
                clubRepository.save(club3);
                
                // Create sample trips
                Trip trip1 = new Trip();
                trip1.setTitle("Blue Ridge Parkway Adventure");
                trip1.setDescription("A scenic ride through the beautiful Blue Ridge Mountains with stunning fall foliage.");
                trip1.setStartLocation("Asheville, NC");
                trip1.setEndLocation("Skyline Drive, VA");
                trip1.setStartTime(LocalDateTime.now().plusDays(14));
                trip1.setTripType(TripType.WEEKEND_GETAWAY);
                trip1.setOrganizingClub(club1);
                tripRepository.save(trip1);
                
                Trip trip2 = new Trip();
                trip2.setTitle("Pacific Coast Highway Cruise");
                trip2.setDescription("Epic coastal ride from San Francisco to Los Angeles along Highway 1.");
                trip2.setStartLocation("San Francisco, CA");
                trip2.setEndLocation("Los Angeles, CA");
                trip2.setStartTime(LocalDateTime.now().plusDays(21));
                trip2.setTripType(TripType.MULTI_DAY_TOUR);
                trip2.setOrganizingClub(club2);
                tripRepository.save(trip2);
                
                Trip trip3 = new Trip();
                trip3.setTitle("Rocky Mountain Trail Ride");
                trip3.setDescription("Off-road adventure through Colorado's backcountry trails.");
                trip3.setStartLocation("Colorado Springs, CO");
                trip3.setEndLocation("Vail, CO");
                trip3.setStartTime(LocalDateTime.now().plusDays(7));
                trip3.setTripType(TripType.ONE_DAY_RIDE);
                trip3.setOrganizingClub(club3);
                tripRepository.save(trip3);
                
                System.out.println("=== SAMPLE DATA CREATED ===");
                System.out.println("Created 3 clubs and 3 trips");
                System.out.println("===========================");
            }
        };
    }
    
    @Bean
    public CommandLineRunner initSampleFoods(FoodRepository foodRepository) {
        return args -> {
            // Only create sample food data if no foods exist
            if (foodRepository.count() == 0) {
                // Create sample food items
                Food food1 = new Food();
                food1.setName("Butter Chicken");
                food1.setDescription("Creamy tomato-based curry with tender chicken pieces");
                food1.setCuisine("Indian");
                food1.setPrice(BigDecimal.valueOf(399.00));
                food1.setCategory("Main Course");
                food1.setImageUrl("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400");
                food1.setAvailable(true);
                foodRepository.save(food1);
                
                Food food2 = new Food();
                food2.setName("Margherita Pizza");
                food2.setDescription("Classic pizza with fresh mozzarella, tomatoes, and basil");
                food2.setCuisine("Italian");
                food2.setPrice(BigDecimal.valueOf(299.00));
                food2.setCategory("Main Course");
                food2.setImageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400");
                food2.setAvailable(true);
                foodRepository.save(food2);
                
                Food food3 = new Food();
                food3.setName("Caesar Salad");
                food3.setDescription("Crisp romaine lettuce with parmesan, croutons and caesar dressing");
                food3.setCuisine("Continental");
                food3.setPrice(BigDecimal.valueOf(199.00));
                food3.setCategory("Appetizer");
                food3.setImageUrl("https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400");
                food3.setAvailable(true);
                foodRepository.save(food3);
                
                Food food4 = new Food();
                food4.setName("Chocolate Brownie");
                food4.setDescription("Rich chocolate brownie with vanilla ice cream");
                food4.setCuisine("Continental");
                food4.setPrice(BigDecimal.valueOf(149.00));
                food4.setCategory("Dessert");
                food4.setImageUrl("https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400");
                food4.setAvailable(true);
                foodRepository.save(food4);
                
                Food food5 = new Food();
                food5.setName("Mango Lassi");
                food5.setDescription("Traditional Indian yogurt-based drink with fresh mango");
                food5.setCuisine("Indian");
                food5.setPrice(BigDecimal.valueOf(79.00));
                food5.setCategory("Beverage");
                food5.setImageUrl("https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400");
                food5.setAvailable(true);
                foodRepository.save(food5);
                
                Food food6 = new Food();
                food6.setName("Chicken Biryani");
                food6.setDescription("Aromatic basmati rice with spiced chicken and saffron");
                food6.setCuisine("Indian");
                food6.setPrice(BigDecimal.valueOf(349.00));
                food6.setCategory("Main Course");
                food6.setImageUrl("https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400");
                food6.setAvailable(false);
                foodRepository.save(food6);
                
                System.out.println("=== SAMPLE FOOD DATA CREATED ===");
                System.out.println("Created 6 sample food items");
                System.out.println("================================");
            }
        };
    }
}
