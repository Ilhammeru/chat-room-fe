<script setup lang="ts">
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore()

const model = defineModel()
</script>

<template>
    <!-- Account card radio selection -->
    <div class="max-w-md mx-auto">
        <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-2xl font-bold mb-4">Select Your Account</h2>
            <div class="space-y-4">
                <label class="flex items-center gap-3 cursor-pointer" v-for="contact in chatStore.contacts"
                    :key="contact.id">
                    <input type="radio" :value="contact.id" v-model="model" class="form-radio h-5 w-5 text-blue-600" name="account" />
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                            👩
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">{{ contact.name }}</h3>
                            <p class="text-sm text-gray-500">
                                Last active: {{ contact.lastActive }}
                            </p>
                        </div>
                    </div>
                </label>
                <!-- <label class="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="account" class="form-radio h-5 w-5 text-blue-600" />
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                            👨
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">Bob Smith</h3>
                            <p class="text-sm text-gray-500">
                                Last active: 30 minutes ago
                            </p>
                        </div>
                    </div>
                </label> -->
            </div>
        </div>
    </div>
</template>