import { describe, test, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";

import Home from "@/views/Home.vue";
import SongItem from "../SongItem.vue";

vi.mock("@/includes/firebase", () => {
  return {
    auth: {
      signInWithEmailAndPassword: () => {
        return Promise.resolve({});
      },
    },
  };
});

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
      global: {
        mocks: {
          t: () => {},
          $t: () => {},
        },
      },
    });

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, i) => {
      expect(wrapper.props("song")).toBe(songs[i]);
    });
  });
});
