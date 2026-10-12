import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_portfolio_projects_group" AS ENUM('work', 'side');
  CREATE TYPE "payload"."enum_portfolio_projects_color" AS ENUM('hero', 'peach', 'mint', 'butter', 'lilac', 'aqua', 'rose', 'sage');
  CREATE TYPE "payload"."enum_portfolio_roles_color" AS ENUM('hero', 'peach', 'mint', 'butter', 'lilac', 'aqua', 'rose', 'sage');
  CREATE TABLE "payload"."portfolio_projects_blocks_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"chip" varchar,
  	"tone" varchar,
  	"rec" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."portfolio_projects_blocks_stages_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"tone" varchar
  );
  
  CREATE TABLE "payload"."portfolio_projects_blocks_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."portfolio_projects_blocks_barcode" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."portfolio_projects_blocks_meter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"verdict" varchar NOT NULL,
  	"tone" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."portfolio_projects_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"caption" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"group" "payload"."enum_portfolio_projects_group" NOT NULL,
  	"color" "payload"."enum_portfolio_projects_color" NOT NULL,
  	"shot_title" varchar NOT NULL,
  	"meta" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"company" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"color" "payload"."enum_portfolio_roles_color" NOT NULL,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_roles_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_internships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"company" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_internships_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"tone" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_skills_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"publication" varchar NOT NULL,
  	"date" varchar NOT NULL,
  	"read_time" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_articles_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_profile_now" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "payload"."portfolio_profile_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"greeting" varchar NOT NULL,
  	"first" varchar NOT NULL,
  	"last" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."portfolio_resume_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_resume_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_resume_experience_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "payload"."portfolio_resume_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"org" varchar NOT NULL,
  	"href" varchar,
  	"period" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_resume_projects_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "payload"."portfolio_resume_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "payload"."portfolio_resume_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"degree" varchar NOT NULL,
  	"school" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "payload"."portfolio_resume" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."portfolio_resume_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_education" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"degree" varchar NOT NULL,
  	"school" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"score_label" varchar NOT NULL,
  	"score_value" varchar NOT NULL,
  	"score_out_of" varchar NOT NULL,
  	"score_note" varchar,
  	"blurb" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."portfolio_contact_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"greeting" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"signoff" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_projects_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_roles_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_internships_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_skills_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_articles_id" integer;
  ALTER TABLE "payload"."portfolio_projects_blocks_row" ADD CONSTRAINT "portfolio_projects_blocks_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_projects_blocks_stages_items" ADD CONSTRAINT "portfolio_projects_blocks_stages_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_projects_blocks_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_projects_blocks_stages" ADD CONSTRAINT "portfolio_projects_blocks_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_projects_blocks_barcode" ADD CONSTRAINT "portfolio_projects_blocks_barcode_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_projects_blocks_meter" ADD CONSTRAINT "portfolio_projects_blocks_meter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_projects_links" ADD CONSTRAINT "portfolio_projects_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_projects_texts" ADD CONSTRAINT "portfolio_projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_roles_texts" ADD CONSTRAINT "portfolio_roles_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_internships_texts" ADD CONSTRAINT "portfolio_internships_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_internships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_skills_texts" ADD CONSTRAINT "portfolio_skills_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_articles_texts" ADD CONSTRAINT "portfolio_articles_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_profile_now" ADD CONSTRAINT "portfolio_profile_now_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_profile_links" ADD CONSTRAINT "portfolio_profile_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_contact" ADD CONSTRAINT "portfolio_resume_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_skills" ADD CONSTRAINT "portfolio_resume_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_experience_points" ADD CONSTRAINT "portfolio_resume_experience_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_resume_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_experience" ADD CONSTRAINT "portfolio_resume_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_projects_points" ADD CONSTRAINT "portfolio_resume_projects_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_resume_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_projects" ADD CONSTRAINT "portfolio_resume_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_education" ADD CONSTRAINT "portfolio_resume_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_resume_texts" ADD CONSTRAINT "portfolio_resume_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_contact_links" ADD CONSTRAINT "portfolio_contact_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_contact"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "portfolio_projects_blocks_row_order_idx" ON "payload"."portfolio_projects_blocks_row" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_row_parent_id_idx" ON "payload"."portfolio_projects_blocks_row" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_row_path_idx" ON "payload"."portfolio_projects_blocks_row" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_stages_items_order_idx" ON "payload"."portfolio_projects_blocks_stages_items" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_stages_items_parent_id_idx" ON "payload"."portfolio_projects_blocks_stages_items" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_stages_order_idx" ON "payload"."portfolio_projects_blocks_stages" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_stages_parent_id_idx" ON "payload"."portfolio_projects_blocks_stages" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_stages_path_idx" ON "payload"."portfolio_projects_blocks_stages" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_barcode_order_idx" ON "payload"."portfolio_projects_blocks_barcode" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_barcode_parent_id_idx" ON "payload"."portfolio_projects_blocks_barcode" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_barcode_path_idx" ON "payload"."portfolio_projects_blocks_barcode" USING btree ("_path");
  CREATE INDEX "portfolio_projects_blocks_meter_order_idx" ON "payload"."portfolio_projects_blocks_meter" USING btree ("_order");
  CREATE INDEX "portfolio_projects_blocks_meter_parent_id_idx" ON "payload"."portfolio_projects_blocks_meter" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects_blocks_meter_path_idx" ON "payload"."portfolio_projects_blocks_meter" USING btree ("_path");
  CREATE INDEX "portfolio_projects_links_order_idx" ON "payload"."portfolio_projects_links" USING btree ("_order");
  CREATE INDEX "portfolio_projects_links_parent_id_idx" ON "payload"."portfolio_projects_links" USING btree ("_parent_id");
  CREATE INDEX "portfolio_projects__order_idx" ON "payload"."portfolio_projects" USING btree ("_order");
  CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "payload"."portfolio_projects" USING btree ("slug");
  CREATE INDEX "portfolio_projects_updated_at_idx" ON "payload"."portfolio_projects" USING btree ("updated_at");
  CREATE INDEX "portfolio_projects_created_at_idx" ON "payload"."portfolio_projects" USING btree ("created_at");
  CREATE INDEX "portfolio_projects_texts_order_parent" ON "payload"."portfolio_projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_roles__order_idx" ON "payload"."portfolio_roles" USING btree ("_order");
  CREATE INDEX "portfolio_roles_updated_at_idx" ON "payload"."portfolio_roles" USING btree ("updated_at");
  CREATE INDEX "portfolio_roles_created_at_idx" ON "payload"."portfolio_roles" USING btree ("created_at");
  CREATE INDEX "portfolio_roles_texts_order_parent" ON "payload"."portfolio_roles_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_internships__order_idx" ON "payload"."portfolio_internships" USING btree ("_order");
  CREATE INDEX "portfolio_internships_updated_at_idx" ON "payload"."portfolio_internships" USING btree ("updated_at");
  CREATE INDEX "portfolio_internships_created_at_idx" ON "payload"."portfolio_internships" USING btree ("created_at");
  CREATE INDEX "portfolio_internships_texts_order_parent" ON "payload"."portfolio_internships_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_skills__order_idx" ON "payload"."portfolio_skills" USING btree ("_order");
  CREATE UNIQUE INDEX "portfolio_skills_name_idx" ON "payload"."portfolio_skills" USING btree ("name");
  CREATE INDEX "portfolio_skills_updated_at_idx" ON "payload"."portfolio_skills" USING btree ("updated_at");
  CREATE INDEX "portfolio_skills_created_at_idx" ON "payload"."portfolio_skills" USING btree ("created_at");
  CREATE INDEX "portfolio_skills_texts_order_parent" ON "payload"."portfolio_skills_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_articles__order_idx" ON "payload"."portfolio_articles" USING btree ("_order");
  CREATE UNIQUE INDEX "portfolio_articles_href_idx" ON "payload"."portfolio_articles" USING btree ("href");
  CREATE INDEX "portfolio_articles_updated_at_idx" ON "payload"."portfolio_articles" USING btree ("updated_at");
  CREATE INDEX "portfolio_articles_created_at_idx" ON "payload"."portfolio_articles" USING btree ("created_at");
  CREATE INDEX "portfolio_articles_texts_order_parent" ON "payload"."portfolio_articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_profile_now_order_idx" ON "payload"."portfolio_profile_now" USING btree ("_order");
  CREATE INDEX "portfolio_profile_now_parent_id_idx" ON "payload"."portfolio_profile_now" USING btree ("_parent_id");
  CREATE INDEX "portfolio_profile_links_order_idx" ON "payload"."portfolio_profile_links" USING btree ("_order");
  CREATE INDEX "portfolio_profile_links_parent_id_idx" ON "payload"."portfolio_profile_links" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_contact_order_idx" ON "payload"."portfolio_resume_contact" USING btree ("_order");
  CREATE INDEX "portfolio_resume_contact_parent_id_idx" ON "payload"."portfolio_resume_contact" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_skills_order_idx" ON "payload"."portfolio_resume_skills" USING btree ("_order");
  CREATE INDEX "portfolio_resume_skills_parent_id_idx" ON "payload"."portfolio_resume_skills" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_experience_points_order_idx" ON "payload"."portfolio_resume_experience_points" USING btree ("_order");
  CREATE INDEX "portfolio_resume_experience_points_parent_id_idx" ON "payload"."portfolio_resume_experience_points" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_experience_order_idx" ON "payload"."portfolio_resume_experience" USING btree ("_order");
  CREATE INDEX "portfolio_resume_experience_parent_id_idx" ON "payload"."portfolio_resume_experience" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_projects_points_order_idx" ON "payload"."portfolio_resume_projects_points" USING btree ("_order");
  CREATE INDEX "portfolio_resume_projects_points_parent_id_idx" ON "payload"."portfolio_resume_projects_points" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_projects_order_idx" ON "payload"."portfolio_resume_projects" USING btree ("_order");
  CREATE INDEX "portfolio_resume_projects_parent_id_idx" ON "payload"."portfolio_resume_projects" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_education_order_idx" ON "payload"."portfolio_resume_education" USING btree ("_order");
  CREATE INDEX "portfolio_resume_education_parent_id_idx" ON "payload"."portfolio_resume_education" USING btree ("_parent_id");
  CREATE INDEX "portfolio_resume_texts_order_parent" ON "payload"."portfolio_resume_texts" USING btree ("order","parent_id");
  CREATE INDEX "portfolio_contact_links_order_idx" ON "payload"."portfolio_contact_links" USING btree ("_order");
  CREATE INDEX "portfolio_contact_links_parent_id_idx" ON "payload"."portfolio_contact_links" USING btree ("_parent_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_projects_fk" FOREIGN KEY ("portfolio_projects_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_roles_fk" FOREIGN KEY ("portfolio_roles_id") REFERENCES "payload"."portfolio_roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_internships_fk" FOREIGN KEY ("portfolio_internships_id") REFERENCES "payload"."portfolio_internships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_skills_fk" FOREIGN KEY ("portfolio_skills_id") REFERENCES "payload"."portfolio_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_articles_fk" FOREIGN KEY ("portfolio_articles_id") REFERENCES "payload"."portfolio_articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_portfolio_projects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_projects_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_roles_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_roles_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_internships_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_internships_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_skills_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_skills_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_articles_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_articles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."portfolio_projects_blocks_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_projects_blocks_stages_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_projects_blocks_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_projects_blocks_barcode" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_projects_blocks_meter" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_projects_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_projects_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_roles_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_internships" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_internships_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_skills_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_articles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_articles_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_profile_now" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_profile_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_profile" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_experience_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_experience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_projects_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_education" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_resume_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_education" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_contact_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_contact" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."portfolio_projects_blocks_row" CASCADE;
  DROP TABLE "payload"."portfolio_projects_blocks_stages_items" CASCADE;
  DROP TABLE "payload"."portfolio_projects_blocks_stages" CASCADE;
  DROP TABLE "payload"."portfolio_projects_blocks_barcode" CASCADE;
  DROP TABLE "payload"."portfolio_projects_blocks_meter" CASCADE;
  DROP TABLE "payload"."portfolio_projects_links" CASCADE;
  DROP TABLE "payload"."portfolio_projects" CASCADE;
  DROP TABLE "payload"."portfolio_projects_texts" CASCADE;
  DROP TABLE "payload"."portfolio_roles" CASCADE;
  DROP TABLE "payload"."portfolio_roles_texts" CASCADE;
  DROP TABLE "payload"."portfolio_internships" CASCADE;
  DROP TABLE "payload"."portfolio_internships_texts" CASCADE;
  DROP TABLE "payload"."portfolio_skills" CASCADE;
  DROP TABLE "payload"."portfolio_skills_texts" CASCADE;
  DROP TABLE "payload"."portfolio_articles" CASCADE;
  DROP TABLE "payload"."portfolio_articles_texts" CASCADE;
  DROP TABLE "payload"."portfolio_profile_now" CASCADE;
  DROP TABLE "payload"."portfolio_profile_links" CASCADE;
  DROP TABLE "payload"."portfolio_profile" CASCADE;
  DROP TABLE "payload"."portfolio_resume_contact" CASCADE;
  DROP TABLE "payload"."portfolio_resume_skills" CASCADE;
  DROP TABLE "payload"."portfolio_resume_experience_points" CASCADE;
  DROP TABLE "payload"."portfolio_resume_experience" CASCADE;
  DROP TABLE "payload"."portfolio_resume_projects_points" CASCADE;
  DROP TABLE "payload"."portfolio_resume_projects" CASCADE;
  DROP TABLE "payload"."portfolio_resume_education" CASCADE;
  DROP TABLE "payload"."portfolio_resume" CASCADE;
  DROP TABLE "payload"."portfolio_resume_texts" CASCADE;
  DROP TABLE "payload"."portfolio_education" CASCADE;
  DROP TABLE "payload"."portfolio_contact_links" CASCADE;
  DROP TABLE "payload"."portfolio_contact" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_projects_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_roles_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_internships_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_skills_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_portfolio_articles_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_portfolio_projects_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_portfolio_roles_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_portfolio_internships_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_portfolio_skills_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_portfolio_articles_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_projects_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_roles_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_internships_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_skills_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_articles_id";
  DROP TYPE "payload"."enum_portfolio_projects_group";
  DROP TYPE "payload"."enum_portfolio_projects_color";
  DROP TYPE "payload"."enum_portfolio_roles_color";`)
}
