CREATE INDEX "song_sections_song_id_position_idx" ON "song_sections" USING btree ("song_id","position");--> statement-breakpoint
CREATE INDEX "songs_active_lang_created_idx" ON "songs" USING btree ("is_active","language","created_at");--> statement-breakpoint
CREATE INDEX "songs_active_lang_cat_idx" ON "songs" USING btree ("is_active","language","category");--> statement-breakpoint
CREATE INDEX "songs_language_idx" ON "songs" USING btree ("language");--> statement-breakpoint
CREATE INDEX "songs_category_idx" ON "songs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "songs_is_active_idx" ON "songs" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "streaming_links_song_id_idx" ON "streaming_links" USING btree ("song_id");