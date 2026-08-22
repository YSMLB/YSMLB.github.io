import { USER_CONFIG, type MusicTrack } from "./userConfig";

export function getMusicTracks(): readonly MusicTrack[] {
  return USER_CONFIG.music.tracks;
}
