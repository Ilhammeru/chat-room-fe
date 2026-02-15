import axios from '@/utils/axios'
import type { Contact } from '@/types/contact.dto'
import type { MessageList } from '@/types/messages.dto'

// Example API service
export const chatApi = {
  // Get all contacts
  getContacts: async (): Promise<Contact[]> => {
    return await axios.get('/contacts')
  },

  // Get messages for a specific contact
  getMessages: async (contactId: number): Promise<MessageList[]> => {
    return await axios.get(`/messages/${contactId}`)
  },

  // Send a message
  sendMessage: async (contactId: number, message: string): Promise<MessageList> => {
    return await axios.post('/messages', {
      contactId,
      message,
    })
  },

  // Update contact status
  updateContactStatus: async (contactId: number, online: boolean): Promise<void> => {
    return await axios.patch(`/contacts/${contactId}/status`, { online })
  },
}

// You can also use axios directly for custom requests
export const customRequest = async (endpoint: string, data?: any) => {
  return await axios.post(endpoint, data)
}

export default axios
