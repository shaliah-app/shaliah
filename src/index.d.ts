interface AudioTrackList {
  length: number;
  onaddtrack?: (event: TrackEvent) => void;
  onremovetrack?: (event: TrackEvent) => void;
  getTrackById(id: string): AudioTrack | null;
}

interface AudioTrack {
  id: string;
  label: string;
  language: string;
  enabled: boolean;
}

interface TrackEvent {
  track: AudioTrack;
}

interface HTMLVideoElement {
  audioTracks?: AudioTrackList;
  mozHasAudio?: boolean; // Firefox
  webkitAudioDecodedByteCount?: number; // WebKit browsers
}
