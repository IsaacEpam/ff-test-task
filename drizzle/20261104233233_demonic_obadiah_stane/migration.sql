CREATE TABLE "flags" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"value" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
