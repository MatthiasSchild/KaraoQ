-- CreateTable
CREATE TABLE "public"."parties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "join_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."singers" (
    "id" TEXT NOT NULL,
    "party_id" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "singer" TEXT NOT NULL,
    "song" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skipped" TIMESTAMP(3),
    "done" TIMESTAMP(3),

    CONSTRAINT "singers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parties_join_code_key" ON "public"."parties"("join_code");

-- AddForeignKey
ALTER TABLE "public"."singers" ADD CONSTRAINT "singers_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "public"."parties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
