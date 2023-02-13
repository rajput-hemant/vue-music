import { describe, test, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import About from "@/views/About.vue";

describe("About.vue", () => {
  test("renders inner test", () => {
    // mount() will allow component to load as many child components as it wants
    // const wrapper = mount();

    // shallowMount() will limit the component to one level of child components, if child components attempt to load more child components, they will be ignored
    const wrapper = shallowMount(About);
    // this is same as above
    // const wrapper = mount(About, { shallow: true });

    expect(wrapper.text()).toContain("About");
  });
});
