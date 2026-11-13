import { prisma, firestore, FirebaseFieldValue } from '../config/db';

export class ChatRepository {
  // --- Relational DB Operations (MySQL via Prisma) ---
  
  async findExistingChat(userAId: string, userBId: string) {
    return prisma.chat.findFirst({
      where: {
        AND: [
          { users: { some: { userId: userAId } } },
          { users: { some: { userId: userBId } } }
        ]
      }
    });
  }

  async createNewChat(userAId: string, userBId: string) {
    return prisma.$transaction(async (tx) => {
      const chat = await tx.chat.create({});
      await tx.chatUser.createMany({
        data: [
          { chatId: chat.id, userId: userAId },
          { chatId: chat.id, userId: userBId }
        ]
      });
      return chat;
    });
  }

  async findUserChats(userId: string) {
    return prisma.chatUser.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            users: { select: { userId: true } }
          }
        }
      }
    });
  }

  // --- NoSQL Document Operations (Firebase Firestore) ---

  async saveMessage(chatId: string, senderId: string, text: string) {
    const messageData = {
      chatId,
      senderId,
      text,
      timestamp: FirebaseFieldValue.serverTimestamp(),
      readBy: [senderId]
    };
    const docRef = await firestore.collection('messages').add(messageData);
    return { messageId: docRef.id, ...messageData };
  }

  async getChatMessages(chatId: string, limit: number) {
    const snapshot = await firestore.collection('messages')
      .where('chatId', '==', chatId)
      .orderBy('timestamp', 'asc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async appendUserToReadReceipt(messageId: string, userId: string) {
    const msgRef = firestore.collection('messages').doc(messageId);
    await msgRef.update({
      readBy: FirebaseFieldValue.arrayUnion(userId)
    });
  }

  async updateLastSeenPointer(chatId: string, userId: string, messageId: string) {
    const lastSeenId = `${chatId}_${userId}`;
    await firestore.collection('last_seen').doc(lastSeenId).set({
      chatId,
      userId,
      lastSeenMessageId: messageId,
      updatedAt: FirebaseFieldValue.serverTimestamp()
    }, { merge: true });
  }
}
