// //dont change
// Do not change
const Pipeline_id = 10074555; //77318083
const Name = "Website Lead";
const FormID = "a1fee7c0fc436088e64ba2e8822ba2b3";
const Website = "https://ascargollc.com";

// const CLIENT_ID = "fdc11eb9-5def-42ff-8856-965f2df480e2";
// const CLIENT_SECRET =
//   "vwLPrbFSjLFD23faYfkBOhyJ4M712XNLdz2R2EK0ohhd64IWPEkbaJbDoQNwWpbv";
// const REFRESH_TOKEN =
//   "def502007067717bf986656c62a2a39ccc5205cf79994efa421e5992d0e963d298ed38e55cdfa5ee647fd9169c45e15bc7ca3d51bcd30930bb19a8e8f845b61feeeb8ac18dd8c82da94d4ea21e657191d141648371c7dab317e66f1a8516d9583042fca3e4c9e4c1c1eef8984dd437ea240ad0aafa9dedb9aa4389b59b913f91a114762711156ba44ed89028f414eb8d3914f634ff618bcf4b34d102129916916e1d08d17d36a45b49fed0ba747efa846e722d7a6a44b2931e5c39a9e3195ca01eb8165804bd10d178b6b78b2f9117269f2d702fb7b0ad296a0f77267611e9ff4b81ac95a4e3ef568678083ff4533a90d82181e7f8fb2eaf8ddb777732ae71942cd07a00fd8ae33554c760cb9a5ad74f93f291a4453ed8410d0c564ad79bacfbea07d5e42fd2d0631c4b66d80a78b5fc9276030a0271bbda5a60c24e34679cdeb1f2450b105d01363f5e096b8efe908a3eef54084f557c3172cf5d8d2b3ae5cc27aaadd27d5f0eb06663ab9ceae3d9235d67fa56c7ce0f84f4b912e3614385a4efb75c48e4e84311f2cdc7669afc97e58cc6680cd9b91c9db874022b45f2a9daf645514158870ded216df7b2e97ec7b31612746a2b10457fa2e2dd198d6d11529ffdaf6e06f68042503eb37855a82f5b83de1233b0f5820150497632b21344165b86aba0a454c8df2974d9f40184";

// // Fields
// let firstName = "n";
// let lastName = "n";
// let phone = "n";
// let email = "n";
// let dateunix = Math.floor(Date.now() / 1000);

// // Token yangilash funksiyasi
// async function refreshToken() {
//   const options = {
//     method: "POST",
//     mode: "no-cors",
//     headers: {
//       accept: "application/json",
//       "content-type": "application/json",
//     },
//     body: JSON.stringify({
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: Website,
//       refresh_token: REFRESH_TOKEN,
//       grant_type: "refresh_token",
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://ascargollc.kommo.com/oauth2/access_token",
//       options
//     );
//     const data = await response.json();

//     if (data.access_token) {
//       // Yangi access tokenni saqlash
//       localStorage.setItem("accessToken", data.access_token);
//       return data.access_token;
//     } else {
//       console.error("Access token olishda xatolik:", data);
//       throw new Error(data.detail || "Xatolik yuz berdi.");
//     }
//   } catch (error) {
//     console.error("Token yangilashda xatolik:", error);
//     throw error;
//   }
// }

// // Formani API'ga yuborish funksiyasi
// async function sendFormData() {
//   const accessToken = localStorage.getItem("accessToken");

//   if (!accessToken) {
//     alert("Access token topilmadi, qayta tizimga kirish.");
//     return;
//   }

//   const options = {
//     method: "POST",
//     // mode: "no-cors",
//     headers: {
//       accept: "application/json",
//       "content-type": "application/json",
//       authorization: `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify([
//       {
//         source_uid: FormID,
//         source_name: Name,
//         created_at: dateunix,
//         metadata: {
//           form_id: FormID,
//           form_name: Name,
//           form_page: Website,
//           referer: Website,
//           form_sent_at: dateunix,
//         },
//         _embedded: {
//           contacts: [
//             {
//               name: `${firstName} ${lastName}`,
//               first_name: firstName,
//               last_name: lastName,
//               created_at: dateunix,
//               custom_fields_values: [
//                 { field_code: "PHONE", values: [{ value: phone }] },
//                 { field_code: "EMAIL", values: [{ value: email }] },
//               ],
//             },
//           ],
//         },
//       },
//     ]),
//   };

//   try {
//     const response = await fetch(
//       "https://ascargollc.kommo.com/api/v4/leads/unsorted/forms",
//       options
//     );
//     const data = await response.json();
//     console.log("Ma'lumot saqlandi:", data);
//   } catch (error) {
//     console.error("Xatolik yuz berdi:", error);
//   }
// }

// // Submit buttonga event listener qo'shish
// document
//   .getElementById("sendMessageButton")
//   .addEventListener("click", async (event) => {
//     event.preventDefault();
//     try {
//       const token = await refreshToken();
//       if (token) {
//         await sendFormData();
//       }
//     } catch (error) {
//       console.error("Xatolik yuz berdi:", error);
//     }
//   });
// ---------------------------------------------------
// const sendMessageButton = document.getElementById("sendMessageButton");

// sendMessageButton.addEventListener("click", async (event) => {
//   event.preventDefault();
//   const refreshToken = REFRESH_TOKEN; // Refresh tokenni to‘ldiring
//   const client_id = CLIENT_ID;
//   const client_secret = CLIENT_SECRET;
//   const redirect_uri = Website;

//   const requestData = {
//     client_id,
//     client_secret,
//     redirect_uri,
//     refresh_token: refreshToken,
//     grant_type: "refresh_token",
//   };

//   // Backendga so'rov yuborish
//   const response = await fetch("http://localhost:3000/api/amo", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestData),
//   });

//   const data = await response.json();
//   console.log(data); // Natijani konsolga chiqarish
// });
// -----------------------
document
  .getElementById("sendMessageButton")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    // Foydalanuvchidan refresh tokenni olish
    const refreshToken = "SIZNING_REFRESH_TOKEN_BU_YERDA"; // const sifatida kiritiladi

    if (!refreshToken) {
      alert("Iltimos, refresh tokenni kiriting.");
      return;
    }

    try {
      // Refresh tokenni serverga yuborish
      const response = await fetch(
        "https://api.ascargollc.com/api/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const data = await response.json();

      if (data.access_token) {
        // Yangi access tokenni localStorage'ga saqlash
        localStorage.setItem("accessToken", data.access_token);

        // Form ma'lumotlarini yuborish
        await sendFormData();
      } else {
        console.error("Access token olishda xatolik");
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  });

// Formani yuborish
async function sendFormData() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    alert("Access token topilmadi, qayta tizimga kirish.");
    return;
  }

  let firstName = "test Hayotbek";
  let lastName = "test Hayotbek";
  let phone = "test Hayotbek";
  let email = "test Hayotbek";
  const dateunix = Math.floor(Date.now() / 1000);

  const FormID = "someFormID"; // Buni o'zgartiring
  const Name = "someName"; // Buni o'zgartiring
  const Website = "someWebsite"; // Buni o'zgartiring

  const dataToSend = {
    firstName,
    lastName,
    phone,
    email,
    FormID,
    Name,
    Website,
    dateunix,
  };

  try {
    const response = await fetch(
      "https://api.ascargollc.com/api/send-form-data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSend),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Ma'lumot serverga yuborildi:", data);
    } else {
      console.error("Xatolik yuz berdi:", data);
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
}
