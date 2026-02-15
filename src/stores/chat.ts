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
        selectedContactId.value = contactId

        // Initiate socket per user id
        if (socket.value) {
            socket.value.emit('register_user', selectedAccount.value?.id, selectedContactId.value);
        }

        selectedUserInRoom.value = contacts.value.find(c => c.id === contactId) || null

        await axiosInstance.post('/messages/setup-listener', {
            userId: contactId
        })
    }

    function selectAccount(accountId: number) {
        selectedAccount.value = contacts.value.find(c => c.id === accountId) || null
        
        if (socket.value) {
            socket.value.emit('reset-user', selectedAccount.value?.id)
        }
    }

    function setChatRoomName(senderId: number, targetId: number) {
        const userIds = [senderId, targetId].sort((a, b) => a - b)
        return `user-room:${userIds[0]}:${userIds[1]}`
    }

    function addMessage(message: MessageList) {
        if (socket.value) {
            // Send message to server
            const senderId = selectedAccount.value?.id || 0
            const targetId = selectedContactId.value || 0
            socket.value.emit('send-message', {
                message: message.text,
                roomName: setChatRoomName(selectedAccount.value?.id || 0, selectedContactId.value || 0),
                senderId,
                targetId
            })
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

    function cleanupSocket() {
        if (socket.value) {
            socket.value.emit('reset-connection', selectedAccount.value?.id)
            socket.value.disconnect()
            socket.value = null
        }
    }

    function initSocket() {
        const promise = new Promise((resolve) => {
            if (socket.value) {
                cleanupSocket()
            }

            socket.value = io(import.meta.env.VITE_BASE_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling']
            })
    
            socket.value.on('connect', () => {
                console.log('Connected to WebSocket server')
            })

            socket.value.on('joined_room', (data) => {
                console.log('joined room notification');
            })
        
            socket.value.on('retrieve-message', (message) => {
                // Format message
                const formattedMessage: MessageList = {
                    id: message.id,
                    text: message.text,
                    sender: message.senderId === selectedAccount.value?.id ? 'me' : 'other',
                    timestamp: message.createdAt
                }
        
                messages.value.push(formattedMessage)
            })
    
            socket.value.on('disconnect', () => {
                console.log('Disconnected from WebSocket server')
            })

            resolve(socket.value)
        })

        return promise
    }

    return {
        // State
        contacts,
        selectedContactId,
        messages,
        selectedUserInRoom,
        socket,

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
        availableContacts,
        cleanupSocket
    }
})