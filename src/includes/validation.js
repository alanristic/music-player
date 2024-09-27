import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
import {
  required,
  min,
  max,
  alpha_spaces as AlphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
  alpha_spaces,
  min_value
} from '@vee-validate/rules'

export default {
  // called upon registration in vue app
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    // Second argumens is fnc. If it returns 'string' validation fails
    defineRule('required', required) // we are using predefined function 'required', but could use or define our own
    defineRule('tos_required', required) // we are using predefined function 'required', but could use or define our own
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', AlphaSpaces)
    defineRule('email', email)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('pwd_mismatch', confirmed)
    defineRule('excluded', excluded)
    defineRule('country_excluded', excluded)

    // WE're overriding configuration object of how vee-validate behaves
    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} may only contain alphanumeric characters and spaces.`,
          email: `The field ${ctx.field} must be a valid email.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          country_excluded: `Due to restrictions, we don't accept users from this location.`,
          pwd_mismatch: `Passwords do not match.`,
          tos_required: `Accepting TOS is required.`
        }

        // We assign our message if error exists, if not, we outpout default one
        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`

        return message
      },
      validateOnBlur: true, // validation when we leave the field
      validateOnChange: true,
      validateOnInput: false, // validation on keypress
      validateOnModelUpdate: true
    })
  }
}
