import type { App } from "vue";
import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as exclude,
} from "@vee-validate/rules";

export default {
  install(app: App<Element>) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("password_mismatch", confirmed);
    defineRule("exclude", exclude);
    defineRule("country_excluded", exclude);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required`,
          email: `The field ${ctx.field} is not valid`,
          min: `The field ${ctx.field} is too short`,
          max: `The field ${ctx.field} is too long`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetic characters and spaces`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          exclude: `You are not allowed to use this value for the field ${ctx.field}`,
          country_excluded: `Due to legal reasons, we cannot accept users from your country.`,
          password_mismatch: `The passwords do not match`,
          tos: `You must accept the terms and conditions`,
        };

        const message = messages[ctx.rule?.name as keyof typeof messages]
          ? messages[ctx.rule?.name as keyof typeof messages]
          : `The ${ctx.field} field is not valid`;

        return message;
      },
      // These are the default values
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
