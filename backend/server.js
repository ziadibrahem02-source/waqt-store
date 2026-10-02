const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// بيانات بوت تليجرام عشان يبعتلك الأوردر عليه فوراً (حط التوكن والـ Chat ID بتوعك)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

// API لreceiving الأوردرات
app.post('/api/checkout', async (req, res) => {
    try {
        const { fullName, email, phone, governorate, manualGov, address, cartItems, totalPrice } = req.body;

        // 1. التحقق من رقم الهاتف المصري سرفراً
        const egyptPhoneRegex = /^01[0-2,5][0-9]{8}$/;
        if (!egyptPhoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: 'رقم الهاتف غير صحيح.' });
        }

        const finalGov = governorate === 'Other' ? manualGov : governorate;

        // 2. تجهيز رسالة الأوردر عشان تتبعتلك على تليجرام
        let itemsList = cartItems.map(item => `- ${item.name} (${item.quantity}x) - ${item.price} EGP`).join('\n');
        
        const telegramMessage = `
🔥 *أوردر جديد من موقع وقت (WAQT)!* 🔥
----------------------------------
👤 *الاسم:* ${fullName}
📧 *الإيميل:* ${email}
📱 *الهاتف:* ${phone}
📍 *المحافظة:* ${finalGov}
🏠 *العنوان:* ${address}
----------------------------------
🛍 *المنتجات:*
${itemsList}
----------------------------------
💰 *الإجمالي الكلي:* *${totalPrice} EGP*
        `;

        // إرسال الإشعار لتليجرام
        if (TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN') {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown'
                })
            });
        }

        res.status(200).json({ success: true, message: 'تم استلام طلبك بنجاح!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'حدث خطأ في الخادم، حاول مرة أخرى.' });
    }
});

app.listen(PORT, () => {
    console.log(`WAQT Server running on port ${PORT}`);
});