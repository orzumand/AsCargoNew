const Pipeline_id = 10074555; // 77318083
const Name = "Website Lead";
const FormID = "a1fee7c0fc436088e64ba2e8822ba2b3";
const Website = "https://ascargollc.com";

document
  .getElementById("sendMessageButton")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      // Form ma'lumotlarini yuborish
      await sendFormData();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      alert("Xabar yuborishda xatolik yuz berdi.");
    }
  });

// Formani yuborish
async function sendFormData() {
  // Form ma'lumotlarini kiritish
  const firstName = "test Hayotbek";
  const lastName = "test Hayotbek";
  const phone = "998901234567";
  const email = "test@example.com";
  const dateunix = Math.floor(Date.now() / 1000);

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
    const response = await fetch("https://api.ascargollc/api/send-form-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Ma'lumot serverga yuborildi:", data);
      // alert("Ma'lumot muvaffaqiyatli yuborildi!");
    } else {
      console.error("Xatolik yuz berdi:", data);
      // alert("Ma'lumotni yuborishda xatolik yuz berdi.");
    }
  } catch (error) {
    console.error("Xatolik serverda yuz berdi:", error);
    // alert("Serverda xatolik yuz berdi.");
  }
}
