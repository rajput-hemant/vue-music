import { RouterLinkStub, shallowMount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";

import SongItem from "../SongItem.vue";

describe("Router", () => {
  test("renders router link", () => {
    const song = {
      id: "abc",
    };

    const wrapper = shallowMount(SongItem as any, {
      props: {
        song,
      },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: "song",
      params: { id: song.id },
    });
  });
});
