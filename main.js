const Pipeline_id = 10074555; // 77318083
const Name = "Website Lead";
const FormID = "a1fee7c0fc436088e64ba2e8822ba2b3";
const Website = "https://ascargollc.com";

document
  .getElementById("contactForm")
  .addEventListener("submit", async (event) => {
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
  const firstName = document.getElementById("name").value;
  const lastName = document.getElementById("surname").value;
  const phone = document.getElementById("number").value;
  const email = document.getElementById("email").value;
  const dateunix = Math.floor(Date.now() / 1000);
  // Form ma'lumotlarini kiritish

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
        },
        body: JSON.stringify(dataToSend),
      }
    );

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
