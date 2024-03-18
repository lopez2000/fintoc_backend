const crypto = require('crypto');

function validateWebhookSignature(req) {
    try {
        const fintocSignature = req.headers['fintoc-signature'];
        console.log('fintocSignature:', fintocSignature);

        const [timestamp, eventSignature] = fintocSignature.split(',');
        // Crop the 't=' and 'v1=' prefixes
        const timestamp1 = timestamp.slice(2);
        const eventSignature1 = eventSignature.slice(3);

        console.log('timestamp:', timestamp1);
        console.log('eventSignature:', eventSignature1);

        const message = `${timestamp1}.${JSON.stringify(req.body)}`;
        console.log('message:', message);

        const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
        hmac.update(message);
        const signature = hmac.digest('hex');

        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(eventSignature1));
    } catch (error) {
        console.error('Error validating webhook signature:', error);
        return false;
    }
}

module.exports = validateWebhookSignature;
