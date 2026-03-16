CREATE TABLE "album_songs" (
	"id" text PRIMARY KEY NOT NULL,
	"album_id" text NOT NULL,
	"song_id" text NOT NULL,
	"track_number" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "album_songs_album_song_unique" UNIQUE("album_id","song_id")
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"artist_english" text,
	"album_cover_url" text,
	"language" "language" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "albums_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "album_songs" ADD CONSTRAINT "album_songs_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_songs" ADD CONSTRAINT "album_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "album_songs_album_id_track_idx" ON "album_songs" USING btree ("album_id","track_number");--> statement-breakpoint
CREATE INDEX "album_songs_song_id_idx" ON "album_songs" USING btree ("song_id");--> statement-breakpoint
CREATE INDEX "albums_language_idx" ON "albums" USING btree ("language");--> statement-breakpoint
CREATE INDEX "albums_is_active_idx" ON "albums" USING btree ("is_active");