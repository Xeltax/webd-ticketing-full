-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_createdById_fkey";

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
