<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core';
const props = defineProps<{ date: Date | number }>();

const timeAgo = useTimeAgo(props.date);
</script>

<template>{{ timeAgo }}</template>
