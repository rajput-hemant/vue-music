import type { DirectiveBinding } from "vue";

export default {
  beforeMount(
    el: HTMLElement,
    binding: DirectiveBinding<{ icon: string; right?: boolean }>
  ) {
    let iconClass = `fa fa-${binding.value.icon} text-green-400 text-xl`;

    if (binding.value.right) {
      iconClass += " float-right";
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
