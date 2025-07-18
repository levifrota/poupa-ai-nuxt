<template>
  <div class="main">
      <form class="divInputs" @submit.prevent="register">
        <h1>Cadastro</h1>
        <label>Nome:</label>
        <input v-model="name" type="name" placeholder="Insira seu nome">
        <label>Email:</label>
        <input v-model="email" type="email" placeholder="Insira seu email">
        <label>Senha:</label>
        <input v-model="password" type="password" placeholder="Insira sua senha">
      </form>
      <div class="divButtonOptions">
        <button @click="submit">Confirmar</button>
        <button @click="onBackButton">Retornar para o login</button>
      </div>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFirebaseApp } from 'vuefire';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const name = ref('');
const email = ref('');
const password = ref('');

const router = useRouter();
const app = useFirebaseApp();
const auth = getAuth(app);

const register = async () => {
  if (!email.value || !password.value || !name.value) {
    alert('Por favor, preencha os campos corretamente.');
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await updateProfile(userCredential.user, {
      displayName: name.value
    });
    alert(`Bem-vindo(a), ${name.value}!`);
    router.push('/settings');
  } catch (error) {
    console.error('Erro ao registrar:', error);
    alert('Erro no cadastro: ' + error.message);
  }
};

const onBackButton = () =>{
  router.push('/login');
}
</script>

<style>
  .divButtonOptions{
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  .divButtonOptions button{
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 10px;
    background-color: aqua;
    color: white;
    font-weight: 600;
  }

  input {
    padding: 5px;
    border-radius: 8px;
    margin-bottom: 10px;
    background-color: white;
    color: black
  }

  input::placeholder {
    color: gray;
    opacity: 0.7;
  }

  .divInputs {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
  }

  .main{
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
  }

  h1{
    text-align: center;
  }
</style>
