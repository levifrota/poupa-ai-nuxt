<script setup>
import { getDashboard } from "@/data/get-dashboard";

const month = 3;

const dashboard = await getDashboard(month);

</script>

<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->

    <div class="">
      {{ dashboard }}
    </div>
  </div>
</template>
