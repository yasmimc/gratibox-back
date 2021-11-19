CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "plans" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"period" int NOT NULL UNIQUE,
	CONSTRAINT "plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "signatures" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"date" TIMESTAMP NOT NULL,
	CONSTRAINT "signatures_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "signature_products" (
	"id" serial NOT NULL,
	"signature_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "signature_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"token" uuid NOT NULL UNIQUE,
	"is_expired" bool NOT NULL DEFAULT 'false',
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);





ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_fk1" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");

ALTER TABLE "signature_products" ADD CONSTRAINT "signature_products_fk0" FOREIGN KEY ("signature_id") REFERENCES "signatures"("id");
ALTER TABLE "signature_products" ADD CONSTRAINT "signature_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");


ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");






