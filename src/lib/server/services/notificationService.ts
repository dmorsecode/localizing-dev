import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

//Create a new notification
export const createNotification = async ({
  user_id,
  message,
  type = 'info'
}: {
  user_id: string;
  message: string;
  type?: string;
}) => {
  return await db.insert(schema.notifications).values({
    user_id,
    message,
    type,
    is_read: 0
  }).returning();
};

//Get a notification by ID
export const getNotificationById = async (n_id: string) => {
  const result = await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.n_id, n_id))
    .limit(1);

  return result[0] ?? null;
};

//Get all notifications for a user
export const getNotificationsByUserId = async (user_id: string) => {
  return await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.user_id, user_id));
};

//Get unread notifications for a user
export const getUnreadNotificationsByUserId = async (user_id: string) => {
    return await db
      .select()
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.user_id, user_id),
          eq(schema.notifications.is_read, 0)
        )
      );
  };

//Mark a notification as read
export const markNotificationAsRead = async (n_id: string) => {
  return await db
    .update(schema.notifications)
    .set({ is_read: 1 })
    .where(eq(schema.notifications.n_id, n_id))
    .returning();
};

//Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (user_id: string) => {
  return await db
    .update(schema.notifications)
    .set({ is_read: 1 })
    .where(eq(schema.notifications.user_id, user_id));
};

//Delete a notification
export const deleteNotification = async (n_id: string) => {
  return await db
    .delete(schema.notifications)
    .where(eq(schema.notifications.n_id, n_id));
};

//Delete all notifications for a user (optional cleanup)
export const deleteAllNotificationsByUserId = async (user_id: string) => {
  return await db
    .delete(schema.notifications)
    .where(eq(schema.notifications.user_id, user_id));
};
