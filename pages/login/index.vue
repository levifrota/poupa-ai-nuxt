<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 id="login-heading" class="text-2xl font-bold mb-6">{{ t('login_title') }}</h1>
    <form class="loginOptions w-full max-w-xs" @submit.prevent="handleLogin" aria-labelledby="login-heading">

      <div v-if="formError" role="alert" class="form-error-alert bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {{ formError }}
      </div>

      <div class="inputDiv w-full">
        <label for="email" class="sr-only">{{ t('email_label') }}</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="bg-white input-placeholder text-black p-2 border rounded-md mb-1 w-full"
          :class="{'border-red-500': !!emailError}"
          :placeholder="t('email_placeholder')"
          required
          aria-required="true"
          :aria-invalid="!!emailError"
          :aria-describedby="emailError ? 'email-login-error' : undefined"
        />
        <p v-if="emailError" id="email-login-error" class="error-message text-red-600 text-sm mb-2">{{ emailError }}</p>

        <label for="password" class="sr-only">{{ t('password_label') }}</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="bg-white input-placeholder text-black p-2 border rounded-md mb-1 w-full"
          :class="{'border-red-500': !!passwordError}"
          :placeholder="t('password_placeholder')"
          required
          aria-required="true"
          :aria-invalid="!!passwordError"
          :aria-describedby="passwordError ? 'password-login-error' : undefined"
        />
        <p v-if="passwordError" id="password-login-error" class="error-message text-red-600 text-sm mb-3">{{ passwordError }}</p>
      </div>
      <button type="submit" class="buttonOptions w-full">{{ t('login_button') }}</button>
    </form>

    <div class="loginOptions mt-6 w-full max-w-xs">
      <button class="buttonGoogle w-full mb-3" @click="googleAuth">{{ t('login_with_google_button') }}</button>
      <p class="text-sm text-center my-2">{{ t('or_separator') }}</p>
      <button class="buttonOptions w-full" @click="cadastrar">{{ t('register_button_login_page') }}</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useFirebaseApp } from 'vuefire';
  import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
  import { useI18n } from '#imports';

  const { t } = useI18n();
  const email = ref('');
  const password = ref('');
  const router = useRouter();

  const emailError = ref('');
  const passwordError = ref('');
  const formError = ref('');

  const googleAuth = async () => {
    // Reset errors
    emailError.value = '';
    passwordError.value = '';
    formError.value = '';
    try {
      const app = useFirebaseApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(t('welcome_message', { name: user.displayName || t('user_fallback_name') })); // Success alert can remain for now or be refactored later
      router.push('/');
    } catch (error) {
      console.error(t('google_login_error_console'), error);
      formError.value = t('google_login_error_alert');
    }
  };

  const cadastrar = () => {
    router.push('/register');
  };

  const validateForm = () => {
    let isValid = true;
    emailError.value = '';
    passwordError.value = '';
    formError.value = '';

    if (!email.value.trim()) {
      emailError.value = t('error_email_required'); // Using existing key from register
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      emailError.value = t('error_email_invalid'); // Using existing key
      isValid = false;
    }
    if (!password.value) {
      passwordError.value = t('error_password_required'); // Using existing key
      isValid = false;
    }
    return isValid;
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const app = useFirebaseApp();
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
      alert(t('welcome_message', { name: user.displayName || t('user_fallback_name') })); // Success alert can remain
      router.push('/');
    } catch (error) {
      console.error(t('login_error_console'), error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        passwordError.value = t('wrong_password_alert');
      } else if (error.code === 'auth/user-not-found') {
        emailError.value = t('user_not_found_alert');
      } else if (error.code === 'auth/invalid-email') {
        emailError.value = t('error_email_invalid');
      }
      else {
        formError.value = t('login_error_alert_generic', { message: error.message });
      }
    }
  };
</script>

<style>
/* Styles from previous pass, slightly adjusted for error message spacing if needed */
.input-placeholder::placeholder {
  color: gray;
  opacity: 0.7;
}
button {
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
}
input[type="email"], input[type="password"] {
  padding: 10px;
  border-radius: 8px;
  /* margin-bottom: 10px; */ /* Adjusted due to error message taking space */
  border: 1px solid #ccc;
}
.loginOptions {
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
}
.inputDiv {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.buttonGoogle {
  background-color: #DB4437;
  color: white;
  border: none;
}
.buttonOptions {
  background-color: #007bff;
  color: white;
   border: none;
}
.error-message {
  /* color: #dc3545; */ /* Handled by Tailwind text-red-600 */
  /* font-size: 0.875em; */ /* Handled by Tailwind text-sm */
}
.form-error-alert {
  /* Styles for general form error at the top */
}
</style>
