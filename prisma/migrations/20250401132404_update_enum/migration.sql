/*
  Warnings:

  - The values [OTHER] on the enum `User_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `news` MODIFY `status` ENUM('DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'REJECTED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `user` MODIFY `gender` ENUM('MALE', 'FEMALE') NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `userrequest` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENED') NOT NULL DEFAULT 'PENDING';
