import type { Contact } from "@/types/contact.dto";
import type { MessageList } from "@/types/messages.dto";
import type { UserDataDto } from "@/types/user-data.dto";
import axiosInstance from "@/utils/axios";
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref, computed } from "vue";

export const useChatStore = defineStore('chat', () => {
    // State
    const contacts = ref<Contact[]>([])
    const selectedContactId = ref<number | null>(null)
    const messages = ref<MessageList[]>([])
    const socket = ref<ReturnType<typeof io> | null>(null)
    const selectedAccount = ref<UserDataDto | null>(null)
    const selectedUserInRoom = ref<Contact | null>(null)

    // Getters
    const selectedContact = computed(() => 
        contacts.value.find(c => c.id === selectedContactId.value) || null
    )

    const getSelectedAccount = computed(() => selectedAccount.value)

    const allMessages = computed(() => {
        return messages.value
    })

    const availableContacts = computed(() => {
        return !selectedAccount.value ? [] : contacts.value.filter(c => c.id !== selectedAccount.value?.id)
    })

    // Actions
    async function selectContact(contactId: number) {
        // Reset socket
        if (socket.value) socket.value.disconnect()

        selectedContactId.value = contactId
        // Initiate socket per user id
        initSocket(contactId)

        selectedUserInRoom.value = contacts.value.find(c => c.id === contactId) || null

        await axiosInstance.post('/messages/setup-listener', {
            userId: contactId
        })
    }

    function selectAccount(accountId: number) {
        selectedAccount.value = contacts.value.find(c => c.id === accountId) || null
    }

    function addMessage(message: MessageList) {
        messages.value.push(message)

        if (socket.value) {
            // Send message to server
            socket.value.emit('message-' + selectedContactId.value, message)
        }
    }

    function setContacts(newContacts: Contact[]) {
        contacts.value = newContacts
    }

    async function getContacts() {
        try {
            const response = await axiosInstance.get('/users')
            
            contacts.value = response.data
        } catch (error) {
            return error
        }
    }

    function initSocket(contactId?: number) {
        if (! socket.value) {
            socket.value = io('http://localhost:3500', {
                withCredentials: true,
                transports: ['websocket', 'polling']
            })

            socket.value.on('connect', () => {
                console.log('Connected to WebSocket server')
            })
            
            socket.value.on(`message-${contactId}`, (message: MessageList) => {
                // addMessage(message)
                console.log('Received message:', message)
            })

            socket.value.on('disconnect', () => {
                console.log('Disconnected from WebSocket server')
            })
        }
    }

    return {
        // State
        contacts,
        selectedContactId,
        messages,
        selectedUserInRoom,

        // Getters
        selectedContact,
        allMessages,
        getSelectedAccount,

        // Actions
        selectContact,
        addMessage,
        setContacts,
        initSocket,
        getContacts,
        selectAccount,
        availableContacts
    }
})