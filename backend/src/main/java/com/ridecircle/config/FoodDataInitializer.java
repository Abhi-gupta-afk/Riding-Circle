package com.ridecircle.config;

import com.ridecircle.entity.Food;
import com.ridecircle.entity.Restaurant;
import com.ridecircle.repository.FoodRepository;
import com.ridecircle.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.List;

@Component
public class FoodDataInitializer implements CommandLineRunner {
    
    @Autowired
    private FoodRepository foodRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            // Initialize or update food data
            updateFoodImages();
            
            // Initialize restaurant data if empty
            if (restaurantRepository.count() == 0) {
                initializeRestaurantData();
            } else {
                updateRestaurantImages();
            }
        } catch (Exception e) {
            System.err.println("Error initializing food data: " + e.getMessage());
            // Don't fail startup if data initialization fails
        }
    }
    
    private void updateFoodImages() {
        try {
            // Update existing food items with new image URLs
            List<Food> foods = foodRepository.findAll();
            if (!foods.isEmpty()) {
                int index = 1;
                for (Food food : foods) {
                    food.setImageUrl("https://picsum.photos/300/200?random=" + index);
                    index++;
                }
                foodRepository.saveAll(foods);
                System.out.println("Updated " + foods.size() + " food items with new images");
            } else {
                initializeFoodData();
            }
        } catch (Exception e) {
            System.err.println("Error updating food images: " + e.getMessage());
            // Initialize new food data if update fails
            try {
                initializeFoodData();
            } catch (Exception e2) {
                System.err.println("Error initializing food data: " + e2.getMessage());
            }
        }
    }
    
    private void updateRestaurantImages() {
        // Update existing restaurant items with new image URLs  
        List<Restaurant> restaurants = restaurantRepository.findAll();
        if (!restaurants.isEmpty()) {
            int index = 20;
            for (Restaurant restaurant : restaurants) {
                restaurant.setImageUrl("https://picsum.photos/400/300?random=" + index);
                index++;
            }
            restaurantRepository.saveAll(restaurants);
            System.out.println("Updated " + restaurants.size() + " restaurants with new images");
        }
    }
    
    private void initializeFoodData() {
        List<Food> foods = new ArrayList<>();
        
        // Indian Vegetarian
        Food paneerButterMasala = new Food("Paneer Butter Masala", "Vegetarian", "Indian");
        paneerButterMasala.setDescription("Creamy tomato-based curry with cottage cheese");
        paneerButterMasala.setImageUrl("https://picsum.photos/300/200?random=1");
        paneerButterMasala.setIsVegetarian(true);
        paneerButterMasala.setIsVegan(false);
        paneerButterMasala.setIsSpicy(true);
        paneerButterMasala.setPrice(new BigDecimal("299.00"));
        foods.add(paneerButterMasala);
        
        Food dalTadka = new Food("Dal Tadka", "Vegetarian", "Indian");
        dalTadka.setDescription("Tempered yellow lentils with spices");
        dalTadka.setImageUrl("https://picsum.photos/300/200?random=2");
        dalTadka.setIsVegetarian(true);
        dalTadka.setIsVegan(true);
        dalTadka.setIsSpicy(false);
        dalTadka.setPrice(new BigDecimal("199.00"));
        foods.add(dalTadka);
        
        Food choleBhature = new Food("Chole Bhature", "Vegetarian", "Indian");
        choleBhature.setDescription("Spicy chickpea curry with fried bread");
        choleBhature.setImageUrl("https://picsum.photos/300/200?random=3");
        choleBhature.setIsVegetarian(true);
        choleBhature.setIsVegan(false);
        choleBhature.setIsSpicy(true);
        choleBhature.setPrice(new BigDecimal("249.00"));
        foods.add(choleBhature);
        
        // Indian Non-Vegetarian
        Food butterChicken = new Food("Butter Chicken", "Non-Vegetarian", "Indian");
        butterChicken.setDescription("Creamy tomato-based chicken curry");
        butterChicken.setImageUrl("https://picsum.photos/300/200?random=4");
        butterChicken.setIsVegetarian(false);
        butterChicken.setIsVegan(false);
        butterChicken.setIsSpicy(true);
        butterChicken.setPrice(new BigDecimal("399.00"));
        foods.add(butterChicken);
        
        Food biryani = new Food("Biryani", "Non-Vegetarian", "Indian");
        biryani.setDescription("Aromatic rice dish with meat and spices");
        biryani.setImageUrl("https://picsum.photos/300/200?random=5");
        biryani.setIsVegetarian(false);
        biryani.setIsVegan(false);
        biryani.setIsSpicy(true);
        biryani.setPrice(new BigDecimal("349.00"));
        foods.add(biryani);
        
        // Chinese
        Food vegFriedRice = new Food("Vegetable Fried Rice", "Vegetarian", "Chinese");
        vegFriedRice.setDescription("Stir-fried rice with mixed vegetables");
        vegFriedRice.setImageUrl("https://picsum.photos/300/200?random=6");
        vegFriedRice.setIsVegetarian(true);
        vegFriedRice.setIsVegan(true);
        vegFriedRice.setIsSpicy(false);
        vegFriedRice.setPrice(new BigDecimal("249.00"));
        foods.add(vegFriedRice);
        
        Food chickenManchurian = new Food("Chicken Manchurian", "Non-Vegetarian", "Chinese");
        chickenManchurian.setDescription("Spicy chicken balls in tangy sauce");
        chickenManchurian.setImageUrl("https://picsum.photos/300/200?random=7");
        chickenManchurian.setIsVegetarian(false);
        chickenManchurian.setIsVegan(false);
        chickenManchurian.setIsSpicy(true);
        chickenManchurian.setPrice(new BigDecimal("349.00"));
        foods.add(chickenManchurian);
        
        // Italian
        Food margheritaPizza = new Food("Margherita Pizza", "Vegetarian", "Italian");
        margheritaPizza.setDescription("Classic pizza with tomato, mozzarella, and basil");
        margheritaPizza.setImageUrl("https://picsum.photos/300/200?random=8");
        margheritaPizza.setIsVegetarian(true);
        margheritaPizza.setIsVegan(false);
        margheritaPizza.setIsSpicy(false);
        margheritaPizza.setPrice(new BigDecimal("399.00"));
        foods.add(margheritaPizza);
        
        Food pastaAlfredo = new Food("Pasta Alfredo", "Vegetarian", "Italian");
        pastaAlfredo.setDescription("Creamy white sauce pasta");
        pastaAlfredo.setImageUrl("https://picsum.photos/300/200?random=9");
        pastaAlfredo.setIsVegetarian(true);
        pastaAlfredo.setIsVegan(false);
        pastaAlfredo.setIsSpicy(false);
        pastaAlfredo.setPrice(new BigDecimal("349.00"));
        foods.add(pastaAlfredo);
        
        // Desserts
        Food gulabJamun = new Food("Gulab Jamun", "Dessert", "Indian");
        gulabJamun.setDescription("Sweet milk dumplings in sugar syrup");
        gulabJamun.setImageUrl("https://picsum.photos/300/200?random=10");
        gulabJamun.setIsVegetarian(true);
        gulabJamun.setIsVegan(false);
        gulabJamun.setIsSpicy(false);
        gulabJamun.setPrice(new BigDecimal("149.00"));
        foods.add(gulabJamun);
        
        Food iceCream = new Food("Ice Cream", "Dessert", "Continental");
        iceCream.setDescription("Cold frozen dessert in various flavors");
        iceCream.setImageUrl("https://picsum.photos/300/200?random=11");
        iceCream.setIsVegetarian(true);
        iceCream.setIsVegan(false);
        iceCream.setIsSpicy(false);
        iceCream.setPrice(new BigDecimal("199.00"));
        foods.add(iceCream);
        
        // Beverages
        Food masalaChai = new Food("Masala Chai", "Beverage", "Indian");
        masalaChai.setDescription("Spiced tea with milk and sugar");
        masalaChai.setImageUrl("https://picsum.photos/300/200?random=12");
        masalaChai.setIsVegetarian(true);
        masalaChai.setIsVegan(false);
        masalaChai.setIsSpicy(true);
        masalaChai.setPrice(new BigDecimal("79.00"));
        foods.add(masalaChai);
        
        Food limeSoda = new Food("Fresh Lime Soda", "Beverage", "Continental");
        limeSoda.setDescription("Refreshing lime juice with soda water");
        limeSoda.setImageUrl("https://picsum.photos/300/200?random=13");
        limeSoda.setIsVegetarian(true);
        limeSoda.setIsVegan(true);
        limeSoda.setIsSpicy(false);
        limeSoda.setPrice(new BigDecimal("99.00"));
        foods.add(limeSoda);
        
        foodRepository.saveAll(foods);
        System.out.println("Initialized " + foods.size() + " food items");
    }
    
    private void initializeRestaurantData() {
        List<Restaurant> restaurants = new ArrayList<>();
        
        Restaurant spiceGarden = new Restaurant("Spice Garden", "123 Main St, Mumbai", "Indian");
        spiceGarden.setDescription("Authentic Indian cuisine with traditional flavors");
        spiceGarden.setCity("Mumbai");
        spiceGarden.setState("Maharashtra");
        spiceGarden.setZipCode("400001");
        spiceGarden.setPhoneNumber("+91-9876543210");
        spiceGarden.setEmail("info@spicegarden.com");
        spiceGarden.setRating(4.5);
        spiceGarden.setReviewCount(150);
        spiceGarden.setImageUrl("https://picsum.photos/400/300?random=20");
        spiceGarden.setIsVegetarianFriendly(true);
        spiceGarden.setIsVeganFriendly(true);
        spiceGarden.setHasDelivery(true);
        spiceGarden.setHasTakeout(true);
        spiceGarden.setAcceptsReservations(true);
        restaurants.add(spiceGarden);
        
        Restaurant dragonPalace = new Restaurant("Dragon Palace", "456 Park Avenue, Delhi", "Chinese");
        dragonPalace.setDescription("Fine Chinese dining with modern ambiance");
        dragonPalace.setCity("Delhi");
        dragonPalace.setState("Delhi");
        dragonPalace.setZipCode("110001");
        dragonPalace.setPhoneNumber("+91-9876543211");
        dragonPalace.setEmail("contact@dragonpalace.com");
        dragonPalace.setRating(4.2);
        dragonPalace.setReviewCount(89);
        dragonPalace.setImageUrl("https://picsum.photos/400/300?random=21");
        dragonPalace.setIsVegetarianFriendly(true);
        dragonPalace.setIsVeganFriendly(false);
        dragonPalace.setHasDelivery(true);
        dragonPalace.setHasTakeout(true);
        dragonPalace.setAcceptsReservations(true);
        restaurants.add(dragonPalace);
        
        Restaurant bellaItalia = new Restaurant("Bella Italia", "789 Heritage Road, Bangalore", "Italian");
        bellaItalia.setDescription("Authentic Italian pizzas and pastas");
        bellaItalia.setCity("Bangalore");
        bellaItalia.setState("Karnataka");
        bellaItalia.setZipCode("560001");
        bellaItalia.setPhoneNumber("+91-9876543212");
        bellaItalia.setEmail("hello@bellaitalia.com");
        bellaItalia.setRating(4.7);
        bellaItalia.setReviewCount(203);
        bellaItalia.setImageUrl("https://picsum.photos/400/300?random=22");
        bellaItalia.setIsVegetarianFriendly(true);
        bellaItalia.setIsVeganFriendly(true);
        bellaItalia.setHasDelivery(true);
        bellaItalia.setHasTakeout(true);
        bellaItalia.setAcceptsReservations(true);
        restaurants.add(bellaItalia);
        
        Restaurant cafeDelight = new Restaurant("Café Delight", "321 Coffee Street, Pune", "Continental");
        cafeDelight.setDescription("Cozy café with great coffee and snacks");
        cafeDelight.setCity("Pune");
        cafeDelight.setState("Maharashtra");
        cafeDelight.setZipCode("411001");
        cafeDelight.setPhoneNumber("+91-9876543213");
        cafeDelight.setEmail("info@cafedelight.com");
        cafeDelight.setRating(4.0);
        cafeDelight.setReviewCount(67);
        cafeDelight.setImageUrl("https://picsum.photos/400/300?random=23");
        cafeDelight.setIsVegetarianFriendly(true);
        cafeDelight.setIsVeganFriendly(true);
        cafeDelight.setHasDelivery(false);
        cafeDelight.setHasTakeout(true);
        cafeDelight.setAcceptsReservations(false);
        restaurants.add(cafeDelight);
        
        Restaurant royalFeast = new Restaurant("Royal Feast", "555 Palace Road, Jaipur", "Multi-Cuisine");
        royalFeast.setDescription("Royal dining experience with multi-cuisine options");
        royalFeast.setCity("Jaipur");
        royalFeast.setState("Rajasthan");
        royalFeast.setZipCode("302001");
        royalFeast.setPhoneNumber("+91-9876543214");
        royalFeast.setEmail("reservations@royalfeast.com");
        royalFeast.setRating(4.8);
        royalFeast.setReviewCount(312);
        royalFeast.setImageUrl("https://picsum.photos/400/300?random=24");
        royalFeast.setIsVegetarianFriendly(true);
        royalFeast.setIsVeganFriendly(false);
        royalFeast.setHasDelivery(true);
        royalFeast.setHasTakeout(true);
        royalFeast.setAcceptsReservations(true);
        restaurants.add(royalFeast);
        
        restaurantRepository.saveAll(restaurants);
        System.out.println("Initialized " + restaurants.size() + " restaurants");
    }
}
