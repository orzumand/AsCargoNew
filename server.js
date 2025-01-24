import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// CORS sozlamalari
app.use(cors());
app.use(bodyParser.json());

// Constants
const CLIENT_ID = "fdc11eb9-5def-42ff-8856-965f2df480e2";
const CLIENT_SECRET =
  "vwLPrbFSjLFD23faYfkBOhyJ4M712XNLdz2R2EK0ohhd64IWPEkbaJbDoQNwWpbv";
const REFRESH_TOKEN =
  "def502008d74b9c94eb8e0dcd94d7aae524598e96f543f14b976cae3daf727bd34011a6c4a1df7fdb60c2a8ca6964755a8367c3ed255212e140c715e3f57157be76c335c8f5953733027b72308c8f10d1dd5ee7dfbeab8ddf9cdcf7a1b5dbc721d6112bd3211e11e162ffba224b70de4278137bd1ed3d93b00b3f99062a7881c0a253ebd52412cca36e5fb41883620857d520af9760badf57e505a0b2b1e5ebccce4ee55fe31d9446aa74e348011ee1021f8c51160b3f716c939a39f66626c166a3f57d3c8c01c285112ddcb778ecab179f2c1515e6d3a2170f54bf0b42e582e423a8d1495a6cdb36304f8f0f5c49f9a52d4e3d765d66926a98bea008618db2e18b91d286604bb79efd50ed6a93e34c4994edf326f5367ec1fbbb3cd7b78e4c09727029acf9a80d268cef045605335e69e08c93b216d5e3db9d9ce1ade5ee381b1ae0f47c7121f4e886973b537e9b7b2ad7c000412b2807d62990e279729135d5dde07bf73b7c898bf9089bea0bb68e2659a420df419385635e717c4a9704c8ce8744df173440388da0d1bf5b59e9040d84785135d853692cbc1c2b2d6fd90dfb2498e0559246e21ec19783ed3d4ea7195a6bcc1dcf0a960904e0a381259ad288470e74fa18ef7804a7d7022f0f2561e94410dd24f7485d6295311781b5ed8bcba66f412e21c5e6828a4acc4bd25";

// Refresh token orqali access token olish
app.post("/api/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token talab qilinadi" });
  }

  try {
    const response = await fetch(
      "https://ascargollc.kommo.com/oauth2/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: REFRESH_TOKEN, // refreshTokenni const sifatida ishlatish
          grant_type: "refresh_token",
          redirect_uri: "https://ascargollc.com",
        }),
      }
    );

    const data = await response.json();
    console.log("API Response:", data);

    if (data.access_token) {
      res.json({ access_token: data.access_token });
    } else {
      res.status(400).json({ error: "Access token olishda xatolik" });
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    res.status(500).json({ error: "Server xatoligi" });
  }
});

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
      authorization: `Bearer ${req.headers.authorization.split(" ")[1]}`,
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
        .json({ error: "Kommo API ga ma'lumot yuborishda xatolik", data });
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    res.status(500).json({ error: "Server xatoligi" });
  }
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
});
