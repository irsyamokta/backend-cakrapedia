-- AlterTable
ALTER TABLE `news` ADD COLUMN `rejectReason` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `userrequest` ADD COLUMN `rejectReason` VARCHAR(191) NULL;
