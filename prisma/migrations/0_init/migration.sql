-- CreateTable
CREATE TABLE `company` (
    `company_cd` INTEGER NOT NULL AUTO_INCREMENT,
    `rr_cd` INTEGER NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `company_name_k` VARCHAR(255) NULL,
    `company_name_h` VARCHAR(255) NULL,
    `company_name_r` VARCHAR(255) NULL,
    `company_url` VARCHAR(255) NULL,
    `company_type` INTEGER NULL,
    `e_status` INTEGER NULL,
    `e_sort` INTEGER NULL,

    PRIMARY KEY (`company_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `line` (
    `line_cd` INTEGER NOT NULL AUTO_INCREMENT,
    `company_cd` INTEGER NOT NULL,
    `line_name` VARCHAR(255) NOT NULL,
    `line_name_k` VARCHAR(255) NULL,
    `line_name_h` VARCHAR(255) NULL,
    `line_color_c` VARCHAR(255) NULL,
    `line_color_t` VARCHAR(255) NULL,
    `line_type` INTEGER NULL,
    `lon` DOUBLE NULL,
    `lat` DOUBLE NULL,
    `zoom` INTEGER NULL,
    `e_status` INTEGER NULL,
    `e_sort` INTEGER NULL,

    UNIQUE INDEX `line_line_cd_key`(`line_cd`),
    PRIMARY KEY (`line_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `station` (
    `station_cd` INTEGER NOT NULL AUTO_INCREMENT,
    `station_g_cd` INTEGER NOT NULL,
    `station_name` VARCHAR(255) NOT NULL,
    `station_name_k` VARCHAR(255) NULL,
    `station_name_r` VARCHAR(255) NULL,
    `line_cd` INTEGER NOT NULL,
    `pref_cd` INTEGER NULL,
    `post` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `lon` DOUBLE NULL,
    `lat` DOUBLE NULL,
    `open_ymd` DATETIME(3) NULL,
    `close_ymd` DATETIME(3) NULL,
    `e_status` INTEGER NULL,
    `e_sort` INTEGER NULL,

    UNIQUE INDEX `station_station_cd_key`(`station_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `linedStation` (
    `line_cd` INTEGER NOT NULL,
    `station_cd1` INTEGER NOT NULL,
    `station_cd2` INTEGER NOT NULL,

    PRIMARY KEY (`line_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

