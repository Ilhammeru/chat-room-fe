<script setup lang="ts">
import Dialog from '@/components/Dialog.vue';
import Account from './Account.vue';
import { ref } from 'vue';
import type { ChooseAccountProps } from '@/types/choose-account-props.dto';

defineEmits(['submit'])

const { isShow = false } = defineProps<ChooseAccountProps>()
const accountId = ref<string>('')
</script>

<template>
    <Dialog title="Choose account"
        v-if="isShow">
        <Account v-model="accountId" />

        <!-- Dialog actions -->
        <div class="actions">
            <!-- Close button -->
            <!-- <button
                class="mt-4 rounded-lg bg-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                @click="$emit('close')"
            >
                Close
            </button> -->

            <!-- Submit button -->
            <button
                class="mt-4 rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                type="button"
                @click="$emit('submit', accountId)"
            >
                Choose
            </button>
        </div>
    </Dialog>
</template>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>