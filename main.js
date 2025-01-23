//dont change
// Do not change
const Pipeline_id = 10074555; //77318083
const Name = "Website Lead";
const FormID = "a1fee7c0fc436088e64ba2e8822ba2b3";
const Website = "https://ascargollc.com";

const CLIENT_ID = "fdc11eb9-5def-42ff-8856-965f2df480e2";
const CLIENT_SECRET =
  "vwLPrbFSjLFD23faYfkBOhyJ4M712XNLdz2R2EK0ohhd64IWPEkbaJbDoQNwWpbv";
const REFRESH_TOKEN =
  "def50200dae9c758faf80df6cc0b94cc0fef7d2d51a5b0db18678a6d73cb9a0131977961ebc56e20c9279d9b844ef00fc8ae18c0b2fa7a3ea3f45e896f5d092b98aa6127e8ab6e17f0cb166bf4b1d6a37e2a469f04f0542bd6d1431e18e6824efc965ede69193679058900cbc07bd256dc3c19ac1dce0b4232d9b9235a0f33aa1d97f341e5871c3e07798921fbdf0e8e7ef4f44a83c1ea8aa4a253a5168642415f025df8dcb0b5385f526a8cdc119802e1037c4fae96e8cbecd95c59b8bb543a9d9c2db3560ffb9e3e31bfa74a11df0f84f75b667e9fe4d02030d991295332c5d28e719c79b858b0dd81892e98f637818c6de34fba0f0ba1aa7d754cb7364ee1d5ab0765faf8db925a98219628a0e880fa664396799c81db1f033de51dbbabaf6fa8fb04a89445b186c9e8a28c894799bc696ae7469e6403248cbecb3328285965f213ac273d198616093ba845d0e5505a61e0874e5c40994a0f88d9ecfe5f876a10c7dfb3757cbc0dd32582c1cb300ab42b19bfc16f522db26034280b83ae65c5b0be0c3536030c6ce4cf353d7975eff0e41bba9ed7b65a0235746f462d9813253b2b3192ba2c2db5cf7c31b5b48374e3f6606d6199f17cef6b28d9a3ce3c31a9b34da6d2f8d339bac259b19108cc621a5911c692058dcd649a58d623d0c2a0ccfafe4c7f964c78ee7bd57d9611";

// Fields
let firstName = "n";
let lastName = "n";
let phone = "n";
let email = "n";
let dateunix = Math.floor(Date.now() / 1000);

// Token yangilash funksiyasi
async function refreshToken() {
  const options = {
    method: "POST",
    mode: "no-cors",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: Website,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  };

  try {
    const response = await fetch(
      "https://ascargollc.kommo.com/oauth2/access_token",
      options
    );
    const data = await response.json();

    if (data.access_token) {
      // Yangi access tokenni saqlash
      localStorage.setItem("accessToken", data.access_token);
      return data.access_token;
    } else {
      console.error("Access token olishda xatolik:", data);
      throw new Error(data.detail || "Xatolik yuz berdi.");
    }
  } catch (error) {
    console.error("Token yangilashda xatolik:", error);
    throw error;
  }
}

// Formani API'ga yuborish funksiyasi
async function sendFormData() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    alert("Access token topilmadi, qayta tizimga kirish.");
    return;
  }

  const options = {
    method: "POST",
    mode: "no-cors",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
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
    console.log("Ma'lumot saqlandi:", data);
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
}

// Submit buttonga event listener qo'shish
document
  .getElementById("sendMessageButton")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const token = await refreshToken();
      if (token) {
        await sendFormData();
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  });
