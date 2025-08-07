// services/NotificationService.js
import Notification from '../models/Notification.js'

export const NotificationService = {
  async send({ recipient, type, message, deliveryMethod = 'email', metadata = {} }) {
    // Save log first
    const log = await Notification.create({
      recipient,
      type,
      message,
      deliveryMethod,
      metadata
    })

    try {
      // 🔧 Trigger actual delivery (placeholder for now)
      // await EmailService.send(recipient.email, message)
      // await SMSService.send(recipient.phone, message)
      // await PushService.send(recipient.deviceToken, message)

      log.status = 'sent'
      await log.save()
    } catch (err) {
      log.status = 'failed'
      await log.save()
      console.error(`Failed to send notification:`, err)
    }

    return log
  }
}
