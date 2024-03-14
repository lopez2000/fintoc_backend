const crypto = require('crypto');

function validateWebhookSignature(req) {
    try {
        const fintocSignature = req.headers['fintoc-signature'];
        const [timestamp, eventSignature] = fintocSignature.split(',');

        const message = `${timestamp}.${JSON.stringify(req.body)}`;

        const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
        hmac.update(message);
        const signature = hmac.digest('hex');

        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(eventSignature));
    } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
    }
}

module.exports = validateWebhookSignature;
