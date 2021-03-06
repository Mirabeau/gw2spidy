
# This is a fix for InnoDB in MySQL >= 4.1.x
# It "suspends judgement" for fkey relationships until are tables are set.
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- item_type
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `item_type`;

CREATE TABLE `item_type`
(
    `id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- item_sub_type
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `item_sub_type`;

CREATE TABLE `item_sub_type`
(
    `id` INTEGER NOT NULL,
    `main_type_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`,`main_type_id`),
    INDEX `item_sub_type_FI_1` (`main_type_id`),
    CONSTRAINT `item_sub_type_FK_1`
        FOREIGN KEY (`main_type_id`)
        REFERENCES `item_type` (`id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- item
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item`
(
    `data_id` INTEGER NOT NULL,
    `type_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gem_store_description` VARCHAR(255) NOT NULL,
    `gem_store_blurb` VARCHAR(255) NOT NULL,
    `restriction_level` VARCHAR(255) NOT NULL,
    `rarity` VARCHAR(255) NOT NULL,
    `vendor_sell_price` VARCHAR(255) NOT NULL,
    `img` VARCHAR(255) NOT NULL,
    `rarity_word` VARCHAR(255) NOT NULL,
    `item_type_id` INTEGER NOT NULL,
    `item_sub_type_id` INTEGER NOT NULL,
    `max_offer_unit_price` INTEGER NOT NULL,
    `min_sale_unit_price` INTEGER NOT NULL,
    PRIMARY KEY (`data_id`),
    INDEX `item_FI_1` (`item_type_id`),
    INDEX `item_FI_2` (`item_sub_type_id`),
    CONSTRAINT `item_FK_1`
        FOREIGN KEY (`item_type_id`)
        REFERENCES `item_type` (`id`),
    CONSTRAINT `item_FK_2`
        FOREIGN KEY (`item_sub_type_id`)
        REFERENCES `item_sub_type` (`id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- sell_listing
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `sell_listing`;

CREATE TABLE `sell_listing`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listing_date` DATE NOT NULL,
    `listing_time` TIME NOT NULL,
    `item_id` INTEGER NOT NULL,
    `listings` INTEGER NOT NULL,
    `unit_price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `retrieve_by_date_time` (`item_id`, `listing_date`, `listing_time`),
    CONSTRAINT `sell_listing_FK_1`
        FOREIGN KEY (`item_id`)
        REFERENCES `item` (`data_id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- buy_listing
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `buy_listing`;

CREATE TABLE `buy_listing`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listing_date` DATE NOT NULL,
    `listing_time` TIME NOT NULL,
    `item_id` INTEGER NOT NULL,
    `listings` INTEGER NOT NULL,
    `unit_price` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `retrieve_by_date_time` (`item_id`, `listing_date`, `listing_time`),
    CONSTRAINT `buy_listing_FK_1`
        FOREIGN KEY (`item_id`)
        REFERENCES `item` (`data_id`)
) ENGINE=MyISAM;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
