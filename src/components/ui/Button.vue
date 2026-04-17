<template>
  <component :is="props.as" :class="classes">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary via-blue-800 to-blue-700 text-primary-foreground shadow-ambient hover:-translate-y-0.5",
        secondary: "bg-gradient-to-r from-secondary to-amber-600 text-secondary-foreground shadow-ambient hover:-translate-y-0.5",
        ghost: "border border-border bg-white/80 text-primary hover:bg-white",
        dark: "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
      },
      size: {
        default: "px-5 py-3",
        lg: "px-6 py-3.5",
        sm: "px-4 py-2.5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

type Props = {
  as?: string | object;
  variant?: "default" | "secondary" | "ghost" | "dark";
  size?: "default" | "lg" | "sm";
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  variant: "default",
  size: "default",
  class: ""
});

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class));
</script>
