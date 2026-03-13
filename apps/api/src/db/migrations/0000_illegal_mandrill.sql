DO $$ BEGIN CREATE TYPE "public"."language" AS ENUM('te', 'en', 'hi', 'ta', 'ml'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "public"."section_type" AS ENUM('pallavi', 'charnam', 'verse', 'chorus', 'bridge', 'pre-chorus', 'outro', 'interlude'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN CREATE TYPE "public"."streaming_platform" AS ENUM('youtube', 'spotify', 'apple', 'gaana', 'jiosaavn'); EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"canonical_slug" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"artist_english" text,
	"category" text NOT NULL,
	"language" "language" NOT NULL,
	"lyrics" text NOT NULL,
	"lyrics_english" text,
	"source_url" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "songs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"song_id" text NOT NULL,
	"type" "section_type" NOT NULL,
	"number" text DEFAULT '0' NOT NULL,
	"position" text DEFAULT '0' NOT NULL,
	"content" text NOT NULL,
	"content_english" text,
	"repeat_count" text,
	"ref_label" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "streaming_links" (
	"id" text PRIMARY KEY NOT NULL,
	"song_id" text NOT NULL,
	"platform" "streaming_platform" NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favourites" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"song_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favourites_session_song_unique" UNIQUE("session_id","song_id")
);
--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "song_sections" ADD CONSTRAINT "song_sections_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "songs" ADD CONSTRAINT "songs_category_categories_slug_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("slug") ON DELETE no action ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "streaming_links" ADD CONSTRAINT "streaming_links_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "favourites" ADD CONSTRAINT "favourites_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;--> statement-breakpoint
ALTER TABLE "songs" ADD COLUMN IF NOT EXISTS "artist_english" text;--> statement-breakpoint
ALTER TABLE "song_sections" ADD COLUMN IF NOT EXISTS "content_english" text;
