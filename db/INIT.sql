-- DATABASE config
ALTER DATABASE `prai_project`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;


-- TABLES
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(24) NOT NULL,
    `email` VARCHAR(254) NOT NULL,                 -- Max email length per RFC 5321
    `pass` CHAR(60) NOT NULL,                      -- For BCrypt, Alt: CHAR(64) for SHA-256
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_login` (`login`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_created` (`created`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
    `id` BINARY(16) NOT NULL,
    `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expires` TIMESTAMP NOT NULL,                        -- Alt: DATETIME for timezone independence
    `last_activity` TIMESTAMP NULL DEFAULT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_user_sessions` (`user_id`, `created`),   -- !USE ON LOOKUP
    CONSTRAINT `fk_session_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE RESTRICT                                 -- delete user only when no sessions left
) ENGINE=MEMORY
  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `subject` ENUM('*','other') NOT NULL DEFAULT 'other',
    `message` TEXT NOT NULL,                               -- Alt: MEDIUMTEXT for >16MB messages
    `status` ENUM('new','read','answered','important') NOT NULL DEFAULT 'new',
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `user_id` INT UNSIGNED NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_user_messages` (`user_id`, `created`),
    CONSTRAINT `fk_contact_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
