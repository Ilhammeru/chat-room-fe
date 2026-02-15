<script setup lang="ts">
import type { DialogProps } from '@/types/dialog-props.dto';

const { title = 'Dialog Title' } = defineProps<DialogProps>();
</script>

<template>
    <!-- Dialog modal -->
    <div class="dialog">
        
        <div class="dialog-content">
            <div class="dialog-header">
                <h2 class="text-xl font-bold">{{ title }}</h2>
            </div>

            <div class="dialog-body">
                <slot></slot>
            </div>
        </div>

        <!-- Background overlay -->
        <div class="dialog-overlay" @click="$emit('close')"></div>
    </div>
</template>

<style lang="scss">
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;

    &-content {
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        z-index: 60;
        max-width: 500px;
        width: 100%;
    }
    
    &-header {
        border-bottom: 1px solid #e5e7eb;
        padding: 1.5rem 1rem 1rem 1rem;
        margin-bottom: 0;
    }
    
    &-body {
        padding: 1.5rem;
    }

    &-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 50;
    }
}
</style>