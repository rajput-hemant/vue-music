import { defineStore } from "pinia";

import { auth, usersCollection } from "@/includes/firebase";

export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(userData: { [key: string]: string }) {
      const userCreds = await auth.createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );

      await usersCollection.doc(userCreds.user!.uid).set({
        name: userData.name,
        email: userData.email,
        age: userData.age,
        country: userData.country,
      });

      await userCreds.user!.updateProfile({
        displayName: userData.name,
      });

      this.userLoggedIn = true;
    },
  },
});
