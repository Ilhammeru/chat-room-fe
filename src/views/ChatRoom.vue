<script setup lang="ts">
import Dialog from '@/components/Dialog.vue'
import { useChatStore } from '@/stores/chat'
import type { Contact } from '@/types/contact.dto'
import { storeToRefs } from 'pinia'
import { onMounted, ref, nextTick, watch, computed } from 'vue'
import Account from './Account.vue'
import ChooseAccount from './ChooseAccount.vue'

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

const selectContact = (contact: Contact) => {
    chatStore.selectContact(contact.id)
    scrollToBottom()
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

onMounted(() => {
    scrollToBottom()
    getUsers()
})
</script>

<template>
  <div class="flex h-[calc(100vh-88px)]">
    <ChooseAccount :is-show="isShowChooseAccountDialog"
        @submit="selectAccount" />

    <!-- Contact List - Left Side -->
    <div class="w-80 border-r border-gray-200 bg-white">
        <div class="border-b border-gray-200 p-4">
            <input
                type="text"
                placeholder="Search contacts..."
                class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
        <div class="overflow-y-auto">
            <template v-if="! chatStore.availableContacts.length">
                <div class="flex h-full items-center justify-center p-6 text-gray-500">
                    No contacts found. Please add some contacts to start chatting.
                </div>
            </template>
            <template v-else>
                <div
                    v-for="contact in chatStore.availableContacts"
                    :key="contact.id"
                    class="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50"
                    :class="{ 'bg-blue-50': chatStore.selectedUserInRoom?.id === contact.id }"
                    @click="selectContact(contact)"
                >
                    <div class="relative">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-2xl">
                            <img :src="contact.avatar" alt="avatar-image" class="h-full w-full rounded-full object-cover" />
                        </div>
                        <div
                            v-if="contact.online"
                            class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
                            ></div>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-900">{{ contact.name }}</h3>
                        </div>
                        <p class="truncate text-sm text-gray-500">{{ contact.lastMessage }}</p>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- Chat Display - Right Side -->
    <div class="flex flex-1 flex-col bg-white">
      <!-- Chat Header -->
      <div v-if="chatStore.selectedUserInRoom" class="border-b border-gray-200 bg-white px-6 py-4">
        <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                <img :src="chatStore.selectedUserInRoom.avatar" alt="avatar-image" class="h-full w-full rounded-full object-cover" />
            </div>
            <div>
                <h2 class="font-semibold text-gray-900">{{ chatStore.selectedUserInRoom.name }}</h2>
                <p class="text-sm text-gray-500">{{ chatStore.selectedUserInRoom.online ? 'Online' : 'Offline' }}</p>
            </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto bg-gray-50 p-6">
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
                            class="max-w-xs rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105 lg:max-w-md"
                            :class="
                                message.sender === 'me'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-900 shadow-sm'
                            "
                        >
                            <p>{{ message.text }}</p>
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
                <div class="flex h-full items-center justify-center text-gray-500">
                    No messages yet. Start the conversation!
                </div>
            </template>
        </div>
        <div v-else class="flex h-full items-center justify-center text-gray-500">
            Select a contact to start chatting
        </div>
      </div>

      <!-- Message Input -->
      <div v-if="chatStore.selectedUserInRoom" class="border-t border-gray-200 bg-white p-4">
        <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
                v-model="newMessage"
                type="text"
                placeholder="Type a message..."
                class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
                type="submit"
                class="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
