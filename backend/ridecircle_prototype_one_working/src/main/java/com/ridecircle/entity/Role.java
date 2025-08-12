package com.ridecircle.entity;

import com.ridecircle.enums.RoleEnum;
import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, unique = true, nullable = false)
    private RoleEnum name;

    // Constructors
    public Role() {}
    public Role(RoleEnum name) {
        this.name = name;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public RoleEnum getName() { return name; }
    public void setName(RoleEnum name) { this.name = name; }
}