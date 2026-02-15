<script setup lang="ts">
import Dialog from '@/components/Dialog.vue'
import { useChatStore } from '@/stores/chat'
import type { MessageList } from "@/types/messages.dto";
import type { Contact } from '@/types/contact.dto'
import { storeToRefs } from 'pinia'
import { onMounted, ref, nextTick, watch, computed, onUnmounted } from 'vue'
import Account from './Account.vue'
import ChooseAccount from './ChooseAccount.vue'
import { Socket } from 'socket.io-client'

const chatStore: ReturnType<typeof useChatStore> = useChatStore()

const { allMessages, getSelectedAccount } = storeToRefs(chatStore)

const contacts = ref<Contact[]>([
//   { id: 1, name: 'Alice Johnson', avatar: '👩', lastMessage: 'See you tomorrow!', online: true },
])

const selectedContact = ref<Contact | null>(null)

const newMessage = ref<string>('')

const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

const isShowChooseAccountDialog = computed(() => !getSelectedAccount.value)

// Mobile view state: controls whether to show contact list or chat on mobile
const showMobileChat = ref(false)

const selectContact = (contact: Contact) => {
    chatStore.selectContact(contact.id)
    // Show chat view on mobile when contact is selected
    showMobileChat.value = true
    scrollToBottom()
}

const backToContacts = () => {
    // Return to contacts list on mobile
    showMobileChat.value = false
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatStore.addMessage({
        id: Date.now(),
        sender: 'me',
        text: newMessage.value,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    newMessage.value = ''
    scrollToBottom()
  }
}

// Watch for new messages and scroll to bottom
watch(() => allMessages.value.length, () => {
  scrollToBottom()
})

const getUsers = async () => {
    await chatStore.getContacts()
}

const selectAccount = (userId: number) => {
    chatStore.selectAccount(userId)
}

const initSocket = () => {
    chatStore.initSocket()
}

onMounted(() => {
    scrollToBottom()
    getUsers()
    initSocket()
})
</script>

<template>
  <div class="flex h-[calc(100vh-88px)]">
    <ChooseAccount :is-show="isShowChooseAccountDialog"
        @submit="selectAccount" />

    <!-- Contact List - Left Side -->
    <div 
        class="w-full border-r border-gray-200 bg-white md:w-80"
        :class="{ 'hidden md:block': showMobileChat }"
    >
        <div class="border-b border-gray-200 p-3 md:p-4">
            <input
                type="text"
                placeholder="Search contacts..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:px-4 md:text-base"
            />
        </div>
        <div class="overflow-y-auto">
            <template v-if="! chatStore.availableContacts.length">
                <div class="flex h-full items-center justify-center p-4 text-center text-sm text-gray-500 md:p-6 md:text-base">
                    No contacts found. Please add some contacts to start chatting.
                </div>
            </template>
            <template v-else>
                <div
                    v-for="contact in chatStore.availableContacts"
                    :key="contact.id"
                    class="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-3 transition-colors hover:bg-gray-50 md:px-4"
                    :class="{ 'bg-blue-50': chatStore.selectedUserInRoom?.id === contact.id }"
                    @click="selectContact(contact)"
                >
                    <div class="relative">
                        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-2xl md:h-12 md:w-12">
                            <img :src="contact.avatar" alt="avatar-image" class="h-full w-full rounded-full object-cover" />
                        </div>
                        <div
                            v-if="contact.online"
                            class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
                            ></div>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-semibold text-gray-900 md:text-base">{{ contact.name }}</h3>
                        </div>
                        <p class="truncate text-xs text-gray-500 md:text-sm">{{ contact.lastMessage }}</p>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- Chat Display - Right Side -->
    <div 
        class="flex flex-1 flex-col bg-white"
        :class="{ 'hidden md:flex': !showMobileChat }"
    >
      <!-- Chat Header -->
      <div v-if="chatStore.selectedUserInRoom" class="border-b border-gray-200 bg-white px-4 py-4 md:px-6">
        <div class="flex items-center gap-3">
            <!-- Back button for mobile -->
            <button
                @click="backToContacts"
                class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 md:hidden"
                aria-label="Back to contacts"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                <img :src="chatStore.selectedUserInRoom.avatar" alt="avatar-image" class="h-full w-full rounded-full object-cover" />
            </div>
            <div>
                <h2 class="text-base font-semibold text-gray-900 md:text-lg">{{ chatStore.selectedUserInRoom.name }}</h2>
                <p class="text-xs text-gray-500 md:text-sm">{{ chatStore.selectedUserInRoom.online ? 'Online' : 'Offline' }}</p>
            </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
        <div v-if="chatStore.selectedUserInRoom" class="space-y-4">
            <template v-if="allMessages.length">
                <TransitionGroup name="message-list" tag="div" class="space-y-4">
                    <div
                        v-for="message in allMessages"
                        :key="message.id"
                        class="flex"
                        :class="message.sender === 'me' ? 'justify-end' : 'justify-start'"
                    >
                        <div
                            class="max-w-[85%] rounded-lg px-3 py-2 transition-all duration-300 hover:scale-105 sm:max-w-xs sm:px-4 lg:max-w-md"
                            :class="
                                message.sender === 'me'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-900 shadow-sm'
                            "
                        >
                            <p class="break-words">{{ message.text }}</p>
                            <p
                                class="mt-1 text-xs"
                                :class="message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'"
                            >
                                {{ message.timestamp }}
                            </p>
                        </div>
                    </div>
                </TransitionGroup>
            </template>
            <template v-else>
                <!-- Empty state -->
                <div class="flex h-full items-center justify-center text-sm text-gray-500 md:text-base">
                    No messages yet. Start the conversation!
                </div>
            </template>
        </div>
        <div v-else class="flex h-full items-center justify-center p-4 text-center text-sm text-gray-500 md:text-base">
            Select a contact to start chatting
        </div>
      </div>

      <!-- Message Input -->
      <div v-if="chatStore.selectedUserInRoom" class="border-t border-gray-200 bg-white p-3 md:p-4">
        <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
                v-model="newMessage"
                type="text"
                placeholder="Type a message..."
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:px-4 md:text-base"
            />
            <button
                type="submit"
                class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:px-6 md:text-base"
            >
                Send
            </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list-enter-active {
    transition: all 0.5s ease-out;
}

.message-list-enter-from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
}

.message-list-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.message-list-move {
    transition: transform 0.5s ease-out;
}

.overflow-y-auto {
    scroll-behavior: smooth;
}
</style>
