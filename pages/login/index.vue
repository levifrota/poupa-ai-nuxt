<template>
  <div>
    <form class="loginOptions" @submit.prevent="login" role="form" aria-labelledby="login-heading">
      <h1 id="login-heading" class="sr-only">Formulário de Login</h1>
      <div class="inputDiv">
        <label for="email" class="sr-only">Email</label>
        <input v-model="email" id="email" type="email" class="bg-white input-placeholder text-black" placeholder="Email" aria-required="true" aria-label="Endereço de email">
        <label for="password" class="sr-only">Senha</label>
        <input v-model="password" id="password" type="password" class="bg-white input-placeholder text-black" placeholder="Senha" aria-required="true" aria-label="Senha">
      </div>
      <button type="submit" class="buttonOptions" aria-label="Entrar na sua conta">Entrar</button>
    </form>
    
    <div class="loginOptions">
      <button class="buttonGoogle" @click="googleAuth" aria-label="Entrar com sua conta do Google">Entrar com Google</button>
      <button class="buttonOptions" @click="cadastrar" aria-label="Ir para a página de cadastro">Cadastre-se</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useFirebaseApp } from 'vuefire';
  import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

  const email = ref('');
  const password = ref('');
  const router = useRouter();

  const googleAuth = async () => {
    try {
      const app = useFirebaseApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Bem-vindo, ${user.displayName}!`);
      router.push('/');
    } catch (error) {
      console.error('Erro no login com Google:', error);
      alert('Erro ao fazer login com Google');
    }
  };

  const cadastrar = () => {
    router.push('/register');
  };


  const login = async () => {
    try {
      if (!email.value || !password.value) {
        alert('Por favor, preencha o email e a senha corretamente.');
        return;
      }
      const app = useFirebaseApp();
      const auth = getAuth(app);

      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;

      alert(`Bem-vindo(a), ${user.displayName || 'usuário'}!`);
      router.push('/');
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Senha incorreta.');
      } else if (error.code === 'auth/user-not-found') {
        alert('Usuário não encontrado.');
      } else {
        alert('Erro ao fazer login: ' + error.message);
      }
    }
  };

</script>

<style>
.input-placeholder::placeholder {
  color: gray;
  opacity: 0.7;
}
button {
  cursor: pointer;
  width: 200px;
}
input {
  padding: 5px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.loginOptions {
  display: flex;
  gap: 5px;
  flex-direction: column;
  align-items: center;
}
.inputDiv {
  display: flex;
  max-width: 30%;
  flex-direction: column;
}
.buttonGoogle {
  padding: 5px;
  background-color: orange;
  border-radius: 10px;
  font-weight: 600;
}
.buttonOptions {
  padding: 5px;
  background-color: aqua;
  border-radius: 10px;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
