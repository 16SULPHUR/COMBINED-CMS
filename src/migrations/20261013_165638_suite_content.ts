import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_suite_copy_scenes_slug" AS ENUM('scan', 'print', 'link', 'supplier', 'stickers', 'dues', 'close', 'gst');
  CREATE TYPE "payload"."enum_suite_copy_scenes_tone" AS ENUM('cloth', 'gold', 'cotton', 'rose', 'rani', 'night', 'leaf');
  CREATE TYPE "payload"."enum_suite_copy_yours_tabs_key" AS ENUM('details', 'gst', 'stickers', 'values');
  CREATE TYPE "payload"."enum_suite_copy_shelf_swatches_icon" AS ENUM('creditCard', 'qrCode', 'repeat', 'clipboard', 'book', 'users', 'calendar', 'phone');
  CREATE TYPE "payload"."enum_suite_copy_shelf_swatches_fabric" AS ENUM('paisleyIndigo', 'paisleyNight', 'paisleyRani', 'paisleyGold', 'paisleyLeaf', 'paisleyRose', 'paisleyCloth', 'starCloth', 'starNight', 'starLeaf');
  CREATE TYPE "payload"."enum_suite_copy_wired_links_icon" AS ENUM('phone', 'monitor', 'printer', 'tag');
  CREATE TABLE "payload"."suite_copy_header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."suite_copy_scenes_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."suite_copy_scenes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" "payload"."enum_suite_copy_scenes_slug" NOT NULL,
  	"tone" "payload"."enum_suite_copy_scenes_tone" NOT NULL,
  	"flip" boolean,
  	"kicker" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"lead" varchar NOT NULL,
  	"minutes" numeric,
  	"time_text" varchar,
  	"period_text" varchar
  );
  
  CREATE TABLE "payload"."suite_copy_yours_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "payload"."enum_suite_copy_yours_tabs_key" NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."suite_copy_shelf_swatches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "payload"."enum_suite_copy_shelf_swatches_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"fabric" "payload"."enum_suite_copy_shelf_swatches_fabric" NOT NULL
  );
  
  CREATE TABLE "payload"."suite_copy_wired_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "payload"."enum_suite_copy_wired_links_icon" NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."suite_copy_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"period" varchar,
  	"description" varchar NOT NULL,
  	"cta" varchar NOT NULL,
  	"featured" boolean
  );
  
  CREATE TABLE "payload"."suite_copy_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."suite_copy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_share_title" varchar NOT NULL,
  	"seo_share_description" varchar NOT NULL,
  	"header_brand_label" varchar NOT NULL,
  	"header_till_link" varchar NOT NULL,
  	"header_demo_cta" varchar NOT NULL,
  	"header_demo_cta_short" varchar NOT NULL,
  	"hero_eyebrow" varchar NOT NULL,
  	"hero_title_lead" varchar NOT NULL,
  	"hero_title_highlight" varchar NOT NULL,
  	"hero_title_tail" varchar NOT NULL,
  	"hero_body" varchar NOT NULL,
  	"hero_primary_cta" varchar NOT NULL,
  	"hero_secondary_cta" varchar NOT NULL,
  	"hero_aside" varchar NOT NULL,
  	"hero_picker_label" varchar NOT NULL,
  	"day_eyebrow" varchar NOT NULL,
  	"day_title" varchar NOT NULL,
  	"day_body" varchar NOT NULL,
  	"day_badge" varchar NOT NULL,
  	"yours_eyebrow" varchar NOT NULL,
  	"yours_title" varchar NOT NULL,
  	"yours_body" varchar NOT NULL,
  	"yours_fixed_lead" varchar NOT NULL,
  	"yours_fixed_text" varchar NOT NULL,
  	"yours_fixed_cta" varchar NOT NULL,
  	"shelf_eyebrow" varchar NOT NULL,
  	"shelf_title" varchar NOT NULL,
  	"shelf_body" varchar NOT NULL,
  	"wired_eyebrow" varchar NOT NULL,
  	"wired_title" varchar NOT NULL,
  	"wired_body" varchar NOT NULL,
  	"wired_note_lead" varchar NOT NULL,
  	"wired_note_text" varchar NOT NULL,
  	"pricing_eyebrow" varchar NOT NULL,
  	"pricing_title" varchar NOT NULL,
  	"pricing_body" varchar NOT NULL,
  	"pricing_badge" varchar NOT NULL,
  	"faq_eyebrow" varchar NOT NULL,
  	"faq_title" varchar NOT NULL,
  	"faq_body" varchar NOT NULL,
  	"faq_cta" varchar NOT NULL,
  	"footer_badge" varchar NOT NULL,
  	"footer_title" varchar NOT NULL,
  	"footer_body" varchar NOT NULL,
  	"footer_primary_cta" varchar NOT NULL,
  	"footer_secondary_cta" varchar NOT NULL,
  	"footer_tagline" varchar NOT NULL,
  	"footer_copyright" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."suite_copy_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload"."suite_copy_header_nav" ADD CONSTRAINT "suite_copy_header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_scenes_points" ADD CONSTRAINT "suite_copy_scenes_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy_scenes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_scenes" ADD CONSTRAINT "suite_copy_scenes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_yours_tabs" ADD CONSTRAINT "suite_copy_yours_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_shelf_swatches" ADD CONSTRAINT "suite_copy_shelf_swatches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_wired_links" ADD CONSTRAINT "suite_copy_wired_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_pricing_plans" ADD CONSTRAINT "suite_copy_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_faq_items" ADD CONSTRAINT "suite_copy_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."suite_copy_texts" ADD CONSTRAINT "suite_copy_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."suite_copy"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "suite_copy_header_nav_order_idx" ON "payload"."suite_copy_header_nav" USING btree ("_order");
  CREATE INDEX "suite_copy_header_nav_parent_id_idx" ON "payload"."suite_copy_header_nav" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_scenes_points_order_idx" ON "payload"."suite_copy_scenes_points" USING btree ("_order");
  CREATE INDEX "suite_copy_scenes_points_parent_id_idx" ON "payload"."suite_copy_scenes_points" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_scenes_order_idx" ON "payload"."suite_copy_scenes" USING btree ("_order");
  CREATE INDEX "suite_copy_scenes_parent_id_idx" ON "payload"."suite_copy_scenes" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_yours_tabs_order_idx" ON "payload"."suite_copy_yours_tabs" USING btree ("_order");
  CREATE INDEX "suite_copy_yours_tabs_parent_id_idx" ON "payload"."suite_copy_yours_tabs" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_shelf_swatches_order_idx" ON "payload"."suite_copy_shelf_swatches" USING btree ("_order");
  CREATE INDEX "suite_copy_shelf_swatches_parent_id_idx" ON "payload"."suite_copy_shelf_swatches" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_wired_links_order_idx" ON "payload"."suite_copy_wired_links" USING btree ("_order");
  CREATE INDEX "suite_copy_wired_links_parent_id_idx" ON "payload"."suite_copy_wired_links" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_pricing_plans_order_idx" ON "payload"."suite_copy_pricing_plans" USING btree ("_order");
  CREATE INDEX "suite_copy_pricing_plans_parent_id_idx" ON "payload"."suite_copy_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_faq_items_order_idx" ON "payload"."suite_copy_faq_items" USING btree ("_order");
  CREATE INDEX "suite_copy_faq_items_parent_id_idx" ON "payload"."suite_copy_faq_items" USING btree ("_parent_id");
  CREATE INDEX "suite_copy_texts_order_parent" ON "payload"."suite_copy_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."suite_copy_header_nav" CASCADE;
  DROP TABLE "payload"."suite_copy_scenes_points" CASCADE;
  DROP TABLE "payload"."suite_copy_scenes" CASCADE;
  DROP TABLE "payload"."suite_copy_yours_tabs" CASCADE;
  DROP TABLE "payload"."suite_copy_shelf_swatches" CASCADE;
  DROP TABLE "payload"."suite_copy_wired_links" CASCADE;
  DROP TABLE "payload"."suite_copy_pricing_plans" CASCADE;
  DROP TABLE "payload"."suite_copy_faq_items" CASCADE;
  DROP TABLE "payload"."suite_copy" CASCADE;
  DROP TABLE "payload"."suite_copy_texts" CASCADE;
  DROP TYPE "payload"."enum_suite_copy_scenes_slug";
  DROP TYPE "payload"."enum_suite_copy_scenes_tone";
  DROP TYPE "payload"."enum_suite_copy_yours_tabs_key";
  DROP TYPE "payload"."enum_suite_copy_shelf_swatches_icon";
  DROP TYPE "payload"."enum_suite_copy_shelf_swatches_fabric";
  DROP TYPE "payload"."enum_suite_copy_wired_links_icon";`)
}
