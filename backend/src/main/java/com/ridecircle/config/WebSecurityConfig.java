package com.ridecircle.config;

import com.ridecircle.security.jwt.AuthEntryPointJwt;
import com.ridecircle.security.jwt.AuthTokenFilter;
import com.ridecircle.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableMethodSecurity // Enables method-level security like @PreAuthorize
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * This bean defines the main security configuration for the application.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF as we are using JWT
            // Add the custom CorsFilter at the beginning of the filter chain
            .addFilter(corsFilter())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth ->
                auth.requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                    .requestMatchers("/api/subscriptions/plans/**").permitAll() // Allow public access to subscription plans
                    .requestMatchers("/api/trips/**", "/api/clubs/**", "/api/reviews/**").permitAll() // Allow public viewing
                    .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * This bean configures Cross-Origin Resource Sharing (CORS) to allow
     * requests from your frontend application.
     * Configured for frontend development on port 5173 or 5174.
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials for JWT tokens
        config.setAllowCredentials(true);
        
        // Allow frontend development server (5173 is default, 5174 if 5173 is busy)
        config.addAllowedOriginPattern("http://localhost:5173");
        config.addAllowedOriginPattern("http://localhost:5174");
        // Allow network access for mobile/remote testing
        config.addAllowedOriginPattern("http://192.168.1.*:5173");
        config.addAllowedOriginPattern("http://192.168.1.*:5174");
        config.addAllowedOriginPattern("http://192.168.*.*:5173");
        config.addAllowedOriginPattern("http://192.168.*.*:5174");
        
        // Specify allowed headers (cannot use * with allowCredentials=true)
        config.addAllowedHeader("Content-Type");
        config.addAllowedHeader("Authorization");
        config.addAllowedHeader("X-Requested-With");
        config.addAllowedHeader("Accept");
        config.addAllowedHeader("Origin");
        config.addAllowedHeader("Cache-Control");
        
        // Specify allowed methods (cannot use * with allowCredentials=true)
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");
        
        // Set max age for preflight requests
        config.setMaxAge(3600L);
        
        // Apply CORS configuration to all API endpoints
        source.registerCorsConfiguration("/api/**", config);
        
        return new CorsFilter(source);
    }
}