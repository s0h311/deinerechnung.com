CREATE TABLE "public"."sender" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
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

CREATE TABLE "public"."invoice_position" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "invoice_position_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."recipient" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email_address" TEXT,
    "address_line" TEXT NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "recipient_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sender_user_id_key" ON "public"."sender"("user_id");

ALTER TABLE "public"."sender" ADD CONSTRAINT "sender_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."invoice_position" ADD CONSTRAINT "invoice_position_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."sender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."recipient" ADD CONSTRAINT "recipient_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."sender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;