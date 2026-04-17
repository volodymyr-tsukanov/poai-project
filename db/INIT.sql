-- DATABASE config
ALTER DATABASE `prai_project`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;


-- TABLES
  -- DROP
DROP TABLE IF EXISTS `naughtyList`;
DROP TABLE IF EXISTS `letters`;
DROP TABLE IF EXISTS `users`;

  -- CREATE
CREATE TABLE `users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(24) NOT NULL,
    `email` VARCHAR(254) NOT NULL,                 -- Max email length per RFC 5321
    `pass` VARCHAR(254) NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `reputation` TINYINT UNSIGNED NOT NULL DEFAULT 37,
    `language` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_created` (`created`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `letters` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `subject` ENUM('project-VT','pear','telephone-book','sw-c','code-crypt','nspec') NOT NULL DEFAULT 'project-VT',
    `message` TEXT NOT NULL,                               -- Alt: MEDIUMTEXT for >16MB messages
    `status` ENUM('new','read','answered','important') NOT NULL DEFAULT 'new',
    `sender` VARCHAR(254) NOT NULL,
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `receiver_id` INT UNSIGNED NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_receiver_messages` (`receiver_id`, `created`),
    CONSTRAINT `fk_letter_user`
        FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `naughtyList` (
    `id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ip_start` BINARY(16) NOT NULL,
    `ip_end` BINARY(16) NOT NULL,                     -- to cover entire range using one entry
    `reason` TINYINT UNSIGNED NOT NULL,
    `abd` TEXT NOT NULL,                          -- additional browser data, type=JSON
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=Aria     -- faster reads, no CONSTRAINTs
  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
