// Local Imports:
import notificationsModel from '../Models/NotificationsModel';
import userModel from '../Models/UserModel';
import userStatusModel from '../Models/UserStatusModel';
import StatusMessage from '../Utils/StatusMessage';

export default class Notifications {
    static NOTIFICATIONS = {
        'message-notification': this.#messageNotification,
        'like-notification': this.#likeNotification,
        'view-notification': this.#viewNotification,
        'match-notification': this.#matchNotification,
        'like-removed-notification': this.#likeRemovedNotification,
    };

    static async sendNotification(io, notification, recipientId, notifierId) {
        const recipientInfo = await this.#getUserInfo(recipientId);
        if (!recipientInfo) return null;
        const notifierInfo = await this.#getUserInfo(notifierId);
        if (!notifierInfo) return null;

        const notificationMessage = this.NOTIFICATIONS[notification](
            notifierInfo.username
        );
        // Save notification in db
        const notification = notificationsModel.create({
            input: {
                user_id: recipientId,
                message: notificationMessage,
            },
        });
        if (!notification || notification.length === 0) {
            console.log(
                'ERROR:',
                StatusMessage.ERROR_SAVING_NOTIFICATION_TO_DB
            );
            return null;
        }

        const payload = {
            message: notification.message,
            createdAt: notification.created_at,
        };

        // Send notification via sockets
        io.to(recipientInfo.socketId).emit('notification', payload);
    }

    static #messageNotification(notifierUsername) {
        return `${notifierUsername} sent you a message! 💬`;
    }

    static #likeNotification(notifierUsername) {
        return `${notifierUsername} just liked your profile! 💖`;
    }

    static #viewNotification(notifierUsername) {
        return `${notifierUsername} just checked out your profile! 👀`;
    }

    static #matchNotification(notifierUsername) {
        return `${notifierUsername} just liked you back! It's a match! 💘`;
    }

    static #likeRemovedNotification(notifierUsername) {
        return `😔 Oh no, ${notifierUsername} unliked you. But hey, you’re still awesome! 💪`;
    }

    static async #getUserInfo(userId) {
        const userData = await userModel.getById({ id: userId });
        if (!user) {
            console.error('ERROR:', StatusMessage.COULD_NOT_GET_USER);
            return null;
        } else if (user.length === 0) {
            console.info('INFO:', StatusMessage.USER_NOT_FOUND);
            return null;
        }

        const userStatus = await userStatusModel.getByReference(
            {
                user_id: userId,
            },
            true
        );
        if (!userStatus) {
            console.error('ERROR:', StatusMessage.COULD_NOT_GET_USER_STATUS);
            return null;
        } else if (userStatus.length === 0) {
            console.info('INFO:', StatusMessage.USER_STATUS_NOT_FOUND);
            return null;
        }

        const userInfo = {
            id: userData.id,
            username: userData.username,
            socketId: userStatus.socket_id,
        };

        return userInfo;
    }
}
