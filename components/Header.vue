<template>
  <div
    class="global-border h-16 py-4 px-5 mt-2 flex justify-between items-center gap-5"
  >
    <NuxtLink to="/"><div class="font-black text-2xl">YUP</div></NuxtLink>
    <div class="flex-1">
      <NuxtLink to="/issues"> Пости</NuxtLink>
    </div>

    <div
      v-if="currentUser.isAuthenticated"
      class="flex gap-5 justify-center items-center"
    >
      <NuxtLink to="/me">{{ currentUser.name }}</NuxtLink>
      <Button @click="handleLogout" label="Вийти"></Button>
    </div>
    <div v-else class="flex gap-5 justify-center items-center">
      <NuxtLink to="/log-in"><Button label="Увійти"></Button></NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const currentUser = useCurrentUser();

const { onLogout } = useApollo();

const handleLogout = async () => {
  await onLogout();
  currentUser.logout();
  navigateTo("log-in");
};

const name = "Olya";
</script>
