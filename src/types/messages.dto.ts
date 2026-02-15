export interface MessageList {
    id: number;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
}