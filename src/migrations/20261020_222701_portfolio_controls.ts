import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum__portfolio_projects_v_version_group" AS ENUM('work', 'side');
  CREATE TYPE "payload"."enum__portfolio_projects_v_version_color" AS ENUM('hero', 'peach', 'mint', 'butter', 'lilac', 'aqua', 'rose', 'sage');
  CREATE TYPE "payload"."enum__portfolio_roles_v_version_color" AS ENUM('hero', 'peach', 'mint', 'butter', 'lilac', 'aqua', 'rose', 'sage');
  CREATE TYPE "payload"."enum_portfolio_site_main_line_card" AS ENUM('intro', 'work', 'internships', 'projects', 'stack', 'writing', 'education', 'contact');
  CREATE TYPE "payload"."enum_portfolio_site_sky_mode" AS ENUM('live', 'fixed');
  CREATE TYPE "payload"."enum_portfolio_site_styles_default" AS ENUM('cards', 'island');
  CREATE TYPE "payload"."enum_portfolio_site_styles_transition" AS ENUM('postcard', 'fade', 'none');
  CREATE TYPE "payload"."enum__portfolio_site_v_version_main_line_card" AS ENUM('intro', 'work', 'internships', 'projects', 'stack', 'writing', 'education', 'contact');
  CREATE TYPE "payload"."enum__portfolio_site_v_version_sky_mode" AS ENUM('live', 'fixed');
  CREATE TYPE "payload"."enum__portfolio_site_v_version_styles_default" AS ENUM('cards', 'island');
  CREATE TYPE "payload"."enum__portfolio_site_v_version_styles_transition" AS ENUM('postcard', 'fade', 'none');
  CREATE TABLE "payload"."_portfolio_projects_v_blocks_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"chip" varchar,
  	"tone" varchar,
  	"rec" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_projects_v_blocks_stages_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"tone" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_projects_v_blocks_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_projects_v_blocks_barcode" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_projects_v_blocks_meter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" numeric NOT NULL,
  	"verdict" varchar NOT NULL,
  	"tone" varchar NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_projects_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_slug" varchar NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_caption" varchar NOT NULL,
  	"version_year" varchar NOT NULL,
  	"version_group" "payload"."enum__portfolio_projects_v_version_group" NOT NULL,
  	"version_color" "payload"."enum__portfolio_projects_v_version_color" NOT NULL,
  	"version_shot_title" varchar NOT NULL,
  	"version_meta" varchar NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_note" varchar,
  	"version_hidden" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_roles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_company" varchar NOT NULL,
  	"version_title" varchar NOT NULL,
  	"version_period" varchar NOT NULL,
  	"version_color" "payload"."enum__portfolio_roles_v_version_color" NOT NULL,
  	"version_note" varchar,
  	"version_hidden" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_roles_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_internships_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_company" varchar NOT NULL,
  	"version_title" varchar NOT NULL,
  	"version_period" varchar NOT NULL,
  	"version_hidden" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_internships_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_skills_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_name" varchar NOT NULL,
  	"version_tone" varchar NOT NULL,
  	"version_hidden" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_skills_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar NOT NULL,
  	"version_publication" varchar NOT NULL,
  	"version_date" varchar NOT NULL,
  	"version_read_time" varchar NOT NULL,
  	"version_excerpt" varchar NOT NULL,
  	"version_href" varchar NOT NULL,
  	"version_hidden" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_articles_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_visits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"sid" varchar NOT NULL,
  	"visitor" varchar,
  	"started_at" timestamp(3) with time zone,
  	"last_seen_at" timestamp(3) with time zone,
  	"duration" numeric,
  	"views" numeric DEFAULT 0,
  	"actions" numeric DEFAULT 0,
  	"returning" boolean,
  	"landing" varchar,
  	"source" varchar,
  	"referrer" varchar,
  	"country" varchar,
  	"region" varchar,
  	"city" varchar,
  	"device" varchar,
  	"browser" varchar,
  	"os" varchar,
  	"screen" varchar,
  	"language" varchar,
  	"timezone" varchar,
  	"style" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visit_id" integer,
  	"type" varchar NOT NULL,
  	"target" varchar,
  	"label" varchar,
  	"path" varchar,
  	"value" numeric,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_errors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"fingerprint" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"kind" varchar,
  	"count" numeric DEFAULT 1,
  	"first_seen" timestamp(3) with time zone,
  	"last_seen" timestamp(3) with time zone,
  	"path" varchar,
  	"browser" varchar,
  	"stack" varchar,
  	"resolved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_site_main_line" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"card" "payload"."enum_portfolio_site_main_line_card" NOT NULL,
  	"label" varchar,
  	"show" boolean DEFAULT true
  );
  
  CREATE TABLE "payload"."portfolio_site_cards_stack_stickers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"tilt" numeric DEFAULT 0
  );
  
  CREATE TABLE "payload"."portfolio_site_sky_presets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"hour" numeric NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'Ankit Patil',
  	"brand_main" varchar DEFAULT 'portfolio',
  	"brand_projects" varchar DEFAULT 'projects',
  	"projects_line_work_title" varchar DEFAULT 'At work',
  	"projects_line_work_sub" varchar DEFAULT 'built at WeframeTech',
  	"projects_line_work_dock" varchar DEFAULT 'At WeframeTech',
  	"projects_line_side_title" varchar DEFAULT 'Side projects',
  	"projects_line_side_sub" varchar DEFAULT 'built for fun, used for real',
  	"projects_line_side_dock" varchar DEFAULT 'Side projects',
  	"projects_line_back_title" varchar DEFAULT '↓ back down',
  	"projects_line_back_sub" varchar DEFAULT 'to the main line',
  	"projects_line_back_dock" varchar DEFAULT 'Main line',
  	"hint_mouse" varchar DEFAULT 'scroll to drift along the line →',
  	"hint_touch" varchar DEFAULT 'swipe to drift along the line ←',
  	"cards_bundle_title" varchar DEFAULT 'Projects',
  	"cards_bundle_count" varchar DEFAULT '{n} on the upper line',
  	"cards_bundle_cta" varchar DEFAULT 'tap to float up',
  	"cards_stack_title" varchar DEFAULT 'Stack',
  	"cards_stack_logo" varchar DEFAULT 'AP',
  	"cards_internships_title" varchar DEFAULT 'Internships',
  	"cards_internships_year" varchar DEFAULT '2024',
  	"cards_writing_byline" varchar DEFAULT 'by Ankit Patil',
  	"cards_writing_cta" varchar DEFAULT 'Read the post ↗',
  	"cards_contact_to" varchar DEFAULT 'To: you',
  	"cards_contact_from" varchar DEFAULT 'from Ankit Patil',
  	"cards_contact_stamp" varchar DEFAULT 'AP',
  	"cards_contact_copy" varchar DEFAULT 'Copy email',
  	"cards_contact_copied" varchar DEFAULT 'Copied',
  	"cards_contact_copy_failed" varchar DEFAULT 'Select and copy',
  	"cards_preview_back" varchar DEFAULT '← Back',
  	"resume_share" boolean DEFAULT true,
  	"resume_download" boolean DEFAULT true,
  	"resume_share_label" varchar DEFAULT 'Share',
  	"resume_copied_label" varchar DEFAULT 'Link copied',
  	"resume_download_label" varchar DEFAULT 'Download PDF',
  	"resume_download_hint" varchar DEFAULT 'Opens the print dialog, choose Save as PDF',
  	"resume_pdf_id" integer,
  	"resume_headings_skills" varchar DEFAULT 'Technical Skills',
  	"resume_headings_experience" varchar DEFAULT 'Experience',
  	"resume_headings_projects" varchar DEFAULT 'Projects',
  	"resume_headings_education" varchar DEFAULT 'Education',
  	"music_enabled" boolean DEFAULT true,
  	"music_muted" boolean DEFAULT false,
  	"music_clicks" boolean DEFAULT true,
  	"music_volume" numeric DEFAULT 55,
  	"sky_clock" boolean DEFAULT true,
  	"sky_mode" "payload"."enum_portfolio_site_sky_mode" DEFAULT 'live',
  	"sky_hour" numeric DEFAULT 17,
  	"sky_title" varchar DEFAULT 'what time is it?',
  	"sky_live" varchar DEFAULT 'Live, your local time',
  	"styles_default" "payload"."enum_portfolio_site_styles_default" DEFAULT 'cards',
  	"styles_transition" "payload"."enum_portfolio_site_styles_transition" DEFAULT 'postcard',
  	"styles_switch" boolean DEFAULT true,
  	"styles_remember" boolean DEFAULT false,
  	"styles_labels_cards" varchar DEFAULT 'Cards',
  	"styles_labels_island" varchar DEFAULT 'Island',
  	"styles_postcard_island_title" varchar DEFAULT 'Greetings from Localhost!',
  	"styles_postcard_island_body" varchar DEFAULT 'The projects roam free here, the marsh is full of bugs, and a boat leaves whenever you like. Come say hi.',
  	"styles_postcard_island_sign" varchar DEFAULT 'Moss',
  	"styles_postcard_cards_title" varchar DEFAULT 'Back to the clothesline!',
  	"styles_postcard_cards_body" varchar DEFAULT 'Thanks for visiting the island. The cards are hanging right where you left them.',
  	"styles_postcard_cards_sign" varchar DEFAULT 'Moss',
  	"banner_show" boolean DEFAULT false,
  	"banner_text" varchar,
  	"banner_link_label" varchar,
  	"banner_link_href" varchar,
  	"banner_until" timestamp(3) with time zone,
  	"not_found_title" varchar DEFAULT '404',
  	"not_found_text" varchar DEFAULT 'Oops! Page not found',
  	"not_found_link" varchar DEFAULT 'Return to Home',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"tracking_enabled" boolean DEFAULT true,
  	"tracking_clicks" boolean DEFAULT true,
  	"tracking_game" boolean DEFAULT true,
  	"tracking_vitals" boolean DEFAULT true,
  	"tracking_errors" boolean DEFAULT true,
  	"tracking_dnt" boolean DEFAULT true,
  	"tracking_retention" numeric DEFAULT 365,
  	"tracking_legacy_worker" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."portfolio_site_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_site_v_version_main_line" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"card" "payload"."enum__portfolio_site_v_version_main_line_card" NOT NULL,
  	"label" varchar,
  	"show" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_site_v_version_cards_stack_stickers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"tilt" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_site_v_version_sky_presets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"hour" numeric NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_site_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_brand_name" varchar DEFAULT 'Ankit Patil',
  	"version_brand_main" varchar DEFAULT 'portfolio',
  	"version_brand_projects" varchar DEFAULT 'projects',
  	"version_projects_line_work_title" varchar DEFAULT 'At work',
  	"version_projects_line_work_sub" varchar DEFAULT 'built at WeframeTech',
  	"version_projects_line_work_dock" varchar DEFAULT 'At WeframeTech',
  	"version_projects_line_side_title" varchar DEFAULT 'Side projects',
  	"version_projects_line_side_sub" varchar DEFAULT 'built for fun, used for real',
  	"version_projects_line_side_dock" varchar DEFAULT 'Side projects',
  	"version_projects_line_back_title" varchar DEFAULT '↓ back down',
  	"version_projects_line_back_sub" varchar DEFAULT 'to the main line',
  	"version_projects_line_back_dock" varchar DEFAULT 'Main line',
  	"version_hint_mouse" varchar DEFAULT 'scroll to drift along the line →',
  	"version_hint_touch" varchar DEFAULT 'swipe to drift along the line ←',
  	"version_cards_bundle_title" varchar DEFAULT 'Projects',
  	"version_cards_bundle_count" varchar DEFAULT '{n} on the upper line',
  	"version_cards_bundle_cta" varchar DEFAULT 'tap to float up',
  	"version_cards_stack_title" varchar DEFAULT 'Stack',
  	"version_cards_stack_logo" varchar DEFAULT 'AP',
  	"version_cards_internships_title" varchar DEFAULT 'Internships',
  	"version_cards_internships_year" varchar DEFAULT '2024',
  	"version_cards_writing_byline" varchar DEFAULT 'by Ankit Patil',
  	"version_cards_writing_cta" varchar DEFAULT 'Read the post ↗',
  	"version_cards_contact_to" varchar DEFAULT 'To: you',
  	"version_cards_contact_from" varchar DEFAULT 'from Ankit Patil',
  	"version_cards_contact_stamp" varchar DEFAULT 'AP',
  	"version_cards_contact_copy" varchar DEFAULT 'Copy email',
  	"version_cards_contact_copied" varchar DEFAULT 'Copied',
  	"version_cards_contact_copy_failed" varchar DEFAULT 'Select and copy',
  	"version_cards_preview_back" varchar DEFAULT '← Back',
  	"version_resume_share" boolean DEFAULT true,
  	"version_resume_download" boolean DEFAULT true,
  	"version_resume_share_label" varchar DEFAULT 'Share',
  	"version_resume_copied_label" varchar DEFAULT 'Link copied',
  	"version_resume_download_label" varchar DEFAULT 'Download PDF',
  	"version_resume_download_hint" varchar DEFAULT 'Opens the print dialog, choose Save as PDF',
  	"version_resume_pdf_id" integer,
  	"version_resume_headings_skills" varchar DEFAULT 'Technical Skills',
  	"version_resume_headings_experience" varchar DEFAULT 'Experience',
  	"version_resume_headings_projects" varchar DEFAULT 'Projects',
  	"version_resume_headings_education" varchar DEFAULT 'Education',
  	"version_music_enabled" boolean DEFAULT true,
  	"version_music_muted" boolean DEFAULT false,
  	"version_music_clicks" boolean DEFAULT true,
  	"version_music_volume" numeric DEFAULT 55,
  	"version_sky_clock" boolean DEFAULT true,
  	"version_sky_mode" "payload"."enum__portfolio_site_v_version_sky_mode" DEFAULT 'live',
  	"version_sky_hour" numeric DEFAULT 17,
  	"version_sky_title" varchar DEFAULT 'what time is it?',
  	"version_sky_live" varchar DEFAULT 'Live, your local time',
  	"version_styles_default" "payload"."enum__portfolio_site_v_version_styles_default" DEFAULT 'cards',
  	"version_styles_transition" "payload"."enum__portfolio_site_v_version_styles_transition" DEFAULT 'postcard',
  	"version_styles_switch" boolean DEFAULT true,
  	"version_styles_remember" boolean DEFAULT false,
  	"version_styles_labels_cards" varchar DEFAULT 'Cards',
  	"version_styles_labels_island" varchar DEFAULT 'Island',
  	"version_styles_postcard_island_title" varchar DEFAULT 'Greetings from Localhost!',
  	"version_styles_postcard_island_body" varchar DEFAULT 'The projects roam free here, the marsh is full of bugs, and a boat leaves whenever you like. Come say hi.',
  	"version_styles_postcard_island_sign" varchar DEFAULT 'Moss',
  	"version_styles_postcard_cards_title" varchar DEFAULT 'Back to the clothesline!',
  	"version_styles_postcard_cards_body" varchar DEFAULT 'Thanks for visiting the island. The cards are hanging right where you left them.',
  	"version_styles_postcard_cards_sign" varchar DEFAULT 'Moss',
  	"version_banner_show" boolean DEFAULT false,
  	"version_banner_text" varchar,
  	"version_banner_link_label" varchar,
  	"version_banner_link_href" varchar,
  	"version_banner_until" timestamp(3) with time zone,
  	"version_not_found_title" varchar DEFAULT '404',
  	"version_not_found_text" varchar DEFAULT 'Oops! Page not found',
  	"version_not_found_link" varchar DEFAULT 'Return to Home',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_tracking_enabled" boolean DEFAULT true,
  	"version_tracking_clicks" boolean DEFAULT true,
  	"version_tracking_game" boolean DEFAULT true,
  	"version_tracking_vitals" boolean DEFAULT true,
  	"version_tracking_errors" boolean DEFAULT true,
  	"version_tracking_dnt" boolean DEFAULT true,
  	"version_tracking_retention" numeric DEFAULT 365,
  	"version_tracking_legacy_worker" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_site_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_profile_v_version_now" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_profile_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_profile_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_greeting" varchar NOT NULL,
  	"version_first" varchar NOT NULL,
  	"version_last" varchar NOT NULL,
  	"version_role" varchar NOT NULL,
  	"version_tagline" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_version_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_version_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_version_experience_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_version_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"org" varchar NOT NULL,
  	"href" varchar,
  	"period" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_version_projects_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_version_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_version_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"degree" varchar NOT NULL,
  	"school" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_role" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_resume_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_education_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_degree" varchar NOT NULL,
  	"version_school" varchar NOT NULL,
  	"version_period" varchar NOT NULL,
  	"version_score_label" varchar NOT NULL,
  	"version_score_value" varchar NOT NULL,
  	"version_score_out_of" varchar NOT NULL,
  	"version_score_note" varchar,
  	"version_blurb" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_contact_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_contact_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_greeting" varchar NOT NULL,
  	"version_heading" varchar NOT NULL,
  	"version_body" varchar NOT NULL,
  	"version_email" varchar NOT NULL,
  	"version_signoff" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."portfolio_projects" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "payload"."portfolio_roles" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "payload"."portfolio_internships" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "payload"."portfolio_skills" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "payload"."portfolio_articles" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_visits_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_events_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "portfolio_errors_id" integer;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_row" ADD CONSTRAINT "_portfolio_projects_v_blocks_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_stages_items" ADD CONSTRAINT "_portfolio_projects_v_blocks_stages_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_projects_v_blocks_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_stages" ADD CONSTRAINT "_portfolio_projects_v_blocks_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_barcode" ADD CONSTRAINT "_portfolio_projects_v_blocks_barcode_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_meter" ADD CONSTRAINT "_portfolio_projects_v_blocks_meter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_projects_v_version_links" ADD CONSTRAINT "_portfolio_projects_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_projects_v" ADD CONSTRAINT "_portfolio_projects_v_parent_id_portfolio_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_projects_v_texts" ADD CONSTRAINT "_portfolio_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_roles_v" ADD CONSTRAINT "_portfolio_roles_v_parent_id_portfolio_roles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_roles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_roles_v_texts" ADD CONSTRAINT "_portfolio_roles_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_roles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_internships_v" ADD CONSTRAINT "_portfolio_internships_v_parent_id_portfolio_internships_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_internships"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_internships_v_texts" ADD CONSTRAINT "_portfolio_internships_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_internships_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_skills_v" ADD CONSTRAINT "_portfolio_skills_v_parent_id_portfolio_skills_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_skills"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_skills_v_texts" ADD CONSTRAINT "_portfolio_skills_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_skills_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_articles_v" ADD CONSTRAINT "_portfolio_articles_v_parent_id_portfolio_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_articles_v_texts" ADD CONSTRAINT "_portfolio_articles_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_events" ADD CONSTRAINT "portfolio_events_visit_id_portfolio_visits_id_fk" FOREIGN KEY ("visit_id") REFERENCES "payload"."portfolio_visits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_site_main_line" ADD CONSTRAINT "portfolio_site_main_line_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_site_cards_stack_stickers" ADD CONSTRAINT "portfolio_site_cards_stack_stickers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_site_sky_presets" ADD CONSTRAINT "portfolio_site_sky_presets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_site" ADD CONSTRAINT "portfolio_site_resume_pdf_id_media_id_fk" FOREIGN KEY ("resume_pdf_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_site" ADD CONSTRAINT "portfolio_site_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_site_texts" ADD CONSTRAINT "portfolio_site_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_site_v_version_main_line" ADD CONSTRAINT "_portfolio_site_v_version_main_line_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_site_v_version_cards_stack_stickers" ADD CONSTRAINT "_portfolio_site_v_version_cards_stack_stickers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_site_v_version_sky_presets" ADD CONSTRAINT "_portfolio_site_v_version_sky_presets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_site_v" ADD CONSTRAINT "_portfolio_site_v_version_resume_pdf_id_media_id_fk" FOREIGN KEY ("version_resume_pdf_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_site_v" ADD CONSTRAINT "_portfolio_site_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_site_v_texts" ADD CONSTRAINT "_portfolio_site_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_profile_v_version_now" ADD CONSTRAINT "_portfolio_profile_v_version_now_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_profile_v_version_links" ADD CONSTRAINT "_portfolio_profile_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_version_contact" ADD CONSTRAINT "_portfolio_resume_v_version_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_version_skills" ADD CONSTRAINT "_portfolio_resume_v_version_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_version_experience_points" ADD CONSTRAINT "_portfolio_resume_v_version_experience_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_resume_v_version_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_version_experience" ADD CONSTRAINT "_portfolio_resume_v_version_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_version_projects_points" ADD CONSTRAINT "_portfolio_resume_v_version_projects_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_resume_v_version_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_version_projects" ADD CONSTRAINT "_portfolio_resume_v_version_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_version_education" ADD CONSTRAINT "_portfolio_resume_v_version_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_resume_v_texts" ADD CONSTRAINT "_portfolio_resume_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_contact_v_version_links" ADD CONSTRAINT "_portfolio_contact_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_contact_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_portfolio_projects_v_blocks_row_order_idx" ON "payload"."_portfolio_projects_v_blocks_row" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_row_parent_id_idx" ON "payload"."_portfolio_projects_v_blocks_row" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_row_path_idx" ON "payload"."_portfolio_projects_v_blocks_row" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_stages_items_order_idx" ON "payload"."_portfolio_projects_v_blocks_stages_items" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_stages_items_parent_id_idx" ON "payload"."_portfolio_projects_v_blocks_stages_items" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_stages_order_idx" ON "payload"."_portfolio_projects_v_blocks_stages" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_stages_parent_id_idx" ON "payload"."_portfolio_projects_v_blocks_stages" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_stages_path_idx" ON "payload"."_portfolio_projects_v_blocks_stages" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_barcode_order_idx" ON "payload"."_portfolio_projects_v_blocks_barcode" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_barcode_parent_id_idx" ON "payload"."_portfolio_projects_v_blocks_barcode" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_barcode_path_idx" ON "payload"."_portfolio_projects_v_blocks_barcode" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_blocks_meter_order_idx" ON "payload"."_portfolio_projects_v_blocks_meter" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_blocks_meter_parent_id_idx" ON "payload"."_portfolio_projects_v_blocks_meter" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_blocks_meter_path_idx" ON "payload"."_portfolio_projects_v_blocks_meter" USING btree ("_path");
  CREATE INDEX "_portfolio_projects_v_version_links_order_idx" ON "payload"."_portfolio_projects_v_version_links" USING btree ("_order");
  CREATE INDEX "_portfolio_projects_v_version_links_parent_id_idx" ON "payload"."_portfolio_projects_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_projects_v_parent_idx" ON "payload"."_portfolio_projects_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_projects_v_version_version__order_idx" ON "payload"."_portfolio_projects_v" USING btree ("version__order");
  CREATE INDEX "_portfolio_projects_v_version_version_slug_idx" ON "payload"."_portfolio_projects_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_projects_v_version_version_hidden_idx" ON "payload"."_portfolio_projects_v" USING btree ("version_hidden");
  CREATE INDEX "_portfolio_projects_v_version_version_updated_at_idx" ON "payload"."_portfolio_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_projects_v_version_version_created_at_idx" ON "payload"."_portfolio_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_projects_v_created_at_idx" ON "payload"."_portfolio_projects_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_projects_v_updated_at_idx" ON "payload"."_portfolio_projects_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_projects_v_texts_order_parent" ON "payload"."_portfolio_projects_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_roles_v_parent_idx" ON "payload"."_portfolio_roles_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_roles_v_version_version__order_idx" ON "payload"."_portfolio_roles_v" USING btree ("version__order");
  CREATE INDEX "_portfolio_roles_v_version_version_hidden_idx" ON "payload"."_portfolio_roles_v" USING btree ("version_hidden");
  CREATE INDEX "_portfolio_roles_v_version_version_updated_at_idx" ON "payload"."_portfolio_roles_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_roles_v_version_version_created_at_idx" ON "payload"."_portfolio_roles_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_roles_v_created_at_idx" ON "payload"."_portfolio_roles_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_roles_v_updated_at_idx" ON "payload"."_portfolio_roles_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_roles_v_texts_order_parent" ON "payload"."_portfolio_roles_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_internships_v_parent_idx" ON "payload"."_portfolio_internships_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_internships_v_version_version__order_idx" ON "payload"."_portfolio_internships_v" USING btree ("version__order");
  CREATE INDEX "_portfolio_internships_v_version_version_hidden_idx" ON "payload"."_portfolio_internships_v" USING btree ("version_hidden");
  CREATE INDEX "_portfolio_internships_v_version_version_updated_at_idx" ON "payload"."_portfolio_internships_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_internships_v_version_version_created_at_idx" ON "payload"."_portfolio_internships_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_internships_v_created_at_idx" ON "payload"."_portfolio_internships_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_internships_v_updated_at_idx" ON "payload"."_portfolio_internships_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_internships_v_texts_order_parent" ON "payload"."_portfolio_internships_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_skills_v_parent_idx" ON "payload"."_portfolio_skills_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_skills_v_version_version__order_idx" ON "payload"."_portfolio_skills_v" USING btree ("version__order");
  CREATE INDEX "_portfolio_skills_v_version_version_name_idx" ON "payload"."_portfolio_skills_v" USING btree ("version_name");
  CREATE INDEX "_portfolio_skills_v_version_version_hidden_idx" ON "payload"."_portfolio_skills_v" USING btree ("version_hidden");
  CREATE INDEX "_portfolio_skills_v_version_version_updated_at_idx" ON "payload"."_portfolio_skills_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_skills_v_version_version_created_at_idx" ON "payload"."_portfolio_skills_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_skills_v_created_at_idx" ON "payload"."_portfolio_skills_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_skills_v_updated_at_idx" ON "payload"."_portfolio_skills_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_skills_v_texts_order_parent" ON "payload"."_portfolio_skills_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_articles_v_parent_idx" ON "payload"."_portfolio_articles_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_articles_v_version_version__order_idx" ON "payload"."_portfolio_articles_v" USING btree ("version__order");
  CREATE INDEX "_portfolio_articles_v_version_version_href_idx" ON "payload"."_portfolio_articles_v" USING btree ("version_href");
  CREATE INDEX "_portfolio_articles_v_version_version_hidden_idx" ON "payload"."_portfolio_articles_v" USING btree ("version_hidden");
  CREATE INDEX "_portfolio_articles_v_version_version_updated_at_idx" ON "payload"."_portfolio_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_articles_v_version_version_created_at_idx" ON "payload"."_portfolio_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_articles_v_created_at_idx" ON "payload"."_portfolio_articles_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_articles_v_updated_at_idx" ON "payload"."_portfolio_articles_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_articles_v_texts_order_parent" ON "payload"."_portfolio_articles_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "portfolio_visits_sid_idx" ON "payload"."portfolio_visits" USING btree ("sid");
  CREATE INDEX "portfolio_visits_visitor_idx" ON "payload"."portfolio_visits" USING btree ("visitor");
  CREATE INDEX "portfolio_visits_started_at_idx" ON "payload"."portfolio_visits" USING btree ("started_at");
  CREATE INDEX "portfolio_visits_last_seen_at_idx" ON "payload"."portfolio_visits" USING btree ("last_seen_at");
  CREATE INDEX "portfolio_visits_source_idx" ON "payload"."portfolio_visits" USING btree ("source");
  CREATE INDEX "portfolio_visits_country_idx" ON "payload"."portfolio_visits" USING btree ("country");
  CREATE INDEX "portfolio_visits_updated_at_idx" ON "payload"."portfolio_visits" USING btree ("updated_at");
  CREATE INDEX "portfolio_visits_created_at_idx" ON "payload"."portfolio_visits" USING btree ("created_at");
  CREATE INDEX "portfolio_events_visit_idx" ON "payload"."portfolio_events" USING btree ("visit_id");
  CREATE INDEX "portfolio_events_type_idx" ON "payload"."portfolio_events" USING btree ("type");
  CREATE INDEX "portfolio_events_target_idx" ON "payload"."portfolio_events" USING btree ("target");
  CREATE INDEX "portfolio_events_updated_at_idx" ON "payload"."portfolio_events" USING btree ("updated_at");
  CREATE INDEX "portfolio_events_created_at_idx" ON "payload"."portfolio_events" USING btree ("created_at");
  CREATE UNIQUE INDEX "portfolio_errors_fingerprint_idx" ON "payload"."portfolio_errors" USING btree ("fingerprint");
  CREATE INDEX "portfolio_errors_last_seen_idx" ON "payload"."portfolio_errors" USING btree ("last_seen");
  CREATE INDEX "portfolio_errors_resolved_idx" ON "payload"."portfolio_errors" USING btree ("resolved");
  CREATE INDEX "portfolio_errors_updated_at_idx" ON "payload"."portfolio_errors" USING btree ("updated_at");
  CREATE INDEX "portfolio_errors_created_at_idx" ON "payload"."portfolio_errors" USING btree ("created_at");
  CREATE INDEX "portfolio_site_main_line_order_idx" ON "payload"."portfolio_site_main_line" USING btree ("_order");
  CREATE INDEX "portfolio_site_main_line_parent_id_idx" ON "payload"."portfolio_site_main_line" USING btree ("_parent_id");
  CREATE INDEX "portfolio_site_cards_stack_stickers_order_idx" ON "payload"."portfolio_site_cards_stack_stickers" USING btree ("_order");
  CREATE INDEX "portfolio_site_cards_stack_stickers_parent_id_idx" ON "payload"."portfolio_site_cards_stack_stickers" USING btree ("_parent_id");
  CREATE INDEX "portfolio_site_sky_presets_order_idx" ON "payload"."portfolio_site_sky_presets" USING btree ("_order");
  CREATE INDEX "portfolio_site_sky_presets_parent_id_idx" ON "payload"."portfolio_site_sky_presets" USING btree ("_parent_id");
  CREATE INDEX "portfolio_site_resume_resume_pdf_idx" ON "payload"."portfolio_site" USING btree ("resume_pdf_id");
  CREATE INDEX "portfolio_site_seo_seo_image_idx" ON "payload"."portfolio_site" USING btree ("seo_image_id");
  CREATE INDEX "portfolio_site_texts_order_parent" ON "payload"."portfolio_site_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_site_v_version_main_line_order_idx" ON "payload"."_portfolio_site_v_version_main_line" USING btree ("_order");
  CREATE INDEX "_portfolio_site_v_version_main_line_parent_id_idx" ON "payload"."_portfolio_site_v_version_main_line" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_site_v_version_cards_stack_stickers_order_idx" ON "payload"."_portfolio_site_v_version_cards_stack_stickers" USING btree ("_order");
  CREATE INDEX "_portfolio_site_v_version_cards_stack_stickers_parent_id_idx" ON "payload"."_portfolio_site_v_version_cards_stack_stickers" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_site_v_version_sky_presets_order_idx" ON "payload"."_portfolio_site_v_version_sky_presets" USING btree ("_order");
  CREATE INDEX "_portfolio_site_v_version_sky_presets_parent_id_idx" ON "payload"."_portfolio_site_v_version_sky_presets" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_site_v_version_resume_version_resume_pdf_idx" ON "payload"."_portfolio_site_v" USING btree ("version_resume_pdf_id");
  CREATE INDEX "_portfolio_site_v_version_seo_version_seo_image_idx" ON "payload"."_portfolio_site_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_portfolio_site_v_created_at_idx" ON "payload"."_portfolio_site_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_site_v_updated_at_idx" ON "payload"."_portfolio_site_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_site_v_texts_order_parent" ON "payload"."_portfolio_site_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_profile_v_version_now_order_idx" ON "payload"."_portfolio_profile_v_version_now" USING btree ("_order");
  CREATE INDEX "_portfolio_profile_v_version_now_parent_id_idx" ON "payload"."_portfolio_profile_v_version_now" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_profile_v_version_links_order_idx" ON "payload"."_portfolio_profile_v_version_links" USING btree ("_order");
  CREATE INDEX "_portfolio_profile_v_version_links_parent_id_idx" ON "payload"."_portfolio_profile_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_profile_v_created_at_idx" ON "payload"."_portfolio_profile_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_profile_v_updated_at_idx" ON "payload"."_portfolio_profile_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_resume_v_version_contact_order_idx" ON "payload"."_portfolio_resume_v_version_contact" USING btree ("_order");
  CREATE INDEX "_portfolio_resume_v_version_contact_parent_id_idx" ON "payload"."_portfolio_resume_v_version_contact" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_resume_v_version_skills_order_idx" ON "payload"."_portfolio_resume_v_version_skills" USING btree ("_order");
  CREATE INDEX "_portfolio_resume_v_version_skills_parent_id_idx" ON "payload"."_portfolio_resume_v_version_skills" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_resume_v_version_experience_points_order_idx" ON "payload"."_portfolio_resume_v_version_experience_points" USING btree ("_order");
  CREATE INDEX "_portfolio_resume_v_version_experience_points_parent_id_idx" ON "payload"."_portfolio_resume_v_version_experience_points" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_resume_v_version_experience_order_idx" ON "payload"."_portfolio_resume_v_version_experience" USING btree ("_order");
  CREATE INDEX "_portfolio_resume_v_version_experience_parent_id_idx" ON "payload"."_portfolio_resume_v_version_experience" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_resume_v_version_projects_points_order_idx" ON "payload"."_portfolio_resume_v_version_projects_points" USING btree ("_order");
  CREATE INDEX "_portfolio_resume_v_version_projects_points_parent_id_idx" ON "payload"."_portfolio_resume_v_version_projects_points" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_resume_v_version_projects_order_idx" ON "payload"."_portfolio_resume_v_version_projects" USING btree ("_order");
  CREATE INDEX "_portfolio_resume_v_version_projects_parent_id_idx" ON "payload"."_portfolio_resume_v_version_projects" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_resume_v_version_education_order_idx" ON "payload"."_portfolio_resume_v_version_education" USING btree ("_order");
  CREATE INDEX "_portfolio_resume_v_version_education_parent_id_idx" ON "payload"."_portfolio_resume_v_version_education" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_resume_v_created_at_idx" ON "payload"."_portfolio_resume_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_resume_v_updated_at_idx" ON "payload"."_portfolio_resume_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_resume_v_texts_order_parent" ON "payload"."_portfolio_resume_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_education_v_created_at_idx" ON "payload"."_portfolio_education_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_education_v_updated_at_idx" ON "payload"."_portfolio_education_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_contact_v_version_links_order_idx" ON "payload"."_portfolio_contact_v_version_links" USING btree ("_order");
  CREATE INDEX "_portfolio_contact_v_version_links_parent_id_idx" ON "payload"."_portfolio_contact_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_contact_v_created_at_idx" ON "payload"."_portfolio_contact_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_contact_v_updated_at_idx" ON "payload"."_portfolio_contact_v" USING btree ("updated_at");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_visits_fk" FOREIGN KEY ("portfolio_visits_id") REFERENCES "payload"."portfolio_visits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_events_fk" FOREIGN KEY ("portfolio_events_id") REFERENCES "payload"."portfolio_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_errors_fk" FOREIGN KEY ("portfolio_errors_id") REFERENCES "payload"."portfolio_errors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "portfolio_projects_hidden_idx" ON "payload"."portfolio_projects" USING btree ("hidden");
  CREATE INDEX "portfolio_roles_hidden_idx" ON "payload"."portfolio_roles" USING btree ("hidden");
  CREATE INDEX "portfolio_internships_hidden_idx" ON "payload"."portfolio_internships" USING btree ("hidden");
  CREATE INDEX "portfolio_skills_hidden_idx" ON "payload"."portfolio_skills" USING btree ("hidden");
  CREATE INDEX "portfolio_articles_hidden_idx" ON "payload"."portfolio_articles" USING btree ("hidden");
  CREATE INDEX "payload_locked_documents_rels_portfolio_visits_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_visits_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_events_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_errors_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_errors_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."_portfolio_projects_v_blocks_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_stages_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_barcode" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_projects_v_blocks_meter" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_projects_v_version_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_projects_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_roles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_roles_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_internships_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_internships_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_skills_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_skills_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_articles_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_articles_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_visits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_errors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_site_main_line" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_site_cards_stack_stickers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_site_sky_presets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_site" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."portfolio_site_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_site_v_version_main_line" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_site_v_version_cards_stack_stickers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_site_v_version_sky_presets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_site_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_site_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_profile_v_version_now" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_profile_v_version_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_profile_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_version_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_version_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_version_experience_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_version_experience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_version_projects_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_version_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_version_education" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_resume_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_education_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_contact_v_version_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_portfolio_contact_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."_portfolio_projects_v_blocks_row" CASCADE;
  DROP TABLE "payload"."_portfolio_projects_v_blocks_stages_items" CASCADE;
  DROP TABLE "payload"."_portfolio_projects_v_blocks_stages" CASCADE;
  DROP TABLE "payload"."_portfolio_projects_v_blocks_barcode" CASCADE;
  DROP TABLE "payload"."_portfolio_projects_v_blocks_meter" CASCADE;
  DROP TABLE "payload"."_portfolio_projects_v_version_links" CASCADE;
  DROP TABLE "payload"."_portfolio_projects_v" CASCADE;
  DROP TABLE "payload"."_portfolio_projects_v_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_roles_v" CASCADE;
  DROP TABLE "payload"."_portfolio_roles_v_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_internships_v" CASCADE;
  DROP TABLE "payload"."_portfolio_internships_v_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_skills_v" CASCADE;
  DROP TABLE "payload"."_portfolio_skills_v_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_articles_v" CASCADE;
  DROP TABLE "payload"."_portfolio_articles_v_texts" CASCADE;
  DROP TABLE "payload"."portfolio_visits" CASCADE;
  DROP TABLE "payload"."portfolio_events" CASCADE;
  DROP TABLE "payload"."portfolio_errors" CASCADE;
  DROP TABLE "payload"."portfolio_site_main_line" CASCADE;
  DROP TABLE "payload"."portfolio_site_cards_stack_stickers" CASCADE;
  DROP TABLE "payload"."portfolio_site_sky_presets" CASCADE;
  DROP TABLE "payload"."portfolio_site" CASCADE;
  DROP TABLE "payload"."portfolio_site_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_site_v_version_main_line" CASCADE;
  DROP TABLE "payload"."_portfolio_site_v_version_cards_stack_stickers" CASCADE;
  DROP TABLE "payload"."_portfolio_site_v_version_sky_presets" CASCADE;
  DROP TABLE "payload"."_portfolio_site_v" CASCADE;
  DROP TABLE "payload"."_portfolio_site_v_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_profile_v_version_now" CASCADE;
  DROP TABLE "payload"."_portfolio_profile_v_version_links" CASCADE;
  DROP TABLE "payload"."_portfolio_profile_v" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_version_contact" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_version_skills" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_version_experience_points" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_version_experience" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_version_projects_points" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_version_projects" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_version_education" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v" CASCADE;
  DROP TABLE "payload"."_portfolio_resume_v_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_education_v" CASCADE;
  DROP TABLE "payload"."_portfolio_contact_v_version_links" CASCADE;
  DROP TABLE "payload"."_portfolio_contact_v" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_portfolio_visits_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_portfolio_events_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_portfolio_errors_fk";
  
  DROP INDEX IF EXISTS "payload"."portfolio_projects_hidden_idx";
  DROP INDEX IF EXISTS "payload"."portfolio_roles_hidden_idx";
  DROP INDEX IF EXISTS "payload"."portfolio_internships_hidden_idx";
  DROP INDEX IF EXISTS "payload"."portfolio_skills_hidden_idx";
  DROP INDEX IF EXISTS "payload"."portfolio_articles_hidden_idx";
  DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_portfolio_visits_id_idx";
  DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_portfolio_events_id_idx";
  DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_portfolio_errors_id_idx";
  ALTER TABLE "payload"."portfolio_projects" DROP COLUMN "hidden";
  ALTER TABLE "payload"."portfolio_roles" DROP COLUMN "hidden";
  ALTER TABLE "payload"."portfolio_internships" DROP COLUMN "hidden";
  ALTER TABLE "payload"."portfolio_skills" DROP COLUMN "hidden";
  ALTER TABLE "payload"."portfolio_articles" DROP COLUMN "hidden";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_visits_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_events_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "portfolio_errors_id";
  DROP TYPE "payload"."enum__portfolio_projects_v_version_group";
  DROP TYPE "payload"."enum__portfolio_projects_v_version_color";
  DROP TYPE "payload"."enum__portfolio_roles_v_version_color";
  DROP TYPE "payload"."enum_portfolio_site_main_line_card";
  DROP TYPE "payload"."enum_portfolio_site_sky_mode";
  DROP TYPE "payload"."enum_portfolio_site_styles_default";
  DROP TYPE "payload"."enum_portfolio_site_styles_transition";
  DROP TYPE "payload"."enum__portfolio_site_v_version_main_line_card";
  DROP TYPE "payload"."enum__portfolio_site_v_version_sky_mode";
  DROP TYPE "payload"."enum__portfolio_site_v_version_styles_default";
  DROP TYPE "payload"."enum__portfolio_site_v_version_styles_transition";`)
}
