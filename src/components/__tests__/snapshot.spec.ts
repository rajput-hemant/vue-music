import { describe, test, expect } from "vitest";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import SongItem from "../SongItem.vue";

describe("Snapshots SongItem.vue", () => {
  test("renders correctly", () => {
    const song = {
      id: "abc",
      modified_name: "test",
      display_name: "test",
      comment_count: 0,
    };

    const wrapper = shallowMount(SongItem as any, {
      props: { song },
      global: {
        components: {
          "router-link": RouterLinkStub,
        },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
