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
const LONG_LIVED_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJmYTlhOTc1MjMwMGMyNDc5ZDQ0NGMzZDZlMDc3YmZlYmQyYjM0YzZmNzVlYWI3ZTc2NDA4MGU1YjE3NWE2MjcwZTBjOWVhZTgyYjdlNzFjIn0.eyJhdWQiOiJmZGMxMWViOS01ZGVmLTQyZmYtODg1Ni05NjVmMmRmNDgwZTIiLCJqdGkiOiJiZmE5YTk3NTIzMDBjMjQ3OWQ0NDRjM2Q2ZTA3N2JmZWJkMmIzNGM2Zjc1ZWFiN2U3NjQwODBlNWIxNzVhNjI3MGUwYzllYWU4MmI3ZTcxYyIsImlhdCI6MTczNzgyMjY2MiwibmJmIjoxNzM3ODIyNjYyLCJleHAiOjE3NDg2NDk2MDAsInN1YiI6IjEyMzUxMTA3IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMzODQ5MTQzLCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiOTFmYjdiNDYtYmYxYy00NTFmLTk2ODgtNGYwNTIxNzM3N2Y3IiwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.FAQ2VzOMNfwfXNdzFP3pYcKhnETJjdZBYVANBns83t1xnSbwDgQKwDc2yy6A3BA1i1QHT4UCnLT_XL2Q1VF-P5mb_MxpEnL2fvfRH4HXjxDppV9tVMMmvlFSoF4LEKSI1vlMw_9d958XP9rh7ejpzEGg3GiOrh8cJkcooUTWrVCBKbdd-N_JxXeVXYcUc0pg_xn33Ln1phgP3y8gEEi9gkcWaRgJNfO6sBrPIDNnarcM4f-Yw6sSkKJmN49I_dsnwf2JHNH6R5MQtojD_vaJX00AjxSgujgj7QyvKsRxYamg6RlTXOrcS3gYRBT2GOkdZLiKLZ6LZ5hszi16vVjOeg";

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

const TELEGRAM_BOT_TOKEN = "8044101895:AAG8QtnICJ7TlMkPsR3lsfQMKoEZ8_ciFtI"; // BotFather'dan olingan token
const TELEGRAM_CHANNEL_ID = "@ascargollc_contact"; // Kanal username yoki ID (ID bo‘lsa, -100 bilan boshlanadi)

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
