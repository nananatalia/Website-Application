/*
  Warnings:

  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_userId_fkey";

-- DropTable
DROP TABLE "Settings";

-- CreateTable
CREATE TABLE "ColorPreset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color1" TEXT NOT NULL,
    "color2" TEXT NOT NULL,
    "color3" TEXT NOT NULL,
    "color4" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorPreset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ColorPreset" ADD CONSTRAINT "ColorPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
