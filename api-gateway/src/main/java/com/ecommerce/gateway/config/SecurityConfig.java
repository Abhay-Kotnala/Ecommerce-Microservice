package com.ecommerce.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

        @Bean
        public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
                http
                                .authorizeExchange(exchanges -> exchanges
                                                .pathMatchers("/eureka/**").permitAll() // Allow Eureka
                                                                                        // dashboard/registration
                                                .pathMatchers("/actuator/**").permitAll() // Allow Actuator endpoints
                                                .pathMatchers(HttpMethod.GET, "/api/inventory/**").permitAll() // Allow
                                                                                                               // viewing
                                                                                                               // products
                                                .anyExchange().authenticated())
                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(org.springframework.security.config.Customizer.withDefaults()))
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable()); // Disable CSRF for API

                return http.build();
        }

        @Bean
        public org.springframework.web.cors.reactive.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                configuration.setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:3000",
                                "http://localhost:3001"));
                configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(java.util.List.of("*"));
                configuration.setAllowCredentials(true);

                org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
