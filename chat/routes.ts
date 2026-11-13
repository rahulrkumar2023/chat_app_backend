import { Router } from 'express';
import { 
  createOrGetChat, 
  sendMessage, 
  getMessages, 
  markMessageRead, 
  updateLastSeen,
  listUserChats
} from './chat.controller';

export const chatRouter = Router();

// 1. Create or Get Chat
chatRouter.post('/create', createOrGetChat);

// 2. Send Message
chatRouter.post('/:chatId/message/send', sendMessage);

// 3. Get Messages
chatRouter.get('/:chatId/messages', getMessages);

// 4. Mark Message Read
chatRouter.post('/:chatId/message/:messageId/read', markMessageRead);

// 5. Update Last Seen Message
chatRouter.post('/:chatId/lastseen', updateLastSeen);

// 6. List User Chats
chatRouter.get('/user/:userId/chats', listUserChats);
