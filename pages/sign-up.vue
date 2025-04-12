<template>
  <div class="flex-1 flex w-full justify-center">
    <div class="global-border w-[500px] h-fit p-6 flex flex-col gap-3">
      <h2 class="w-full text-center">Зареєструватись</h2>
      <div class="w-full">
        <div class="mb-1">Ім'я</div>
        <InputText fluid v-model="name"></InputText>
      </div>
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
        <Password
          fluid
          :invalid="!!password && !isPasswordValid"
          v-model="password"
        ></Password>
      </div>
      <div class="w-full">
        <div class="mb-1">Перевірити пароль</div>
        <Password
          :feedback="false"
          fluid
          :invalid="!!duplicatePassword && !isDuplicatePasswordValid"
          v-model="duplicatePassword"
        ></Password>
      </div>
      <Button
        class="mt-2"
        :disabled="isLoginDisabled"
        @click="onSignUp"
        label="Зареєструватись"
      ></Button>
      <div class="text-sm">
        Маєте акаунт? &nbsp;<NuxtLink to="log-in">Увійти</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { emailRegex, passwordRegex } from "~/constants";

const name = ref("");
const email = ref("");
const password = ref("");
const duplicatePassword = ref("");

const isEmail = computed(() => {
  return emailRegex.test(email.value);
});

const isPasswordValid = computed(() => {
  return passwordRegex.test(password.value);
});

const isDuplicatePasswordValid = computed(() => {
  return password.value == duplicatePassword.value;
});

const isLoginDisabled = computed(
  () =>
    !name.value ||
    !isEmail.value ||
    !isPasswordValid.value ||
    !isDuplicatePasswordValid.value
);

const onSignUp = () => {
  if (!isLoginDisabled.value) {
    signUp({
      name: name.value,
      email: email.value,
      password: password.value,
    });
  }
};
const { signUp } = useAuth();
</script>
