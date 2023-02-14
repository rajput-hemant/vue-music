import { describe, beforeEach, test, expect, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";

import useUserStore from "@/stores/user";

vi.mock("@/includes/firebase", () => {
  return {
    auth: {
      signInWithEmailAndPassword: () => {
        return Promise.resolve({});
      },
    },
  };
});

describe("User Store (Pinia)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("authenticates user", async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true);

    await store.authenticate({});
    expect(store.userLoggedIn).toBe(true);
  });
});
