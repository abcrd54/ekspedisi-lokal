<template>
  <div :class="cn('rounded-3xl bg-card text-card-foreground shadow-ambient', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    class?: string;
  }>(),
  {
    class: ""
  }
);
</script>
