<template>
  <div class="flex-1 flex w-full justify-center">
    <div class="global-border w-[500px] h-fit p-6 flex flex-col gap-3">
      <h2 class="w-full text-center">Увійти</h2>
      <div class="w-full">
        <div class="mb-1">Пошта</div>
        <InputText
          fluid
          v-model="email"
          :invalid="!!email && !isEmail"
        ></InputText>
      </div>
      <div class="w-full">
        <div class="mb-1">Пароль</div>
        <Password :feedback="false" fluid v-model="password"></Password>
      </div>
      <Button
        class="mt-2"
        :disabled="isLoginDisabled"
        label="Увійти"
        @click="
          () => {
            console.log(isLoginDisabled);
            if (!isLoginDisabled) {
              logIn({ email, password });
            }
          }
        "
      ></Button>
      <div class="text-sm">
        Не маєте акаунт? &nbsp;<NuxtLink to="sign-up">Зареєструватись</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { emailRegex } from "~/constants";

const email = ref("");
const password = ref("");

const isLoginDisabled = computed(() => !isEmail.value || !password.value);
const isEmail = computed(() => {
  return emailRegex.test(email.value);
});

const { logIn } = useAuth();
</script>
