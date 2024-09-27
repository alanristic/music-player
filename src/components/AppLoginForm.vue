<template>
  <!-- Alert MSG-->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="log_show_alert"
    :class="log_alert_variant"
  >
    {{ log_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="log_in_submission"
    >
      {{ log_btn_cta }}
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from 'pinia' // we import Pinia stores ability
import useUserStore from '@/stores/user' // we import USER store

export default {
  name: 'AppLoginForm',
  data() {
    return {
      // login FORM validation schema
      loginSchema: {
        email: 'required|min:2|max:100|email',
        password: 'required|min:9|max:100|excluded:password'
      },
      // Login data
      log_in_submission: false,
      log_show_alert: false,
      log_alert_variant: 'bg-blue-500',
      log_btn_cta: `Login now`,
      log_btn_default_msg: `Login now`,
      log_btn_submission_msg: `We're loggin you in...`
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      loginUser: 'login'
    }),
    // LOGIN method
    async login(values) {
      this.log_in_submission = true
      this.log_btn_cta = this.log_btn_submission_msg // feedback to user we're loggin them in

      // Show alert
      this.log_show_alert = true // toggles alert visibility
      this.log_alert_variant = 'bg-blue-500'
      this.log_alert_msg = `Please wait! We're logging you in...`

      try {
        await this.loginUser(values) //call Action from Store (aka 'Dispatch')
      } catch (errors) {
        this.log_in_submission = false
        this.log_btn_cta = this.log_btn_default_msg
        this.log_alert_variant = 'bg-red-500'
        this.log_alert_msg = 'Invalid login details.'
        return // NOTE: this STOPS execution
      }

      // dummy dataa
      this.log_alert_variant = 'bg-green-500'
      this.log_alert_msg = `Success! You've been successfuly logged-in.`
      this.log_btn_cta = 'All good!'

      // Reload window after successful login
      window.location.reload()
    }
  }
}
</script>
