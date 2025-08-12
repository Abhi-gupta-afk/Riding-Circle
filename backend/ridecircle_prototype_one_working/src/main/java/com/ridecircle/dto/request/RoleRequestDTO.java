package com.ridecircle.dto.request;

import com.ridecircle.enums.RoleEnum;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequestDTO {
    @NotNull
    private RoleEnum name;
}