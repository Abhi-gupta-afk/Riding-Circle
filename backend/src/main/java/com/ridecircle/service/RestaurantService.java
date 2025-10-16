package com.ridecircle.service;

import com.ridecircle.entity.Restaurant;
import com.ridecircle.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(Long id) {
        Optional<Restaurant> restaurant = restaurantRepository.findById(id);
        return restaurant.orElse(null);
    }

    public Optional<Restaurant> findById(Long id) {
        return restaurantRepository.findById(id);
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    public List<Restaurant> getRestaurantsByCity(String city) {
        return restaurantRepository.findByCityAndIsActiveTrue(city);
    }

    public List<Restaurant> getRestaurantsByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineAndIsActiveTrue(cuisine);
    }

    public List<Restaurant> getVegetarianRestaurants() {
        return restaurantRepository.findByIsVegetarianFriendlyTrueAndIsActiveTrue();
    }

    public List<Restaurant> getDeliveryRestaurants() {
        return restaurantRepository.findByAcceptsReservationsTrueAndIsActiveTrue();
    }

    public List<Restaurant> searchRestaurants(String query) {
        return restaurantRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query);
    }

    public List<Restaurant> getTopRatedRestaurants() {
        return restaurantRepository.findByRatingGreaterThanEqualAndIsActiveTrueOrderByRatingDesc(4.0);
    }
}
