CREATE TABLE "artists" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"name_telugu" text,
	"avatar_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artists_slug_unique" UNIQUE("slug"),
	CONSTRAINT "artists_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "songs" ADD COLUMN "artist_id" text;--> statement-breakpoint
ALTER TABLE "albums" ADD COLUMN "artist_id" text;--> statement-breakpoint
CREATE INDEX "artists_is_active_idx" ON "artists" USING btree ("is_active");--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
-- Backfill: insert unique artists from songs where English name is known
INSERT INTO artists (id, slug, name, name_telugu, is_active, created_at, updated_at)
SELECT DISTINCT ON (artist_english)
  gen_random_uuid()::text,
  lower(regexp_replace(artist_english, '[^a-zA-Z0-9]+', '-', 'g')),
  artist_english,
  artist,
  true, now(), now()
FROM songs
WHERE artist_english IS NOT NULL AND artist_english <> ''
ON CONFLICT (name) DO NOTHING;
--> statement-breakpoint
-- Also capture any album artists not yet in the table
INSERT INTO artists (id, slug, name, name_telugu, is_active, created_at, updated_at)
SELECT DISTINCT ON (artist_english)
  gen_random_uuid()::text,
  lower(regexp_replace(artist_english, '[^a-zA-Z0-9]+', '-', 'g')),
  artist_english,
  artist,
  true, now(), now()
FROM albums
WHERE artist_english IS NOT NULL AND artist_english <> ''
  AND artist_english NOT IN (SELECT name FROM artists)
ON CONFLICT (name) DO NOTHING;
--> statement-breakpoint
-- Wire up artist_id FKs from old text columns
UPDATE songs SET artist_id = a.id FROM artists a WHERE a.name = songs.artist_english;
--> statement-breakpoint
UPDATE albums SET artist_id = a.id FROM artists a WHERE a.name = albums.artist_english;
--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "artist";--> statement-breakpoint
ALTER TABLE "songs" DROP COLUMN "artist_english";--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN "artist";--> statement-breakpoint
ALTER TABLE "albums" DROP COLUMN "artist_english";