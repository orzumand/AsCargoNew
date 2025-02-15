import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// CORS sozlamalari
const allowedOrigins = [
  "http://127.0.0.1:5500", // Localhostdan keladigan so'rovlar uchun
  "https://ascargollc.com", // Asosiy domen uchun
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Agar origin ruxsat berilganlar ro'yxatida bo'lsa yoki origin mavjud bo'lmasa (Postman uchun)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORSdan ruxsat yo'q"));
      }
    },
  })
);
app.use(bodyParser.json());

// Long-lived token (statik token)

// Test API
app.get("/", (req, res) => {
  res.send("API ishlayapti!");
});

// Forma ma'lumotlarini AmoCRM API'siga yuborish
app.post("/api/send-form-data", async (req, res) => {
  const { firstName, lastName, phone, email, FormID, Name, Website, dateunix } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !email ||
    !FormID ||
    !Name ||
    !Website
  ) {
    return res.status(400).json({ error: "Ma'lumotlar to'liq emas" });
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LONG_LIVED_TOKEN}`, // Long-lived tokenni ishlatish
    },
    body: JSON.stringify([
      {
        source_uid: FormID,
        source_name: Name,
        created_at: dateunix,
        metadata: {
          form_id: FormID,
          form_name: Name,
          form_page: Website,
          referer: Website,
          form_sent_at: dateunix,
        },
        _embedded: {
          contacts: [
            {
              name: `${firstName} ${lastName}`,
              first_name: firstName,
              last_name: lastName,
              created_at: dateunix,
              custom_fields_values: [
                { field_code: "PHONE", values: [{ value: phone }] },
                { field_code: "EMAIL", values: [{ value: email }] },
              ],
            },
          ],
        },
      },
    ]),
  };

  try {
    const response = await fetch(
      "https://ascargollc.kommo.com/api/v4/leads/unsorted/forms",
      options
    );
    const data = await response.json();

    if (response.ok) {
      res.json({ message: "Ma'lumot muvaffaqiyatli saqlandi", data });
    } else {
      res
        .status(400)
        .json({ error: "AmoCRM API ga ma'lumot yuborishda xatolik", data });
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    res.status(500).json({ error: "Server xatoligi" });
  }
});

// Serverni ishga tushirish



app.use(bodyParser.json());
app.post("/send", async (req, res) => {
  const { fullName, subject, email, text } = req.body;

  const message = `
📩 *New Request:*
👤 Name: ${fullName}
📞 Subject: ${subject}
🏫 Email: ${email}
📜 Message: ${text}
  `;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHANNEL_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      res.json({ message: "Request successfully sent to Telegram!" });
    } else {
      throw new Error(data.description);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send request to Telegram" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
