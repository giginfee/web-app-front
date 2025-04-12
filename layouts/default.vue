<template>
  <div class="flex flex-col w-full min-h-screen  bg-surface-50">
    <div class="flex flex-1 flex-col w-full px-16 gap-10">
      <Header />
      <slot />
    </div>
    <div class="bg-surface-950 h-20 w-full mt-10"></div>
    <Toast class="leading-5" />
  </div>
</template>

<script setup lang="ts"></script>
<style></style>
