package com.resilia.ai.model.demo.services;

import com.resilia.ai.model.demo.entites.User;
import com.resilia.ai.model.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Service class for managing User-related business logic.
 *
 * While the Repository handles the raw database queries, this Service layer
 * adds necessary logic (like error handling) before passing data to the Controllers.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    /**
     * Constructor Injection.
     * Spring automatically provides the UserRepository here.
     */
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves a full User entity by their email address.
     *
     * This method acts as a wrapper around the repository. It automatically checks
     * if the user exists and throws a specific exception if they do not,
     * saving you from writing "if (user == null)" checks everywhere else.
     *
     * @param email The email to search for.
     * @return The User entity.
     * @throws UsernameNotFoundException if the email does not exist in the database.
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}