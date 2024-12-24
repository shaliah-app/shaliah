import type Peer from "peerjs";

declare global {
  interface Document {
    rtc?: Peer
  }
}