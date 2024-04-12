-- CreateTable
CREATE TABLE "public"."sender" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "footnotes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "address_line" TEXT NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "running_invoice_number" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "sender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice_position" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "vat_rate" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,

    CONSTRAINT "invoice_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address_line" TEXT NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "sender_id" INTEGER NOT NULL,

    CONSTRAINT "recipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sender_user_id_key" ON "public"."sender"("user_id");

-- AddForeignKey
ALTER TABLE "public"."invoice_position" ADD CONSTRAINT "invoice_position_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."sender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipient" ADD CONSTRAINT "recipient_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."sender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
