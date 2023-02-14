import { describe, test, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import Home from "@/views/Home.vue";
import SongItem from "../SongItem.vue";

describe("Home.vue", () => {
  test("rendering list of songs", () => {
    // mock data
    const songs = [{}, {}, {}];

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      // global: {
      //   mocks: {
      //     $t: (msg: any) => msg,
      //   },
      // },
    });

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, i) => {
      expect(wrapper.props("song")).toBe(songs[i]);
    });
  });
});
