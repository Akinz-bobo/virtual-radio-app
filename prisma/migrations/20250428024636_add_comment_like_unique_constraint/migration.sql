/*
  Warnings:

  - You are about to drop the column `genre` on the `Audiobook` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Podcast` table. All the data in the column will be lost.
  - You are about to drop the column `audiobookId` on the `Transcription` table. All the data in the column will be lost.
  - You are about to drop the column `podcastId` on the `Transcription` table. All the data in the column will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chapterId]` on the table `Transcription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eposodeId]` on the table `Transcription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `genreId` to the `Audiobook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genreId` to the `Podcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `Transcription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transcription" DROP CONSTRAINT "Transcription_audiobookId_fkey";

-- DropForeignKey
ALTER TABLE "Transcription" DROP CONSTRAINT "Transcription_podcastId_fkey";

-- DropIndex
DROP INDEX "Transcription_audiobookId_key";

-- DropIndex
DROP INDEX "Transcription_podcastId_key";

-- AlterTable
ALTER TABLE "Audiobook" DROP COLUMN "genre",
ADD COLUMN     "genreId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Podcast" DROP COLUMN "genre",
ADD COLUMN     "genreId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transcription" DROP COLUMN "audiobookId",
DROP COLUMN "podcastId",
ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD COLUMN     "eposodeId" TEXT;

-- DropTable
DROP TABLE "Report";

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastEpisode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "audioFile" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "podcastId" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PodcastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "CommentLike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_chapterId_key" ON "Transcription"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_eposodeId_key" ON "Transcription"("eposodeId");

-- AddForeignKey
ALTER TABLE "Audiobook" ADD CONSTRAINT "Audiobook_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastEpisode" ADD CONSTRAINT "PodcastEpisode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_eposodeId_fkey" FOREIGN KEY ("eposodeId") REFERENCES "PodcastEpisode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
