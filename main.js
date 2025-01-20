//dont change
const Pipeline_id = 10074555; //77318083
const Name = "Website Lead";
const FormID = "a1fee7c0fc436088e64ba2e8822ba2b3";
const Website = "https://ascargollc.com";

const CLIENT_ID = "fdc11eb9-5def-42ff-8856-965f2df480e2";
const CLIENT_SECRET =
  "vwLPrbFSjLFD23faYfkBOhyJ4M712XNLdz2R2EK0ohhd64IWPEkbaJbDoQNwWpbv";
const REFRESH_TOKEN =
  "def50200cb00599e746f037dd085aca808c12ae47c287a2e9c05006f7676cda96d037e534ee7ade34e8eae34a88090c4a16029f6f0c75c4ff662ef93738849b8ad44270841b9e934c2a1c635694842b38105ce7ea0b57ee8f73f810c5a58a298ebbb0123d228bc9b51a194c8dc6fc889ced4c988146ada51e89a33c8fd46768a23c05c5c5f0b2e3d69f948b07abb90beee51296cc5550eb5d94416aead5190193b7afd0512aa10a5a599330ee9b2e6deeafca1d2e49ecedd72d80958c9ccc467e4d15f3476bff999d3fa18000cb243aaf1d3c61013ea247ea6bbf514b1e674dd91a005cb018ad4a8a3718efaa379e6c752858fca8ed1f0dea4ee717893de1a1d9dd0b7b3c713cd0ada49e6d65b1fd3c861be81a935829b567563d5cc2642d88ce664e7119959564d6f17c524383b311d719d5a44e4920af556a23cfd7c0f637f2e4ca9e84e634b1ace3f8263412b2375f8edd2e8ded8457928ad653e003ac161ae2bf400b47059e4eb095b6cf5bfce4bd43a32ab09f237a8ca37e288ff806a0887099a6404d76d2dde407ff9b75ae34f449bf6155a1ab00fcbb547f3c7ebbfc594108a7d81977bb50001b0f391080c34b47c74cccf2651d2b9c7dfa7a947f9b4ad63559378b6a5f43fc9b64e612c0a8790d6e4be31caf736991378652c17bc508186388ab026f5ca2fdd76fa6053";

//fields
let firstName = "";
let lastName = "";
let phone = "";
let email = "";
let city = "";
let state = "";
let zip = "";
let exp = "";
let isTeam = "";
let dateunix = Math.floor(Date.now() / 1000);

async function refreshToken() {
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: Website,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  };

  fetch("https://ascargollc.kommo.com/oauth2/access_token", options)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));

  const refreshToken = "REFRESH_TOKEN";
  const clientId = "CLIENT_ID";
  const clientSecret = "YCLIENT_SECRET";
  const tokenEndpoint = "url";

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json();
    const newAccessToken = data.access_token;

    localStorage.setItem("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}

const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization: localStorage.getItem("accessToken"),
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

fetch("https://ascargollc.kommo.com/api/v4/leads/unsorted/forms", options)
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

document
  .getElementById("sendMessageButton")
  .addEventListener("click", async () => {
    try {
      // Tokenni yangilash (agar kerak bo'lsa)
      await refreshToken();

      // Ma'lumotlarni API'ga yuborish
      const response = await fetch(
        "https://ascargollc.kommo.com/api/v4/leads/unsorted/forms",
        options
      );
      const data = await response.json();

      console.log("Ma'lumot saqlandi:", data);
      alert("Ma'lumot muvaffaqiyatli saqlandi!");
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      alert("Xatolik yuz berdi! Qayta urinib ko‘ring.");
    }
  });
