import type { DocumentHead } from "@builder.io/qwik-city";
import {
  $,
  component$,
  useOnDocument,
  useSignal,
  useStyles$,
} from "@builder.io/qwik";
import { css } from "~/utils/css";
import { Monitor } from "~/components/ui/monitor";
import { Slides } from "~/components/ui/slides";
import Peer from "peerjs";
import { Button } from "~/components/ui/button";

export default component$(() => {
  useStyles$(css`
    main {
      width: 100svw;
      height: 100svh;
      padding: 1rem;

      display: grid;
      grid-template-columns: 100%;

      overflow: hidden;
      z-index: 1;
      position: relative;
    }
  `);

  const peerId = useSignal<string>();

    useOnDocument("DOMContentLoaded", $(e => {
      const doc = e.target as Document
      doc.rtc = new Peer({
        host: "localhost",
        port: 9000
      })

      document.rtc!.on("connection", (conn) => {
        conn.on("data", (data) => {
          // Will print 'hi!'
          console.log(data);
        });
        conn.on("open", () => {
          conn.send("hello!");
        });
      });
    }))

  const connect = $(async () => {
    const conn = await document.rtc!.connect(peerId.value!);

    conn.on("open", () => {
      conn.send("hi!");
    });
    
  })

  return (
    <main>
      <input type="text" bind:value={peerId} />
      <Button onClick$={connect}>Connect</Button>

      <Monitor />

      <Slides.Carousel />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Shaliah",
  meta: [
    {
      name: "description",
      content: "Presentation controller for churches",
    },
  ],
};
