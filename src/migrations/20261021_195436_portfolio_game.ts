import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."portfolio_game_species" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"no" numeric,
  	"name" varchar,
  	"kind" varchar,
  	"happy" varchar,
  	"entry" varchar
  );
  
  CREATE TABLE "payload"."portfolio_game_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"color" varchar
  );
  
  CREATE TABLE "payload"."portfolio_game_trainers_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_game_trainers_again" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_game_trainers_rounds_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" varchar,
  	"ok" boolean,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_game_trainers_rounds" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"move" varchar,
  	"type" varchar,
  	"ready" varchar,
  	"hit" varchar,
  	"hint" varchar
  );
  
  CREATE TABLE "payload"."portfolio_game_trainers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"name" varchar,
  	"title" varchar,
  	"exp" numeric,
  	"off" boolean DEFAULT false,
  	"mon_species" varchar NOT NULL,
  	"mon_name" varchar,
  	"mon_level" numeric NOT NULL,
  	"win" varchar,
  	"lose" varchar
  );
  
  CREATE TABLE "payload"."portfolio_game_nurse_greet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_game_nurse_wake" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_game_bugs_moves" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" varchar,
  	"ok" boolean,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."portfolio_game_bugs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"name" varchar,
  	"attack" varchar,
  	"type" varchar,
  	"level" numeric,
  	"off" boolean DEFAULT false,
  	"intro" varchar,
  	"hint" varchar,
  	"win" varchar,
  	"lesson" varchar
  );
  
  CREATE TABLE "payload"."portfolio_game" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_subtitle" varchar DEFAULT 'Backend Version',
  	"title_tagline" varchar DEFAULT 'There''s no place like 127.0.0.1',
  	"title_blurb" varchar DEFAULT '{first}''s portfolio is a tiny island. Befriend the projects, battle bugs and rivals, and help Moss the water bear grow.',
  	"moss_name" varchar DEFAULT 'Moss',
  	"exp_friend" numeric DEFAULT 120,
  	"exp_fix" numeric DEFAULT 160,
  	"nurse_name" varchar DEFAULT 'Nurse Heartbeat',
  	"nurse_healed" varchar DEFAULT 'All vitals green. {moss} is back to full HP!',
  	"nurse_full" varchar DEFAULT '{moss} is already in perfect health. Come back anytime!',
  	"strings_meet" varchar DEFAULT '{name} pinged you from port {port}!',
  	"strings_meet_bug" varchar DEFAULT '{name} crawled out of the logs!',
  	"strings_challenge" varchar DEFAULT '{title} {trainer} challenges you to a code review!',
  	"strings_send_out" varchar DEFAULT '{trainer} sent in {name}!',
  	"strings_moss_in" varchar DEFAULT '{moss}, you''re up!',
  	"strings_prompt" varchar DEFAULT '{moss} is ready. Your call.',
  	"strings_packet_prompt" varchar DEFAULT 'Which packet does {moss} send?',
  	"strings_inspect" varchar DEFAULT '{species}, the {kind}. {entry}',
  	"strings_ping" varchar DEFAULT '64 bytes from {name}: time={ms} ms.',
  	"strings_pick_fix" varchar DEFAULT 'Which fix does {moss} try?',
  	"strings_pick_counter" varchar DEFAULT 'How does {moss} answer {move}?',
  	"strings_tries" varchar DEFAULT '{moss} tries: {move}.',
  	"strings_root_cause" varchar DEFAULT 'Root cause found!',
  	"strings_no_effect" varchar DEFAULT 'That didn''t touch the root cause.',
  	"strings_hits_back" varchar DEFAULT '{name} hits back with {move}!',
  	"strings_lands" varchar DEFAULT '{move} lands!',
  	"strings_patched" varchar DEFAULT '{name} is patched!',
  	"strings_out_of_steam" varchar DEFAULT '{name} ran out of steam!',
  	"strings_moss_down" varchar DEFAULT '{moss} took too many hits and curled into a tun!',
  	"strings_exp" varchar DEFAULT '{moss} gained {n} EXP.',
  	"strings_level_up" varchar DEFAULT '{moss} reached Lv {n}!',
  	"strings_run" varchar DEFAULT '{moss} tiptoed away.',
  	"strings_back_off" varchar DEFAULT '{moss} backed off. The bug is still out there.',
  	"strings_no_run" varchar DEFAULT 'No running from a code review!',
  	"strings_crew_none" varchar DEFAULT 'Nobody in your crew yet. Say hi to a project first.',
  	"strings_crew_assist" varchar DEFAULT '{name} sniffs out a bad idea: {move} is crossed out.',
  	"strings_crew_nothing" varchar DEFAULT '{name} looks around. There''s nothing left to rule out.',
  	"strings_crew_tired" varchar DEFAULT 'Your whole crew has already pitched in this time.',
  	"strings_crew_guard" varchar DEFAULT '{name} flashes red and points at the answer!',
  	"strings_syn_first_ack" varchar DEFAULT 'ACK? There''s nothing to acknowledge yet. {name} tilts its head.',
  	"strings_syn_first_fin" varchar DEFAULT 'FIN already? You only just met. Start with a hello.',
  	"strings_syn_first_rst" varchar DEFAULT 'RST? That hangs up before you even say hi.',
  	"strings_syn" varchar DEFAULT '{moss} sends a SYN: hi, can we talk?',
  	"strings_lost" varchar DEFAULT '{name} answers... and the reply gets lost on the way.',
  	"strings_retry" varchar DEFAULT '{name} notices nothing arrived and retries. Delivering things is its whole job.',
  	"strings_syn_ack" varchar DEFAULT '{name} answers with a SYN-ACK: hi, I hear you. Your move.',
  	"strings_ack_syn" varchar DEFAULT 'You already sent a SYN. Now acknowledge theirs.',
  	"strings_ack_rst" varchar DEFAULT 'RST! That hangs up on {name}. Try something friendlier.',
  	"strings_ack_fin" varchar DEFAULT 'FIN? You haven''t even connected yet.',
  	"strings_ack" varchar DEFAULT '{moss} sends an ACK: great, I hear you too.',
  	"strings_connected" varchar DEFAULT 'Connected on port {port}! {name} joined your crew and will follow {moss} around.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."portfolio_game_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_species" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"no" numeric,
  	"name" varchar,
  	"kind" varchar,
  	"happy" varchar,
  	"entry" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_trainers_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_trainers_again" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_trainers_rounds_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" varchar,
  	"ok" boolean,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_trainers_rounds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"move" varchar,
  	"type" varchar,
  	"ready" varchar,
  	"hit" varchar,
  	"hint" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_trainers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"name" varchar,
  	"title" varchar,
  	"exp" numeric,
  	"off" boolean DEFAULT false,
  	"mon_species" varchar NOT NULL,
  	"mon_name" varchar,
  	"mon_level" numeric NOT NULL,
  	"win" varchar,
  	"lose" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_nurse_greet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_nurse_wake" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_bugs_moves" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" varchar,
  	"ok" boolean,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_version_bugs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"name" varchar,
  	"attack" varchar,
  	"type" varchar,
  	"level" numeric,
  	"off" boolean DEFAULT false,
  	"intro" varchar,
  	"hint" varchar,
  	"win" varchar,
  	"lesson" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_game_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title_subtitle" varchar DEFAULT 'Backend Version',
  	"version_title_tagline" varchar DEFAULT 'There''s no place like 127.0.0.1',
  	"version_title_blurb" varchar DEFAULT '{first}''s portfolio is a tiny island. Befriend the projects, battle bugs and rivals, and help Moss the water bear grow.',
  	"version_moss_name" varchar DEFAULT 'Moss',
  	"version_exp_friend" numeric DEFAULT 120,
  	"version_exp_fix" numeric DEFAULT 160,
  	"version_nurse_name" varchar DEFAULT 'Nurse Heartbeat',
  	"version_nurse_healed" varchar DEFAULT 'All vitals green. {moss} is back to full HP!',
  	"version_nurse_full" varchar DEFAULT '{moss} is already in perfect health. Come back anytime!',
  	"version_strings_meet" varchar DEFAULT '{name} pinged you from port {port}!',
  	"version_strings_meet_bug" varchar DEFAULT '{name} crawled out of the logs!',
  	"version_strings_challenge" varchar DEFAULT '{title} {trainer} challenges you to a code review!',
  	"version_strings_send_out" varchar DEFAULT '{trainer} sent in {name}!',
  	"version_strings_moss_in" varchar DEFAULT '{moss}, you''re up!',
  	"version_strings_prompt" varchar DEFAULT '{moss} is ready. Your call.',
  	"version_strings_packet_prompt" varchar DEFAULT 'Which packet does {moss} send?',
  	"version_strings_inspect" varchar DEFAULT '{species}, the {kind}. {entry}',
  	"version_strings_ping" varchar DEFAULT '64 bytes from {name}: time={ms} ms.',
  	"version_strings_pick_fix" varchar DEFAULT 'Which fix does {moss} try?',
  	"version_strings_pick_counter" varchar DEFAULT 'How does {moss} answer {move}?',
  	"version_strings_tries" varchar DEFAULT '{moss} tries: {move}.',
  	"version_strings_root_cause" varchar DEFAULT 'Root cause found!',
  	"version_strings_no_effect" varchar DEFAULT 'That didn''t touch the root cause.',
  	"version_strings_hits_back" varchar DEFAULT '{name} hits back with {move}!',
  	"version_strings_lands" varchar DEFAULT '{move} lands!',
  	"version_strings_patched" varchar DEFAULT '{name} is patched!',
  	"version_strings_out_of_steam" varchar DEFAULT '{name} ran out of steam!',
  	"version_strings_moss_down" varchar DEFAULT '{moss} took too many hits and curled into a tun!',
  	"version_strings_exp" varchar DEFAULT '{moss} gained {n} EXP.',
  	"version_strings_level_up" varchar DEFAULT '{moss} reached Lv {n}!',
  	"version_strings_run" varchar DEFAULT '{moss} tiptoed away.',
  	"version_strings_back_off" varchar DEFAULT '{moss} backed off. The bug is still out there.',
  	"version_strings_no_run" varchar DEFAULT 'No running from a code review!',
  	"version_strings_crew_none" varchar DEFAULT 'Nobody in your crew yet. Say hi to a project first.',
  	"version_strings_crew_assist" varchar DEFAULT '{name} sniffs out a bad idea: {move} is crossed out.',
  	"version_strings_crew_nothing" varchar DEFAULT '{name} looks around. There''s nothing left to rule out.',
  	"version_strings_crew_tired" varchar DEFAULT 'Your whole crew has already pitched in this time.',
  	"version_strings_crew_guard" varchar DEFAULT '{name} flashes red and points at the answer!',
  	"version_strings_syn_first_ack" varchar DEFAULT 'ACK? There''s nothing to acknowledge yet. {name} tilts its head.',
  	"version_strings_syn_first_fin" varchar DEFAULT 'FIN already? You only just met. Start with a hello.',
  	"version_strings_syn_first_rst" varchar DEFAULT 'RST? That hangs up before you even say hi.',
  	"version_strings_syn" varchar DEFAULT '{moss} sends a SYN: hi, can we talk?',
  	"version_strings_lost" varchar DEFAULT '{name} answers... and the reply gets lost on the way.',
  	"version_strings_retry" varchar DEFAULT '{name} notices nothing arrived and retries. Delivering things is its whole job.',
  	"version_strings_syn_ack" varchar DEFAULT '{name} answers with a SYN-ACK: hi, I hear you. Your move.',
  	"version_strings_ack_syn" varchar DEFAULT 'You already sent a SYN. Now acknowledge theirs.',
  	"version_strings_ack_rst" varchar DEFAULT 'RST! That hangs up on {name}. Try something friendlier.',
  	"version_strings_ack_fin" varchar DEFAULT 'FIN? You haven''t even connected yet.',
  	"version_strings_ack" varchar DEFAULT '{moss} sends an ACK: great, I hear you too.',
  	"version_strings_connected" varchar DEFAULT 'Connected on port {port}! {name} joined your crew and will follow {moss} around.',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."_portfolio_game_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload"."portfolio_game_species" ADD CONSTRAINT "portfolio_game_species_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_types" ADD CONSTRAINT "portfolio_game_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_trainers_intro" ADD CONSTRAINT "portfolio_game_trainers_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game_trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_trainers_again" ADD CONSTRAINT "portfolio_game_trainers_again_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game_trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_trainers_rounds_options" ADD CONSTRAINT "portfolio_game_trainers_rounds_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game_trainers_rounds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_trainers_rounds" ADD CONSTRAINT "portfolio_game_trainers_rounds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game_trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_trainers" ADD CONSTRAINT "portfolio_game_trainers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_nurse_greet" ADD CONSTRAINT "portfolio_game_nurse_greet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_nurse_wake" ADD CONSTRAINT "portfolio_game_nurse_wake_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_bugs_moves" ADD CONSTRAINT "portfolio_game_bugs_moves_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game_bugs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_bugs" ADD CONSTRAINT "portfolio_game_bugs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_game"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_game_texts" ADD CONSTRAINT "portfolio_game_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_game"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_species" ADD CONSTRAINT "_portfolio_game_v_version_species_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_types" ADD CONSTRAINT "_portfolio_game_v_version_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_trainers_intro" ADD CONSTRAINT "_portfolio_game_v_version_trainers_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v_version_trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_trainers_again" ADD CONSTRAINT "_portfolio_game_v_version_trainers_again_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v_version_trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_trainers_rounds_options" ADD CONSTRAINT "_portfolio_game_v_version_trainers_rounds_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v_version_trainers_rounds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_trainers_rounds" ADD CONSTRAINT "_portfolio_game_v_version_trainers_rounds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v_version_trainers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_trainers" ADD CONSTRAINT "_portfolio_game_v_version_trainers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_nurse_greet" ADD CONSTRAINT "_portfolio_game_v_version_nurse_greet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_nurse_wake" ADD CONSTRAINT "_portfolio_game_v_version_nurse_wake_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_bugs_moves" ADD CONSTRAINT "_portfolio_game_v_version_bugs_moves_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v_version_bugs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_version_bugs" ADD CONSTRAINT "_portfolio_game_v_version_bugs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_game_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_game_v_texts" ADD CONSTRAINT "_portfolio_game_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_portfolio_game_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "portfolio_game_species_order_idx" ON "payload"."portfolio_game_species" USING btree ("_order");
  CREATE INDEX "portfolio_game_species_parent_id_idx" ON "payload"."portfolio_game_species" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_types_order_idx" ON "payload"."portfolio_game_types" USING btree ("_order");
  CREATE INDEX "portfolio_game_types_parent_id_idx" ON "payload"."portfolio_game_types" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_trainers_intro_order_idx" ON "payload"."portfolio_game_trainers_intro" USING btree ("_order");
  CREATE INDEX "portfolio_game_trainers_intro_parent_id_idx" ON "payload"."portfolio_game_trainers_intro" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_trainers_again_order_idx" ON "payload"."portfolio_game_trainers_again" USING btree ("_order");
  CREATE INDEX "portfolio_game_trainers_again_parent_id_idx" ON "payload"."portfolio_game_trainers_again" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_trainers_rounds_options_order_idx" ON "payload"."portfolio_game_trainers_rounds_options" USING btree ("_order");
  CREATE INDEX "portfolio_game_trainers_rounds_options_parent_id_idx" ON "payload"."portfolio_game_trainers_rounds_options" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_trainers_rounds_order_idx" ON "payload"."portfolio_game_trainers_rounds" USING btree ("_order");
  CREATE INDEX "portfolio_game_trainers_rounds_parent_id_idx" ON "payload"."portfolio_game_trainers_rounds" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_trainers_order_idx" ON "payload"."portfolio_game_trainers" USING btree ("_order");
  CREATE INDEX "portfolio_game_trainers_parent_id_idx" ON "payload"."portfolio_game_trainers" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_nurse_greet_order_idx" ON "payload"."portfolio_game_nurse_greet" USING btree ("_order");
  CREATE INDEX "portfolio_game_nurse_greet_parent_id_idx" ON "payload"."portfolio_game_nurse_greet" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_nurse_wake_order_idx" ON "payload"."portfolio_game_nurse_wake" USING btree ("_order");
  CREATE INDEX "portfolio_game_nurse_wake_parent_id_idx" ON "payload"."portfolio_game_nurse_wake" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_bugs_moves_order_idx" ON "payload"."portfolio_game_bugs_moves" USING btree ("_order");
  CREATE INDEX "portfolio_game_bugs_moves_parent_id_idx" ON "payload"."portfolio_game_bugs_moves" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_bugs_order_idx" ON "payload"."portfolio_game_bugs" USING btree ("_order");
  CREATE INDEX "portfolio_game_bugs_parent_id_idx" ON "payload"."portfolio_game_bugs" USING btree ("_parent_id");
  CREATE INDEX "portfolio_game_texts_order_parent" ON "payload"."portfolio_game_texts" USING btree ("order","parent_id");
  CREATE INDEX "_portfolio_game_v_version_species_order_idx" ON "payload"."_portfolio_game_v_version_species" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_species_parent_id_idx" ON "payload"."_portfolio_game_v_version_species" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_types_order_idx" ON "payload"."_portfolio_game_v_version_types" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_types_parent_id_idx" ON "payload"."_portfolio_game_v_version_types" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_trainers_intro_order_idx" ON "payload"."_portfolio_game_v_version_trainers_intro" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_trainers_intro_parent_id_idx" ON "payload"."_portfolio_game_v_version_trainers_intro" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_trainers_again_order_idx" ON "payload"."_portfolio_game_v_version_trainers_again" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_trainers_again_parent_id_idx" ON "payload"."_portfolio_game_v_version_trainers_again" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_trainers_rounds_options_order_idx" ON "payload"."_portfolio_game_v_version_trainers_rounds_options" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_trainers_rounds_options_parent_id_idx" ON "payload"."_portfolio_game_v_version_trainers_rounds_options" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_trainers_rounds_order_idx" ON "payload"."_portfolio_game_v_version_trainers_rounds" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_trainers_rounds_parent_id_idx" ON "payload"."_portfolio_game_v_version_trainers_rounds" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_trainers_order_idx" ON "payload"."_portfolio_game_v_version_trainers" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_trainers_parent_id_idx" ON "payload"."_portfolio_game_v_version_trainers" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_nurse_greet_order_idx" ON "payload"."_portfolio_game_v_version_nurse_greet" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_nurse_greet_parent_id_idx" ON "payload"."_portfolio_game_v_version_nurse_greet" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_nurse_wake_order_idx" ON "payload"."_portfolio_game_v_version_nurse_wake" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_nurse_wake_parent_id_idx" ON "payload"."_portfolio_game_v_version_nurse_wake" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_bugs_moves_order_idx" ON "payload"."_portfolio_game_v_version_bugs_moves" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_bugs_moves_parent_id_idx" ON "payload"."_portfolio_game_v_version_bugs_moves" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_version_bugs_order_idx" ON "payload"."_portfolio_game_v_version_bugs" USING btree ("_order");
  CREATE INDEX "_portfolio_game_v_version_bugs_parent_id_idx" ON "payload"."_portfolio_game_v_version_bugs" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_game_v_created_at_idx" ON "payload"."_portfolio_game_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_game_v_updated_at_idx" ON "payload"."_portfolio_game_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_game_v_texts_order_parent" ON "payload"."_portfolio_game_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."portfolio_game_species" CASCADE;
  DROP TABLE "payload"."portfolio_game_types" CASCADE;
  DROP TABLE "payload"."portfolio_game_trainers_intro" CASCADE;
  DROP TABLE "payload"."portfolio_game_trainers_again" CASCADE;
  DROP TABLE "payload"."portfolio_game_trainers_rounds_options" CASCADE;
  DROP TABLE "payload"."portfolio_game_trainers_rounds" CASCADE;
  DROP TABLE "payload"."portfolio_game_trainers" CASCADE;
  DROP TABLE "payload"."portfolio_game_nurse_greet" CASCADE;
  DROP TABLE "payload"."portfolio_game_nurse_wake" CASCADE;
  DROP TABLE "payload"."portfolio_game_bugs_moves" CASCADE;
  DROP TABLE "payload"."portfolio_game_bugs" CASCADE;
  DROP TABLE "payload"."portfolio_game" CASCADE;
  DROP TABLE "payload"."portfolio_game_texts" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_species" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_types" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_trainers_intro" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_trainers_again" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_trainers_rounds_options" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_trainers_rounds" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_trainers" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_nurse_greet" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_nurse_wake" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_bugs_moves" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_version_bugs" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v" CASCADE;
  DROP TABLE "payload"."_portfolio_game_v_texts" CASCADE;`)
}
