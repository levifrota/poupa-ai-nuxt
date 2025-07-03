<template>
  <div class="main-container flex flex-col items-center justify-center min-h-screen p-4">
    <h1 id="register-heading" class="text-2xl font-bold mb-6">{{ t('register_title') }}</h1>
    <form class="form-container w-full max-w-md" @submit.prevent="handleRegister" aria-labelledby="register-heading">

      <div v-if="formError" role="alert" class="form-error-alert bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {{ formError }}
      </div>

      <div class="input-group mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ t('name_label') }}</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="input-field w-full p-2 border rounded-md"
          :placeholder="t('name_placeholder')"
          required
          aria-required="true"
          :aria-invalid="!!nameError"
          :aria-describedby="nameError ? 'name-error' : undefined"
        />
        <p v-if="nameError" id="name-error" class="error-message text-red-600 text-sm mt-1">{{ nameError }}</p>
      </div>

      <div class="input-group mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ t('email_label') }}</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="input-field w-full p-2 border rounded-md"
          :placeholder="t('email_placeholder')"
          required
          aria-required="true"
          :aria-invalid="!!emailError"
          :aria-describedby="emailError ? 'email-error' : undefined"
        />
        <p v-if="emailError" id="email-error" class="error-message text-red-600 text-sm mt-1">{{ emailError }}</p>
      </div>

      <div class="input-group mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ t('password_label') }}</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="input-field w-full p-2 border rounded-md"
          :placeholder="t('password_placeholder')"
          required
          aria-required="true"
          :aria-invalid="!!passwordError"
          :aria-describedby="passwordError ? 'password-error' : undefined"
        />
        <p v-if="passwordError" id="password-error" class="error-message text-red-600 text-sm mt-1">{{ passwordError }}</p>
      </div>

      <div class="button-group flex flex-col gap-3">
        <button type="submit" class="button-primary w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
          {{ t('confirm_button') }}
        </button>
        <button type="button" @click="onBackButton" class="button-secondary w-full p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold">
          {{ t('return_to_login_button') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFirebaseApp } from 'vuefire';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useI18n } from '#imports';

const { t } = useI18n();

const name = ref('');
const email = ref('');
const password = ref('');

const nameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const formError = ref(''); // For general form errors (e.g., Firebase errors)

const router = useRouter();
const app = useFirebaseApp(); // Ensure useFirebaseApp is correctly imported and used if needed globally or configured.
const auth = getAuth(app);

const validateForm = () => {
  let isValid = true;
  nameError.value = '';
  emailError.value = '';
  passwordError.value = '';
  formError.value = '';

  if (!name.value.trim()) {
    nameError.value = t('error_name_required');
    isValid = false;
  }
  if (!email.value.trim()) {
    emailError.value = t('error_email_required');
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = t('error_email_invalid');
    isValid = false;
  }
  if (!password.value) {
    passwordError.value = t('error_password_required');
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = t('error_password_min_length', { minLength: 6 });
    isValid = false;
  }
  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await updateProfile(userCredential.user, {
      displayName: name.value
    });
    // Instead of alert, you might want a success message component or redirect with a flash message
    alert(t('register_success_message', { name: name.value }));
    router.push('/settings'); // Or to a welcome/dashboard page
  } catch (error) {
    console.error(t('register_error_console'), error);
    if (error.code === 'auth/email-already-in-use') {
      emailError.value = t('error_email_already_in_use');
    } else {
      formError.value = t('register_error_generic', { message: error.message });
    }
  }
};

const onBackButton = () =>{
  router.push('/login');
}
</script>

<style>
/* Basic styling for layout - can be replaced or augmented by Tailwind utility classes more directly if preferred */
.main-container {
  font-family: sans-serif;
}
.form-container {
  /* background-color: #f9f9f9; */ /* Example background */
  /* padding: 20px; */
  /* border-radius: 8px; */
  /* box-shadow: 0 0 10px rgba(0,0,0,0.1); */
}
.input-group {
  /* margin-bottom: 15px; */ /* Handled by Tailwind mb-* */
}
.input-field {
  /* width: 100%; */ /* Handled by Tailwind w-full */
  /* padding: 10px; */ /* Handled by Tailwind p-* */
  /* border: 1px solid #ccc; */ /* Handled by Tailwind border */
  /* border-radius: 4px; */ /* Handled by Tailwind rounded-md */
}
.input-field:focus {
  outline: none;
  border-color: #007bff; /* Example focus color */
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); /* Example focus shadow */
}
.error-message {
  /* color: #dc3545; */ /* Handled by Tailwind text-red-600 */
  /* font-size: 0.875em; */ /* Handled by Tailwind text-sm */
  /* margin-top: 5px; */ /* Handled by Tailwind mt-* */
}
.form-error-alert {
  /* Styles for general form error at the top */
}

/* Button styling is mostly handled by Tailwind, added some base consistency */
button {
  cursor: pointer;
  font-weight: 600;
}
/* .button-primary { */
  /* background-color: #007bff; */ /* Tailwind bg-blue-600 */
  /* color: white; */ /* Tailwind text-white */
/* } */
/* .button-primary:hover { */
  /* background-color: #0056b3; */ /* Tailwind hover:bg-blue-700 */
/* } */
/* .button-secondary { */
  /* background-color: #6c757d; */ /* Tailwind bg-gray-200 */
  /* color: #333; */ /* Tailwind text-gray-700 */
/* } */
/* .button-secondary:hover { */
  /* background-color: #5a6268; */ /* Tailwind hover:bg-gray-300 */
/* } */

input::placeholder { /* Standardized placeholder styling */
  color: #6c757d; /* A common gray color */
  opacity: 0.7;
}

</style>
