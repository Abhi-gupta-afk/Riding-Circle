package com.ridecircle.service;

import com.ridecircle.dto.response.FoodDTO;
import com.ridecircle.entity.Food;
import com.ridecircle.entity.User;
import com.ridecircle.repository.FoodRepository;
import com.ridecircle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class FoodService {
    
    @Autowired
    private FoodRepository foodRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get all active foods
     */
    public List<FoodDTO> getAllFoods() {
        return foodRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all foods with user's preferences marked
     */
    public List<FoodDTO> getAllFoodsForUser(Long userId) {
        List<Food> allFoods = foodRepository.findByIsActiveTrue();
        User user = userRepository.findById(userId).orElse(null);
        Set<Long> userFoodIds = user != null ? 
            user.getFoodPreferences().stream().map(Food::getId).collect(Collectors.toSet()) : 
            Set.of();
            
        return allFoods.stream()
                .map(food -> {
                    FoodDTO dto = convertToDTO(food);
                    dto.setIsSelected(userFoodIds.contains(food.getId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Get user's food preferences
     */
    public List<FoodDTO> getUserFoodPreferences(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return user.getFoodPreferences().stream()
                .filter(Food::getIsActive)
                .map(food -> {
                    FoodDTO dto = convertToDTO(food);
                    dto.setIsSelected(true);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Add food preference for user
     */
    public void addFoodPreference(Long userId, Long foodId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));
                
        if (!food.getIsActive()) {
            throw new RuntimeException("Food is not active");
        }
        
        user.getFoodPreferences().add(food);
        userRepository.save(user);
    }
    
    /**
     * Remove food preference for user
     */
    public void removeFoodPreference(Long userId, Long foodId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));
                
        user.getFoodPreferences().remove(food);
        userRepository.save(user);
    }
    
    /**
     * Get foods by category
     */
    public List<FoodDTO> getFoodsByCategory(String category) {
        return foodRepository.findByCategoryAndIsActiveTrue(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get foods by cuisine
     */
    public List<FoodDTO> getFoodsByCuisine(String cuisine) {
        return foodRepository.findByCuisineAndIsActiveTrue(cuisine).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Search foods by name
     */
    public List<FoodDTO> searchFoodsByName(String name) {
        return foodRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all food categories
     */
    public List<String> getFoodCategories() {
        return foodRepository.findDistinctCategories();
    }
    
    /**
     * Get all food cuisines
     */
    public List<String> getFoodCuisines() {
        return foodRepository.findDistinctCuisines();
    }
    
    /**
     * Get vegetarian foods
     */
    public List<FoodDTO> getVegetarianFoods() {
        return foodRepository.findByIsVegetarianTrueAndIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get vegan foods
     */
    public List<FoodDTO> getVeganFoods() {
        return foodRepository.findByIsVeganTrueAndIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get food by ID
     */
    public Optional<FoodDTO> getFoodById(Long id) {
        return foodRepository.findById(id)
                .filter(Food::getIsActive)
                .map(this::convertToDTO);
    }
    
    /**
     * Convert Food entity to DTO
     */
    private FoodDTO convertToDTO(Food food) {
        return new FoodDTO(
            food.getId(),
            food.getName(),
            food.getDescription(),
            food.getCategory(),
            food.getCuisine(),
            food.getImageUrl(),
            food.getIsVegetarian(),
            food.getIsVegan(),
            food.getIsSpicy()
        );
    }
    
    // Admin methods for CRUD operations
    
    /**
     * Get all foods for admin (including inactive)
     */
    public List<Food> getAllFoodsForAdmin() {
        return foodRepository.findAll();
    }
    
    /**
     * Get food entity by ID for admin
     */
    public Optional<Food> getFoodEntityById(Long id) {
        return foodRepository.findById(id);
    }
    
    /**
     * Save food entity (admin operation)
     */
    public Food saveFood(Food food) {
        return foodRepository.save(food);
    }
    
    /**
     * Delete food by ID (admin operation)
     */
    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}
