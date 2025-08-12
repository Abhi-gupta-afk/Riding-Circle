package com.ridecircle.repository;

import com.ridecircle.entity.Role;
import com.ridecircle.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    /**
     * Finds a Role entity by its RoleEnum name.
     * This is a crucial helper method for assigning a default role to a new user.
     *
     * @param name The RoleEnum constant (e.g., ROLE_USER or ROLE_ADMIN).
     * @return An Optional containing the Role if found, otherwise empty.
     */
    Optional<Role> findByName(RoleEnum name);

	Optional<Role> findById(Long id);

	void deleteById(Long id);

	
}