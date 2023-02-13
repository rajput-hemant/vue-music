import { describe, test, expect } from "vitest";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

import SongItem from "@/components/SongItem.vue";

describe("SongItem.vue", () => {
  test("renders song.display_name", () => {
    const song = {
      display_name: "Song Name",
    };

    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      global: {
        components: {
          // here we stub the router-link component,
          // so that it doesn't render the actual router-link component,
          // but a stub component
          // stub component is a component that doesn't do anything,
          //it is used to test the component that we are testing
          "router-link": RouterLinkStub,
        },
      },
    });

    // find() method is used to select an element in the component, it is similar to document.querySelector(), it returns a wrapper object
    const compositionAuthor = wrapper.find(".text-gray-500");

    expect(compositionAuthor.text()).toContain(song.display_name);

    // Boolean assertion,
    // avoid using Boolean assertion because they are not very descriptive
    // expect(compositionAuthor.text() == song.display_name).toBe(false);
  });
});
