const dialog = document.getElementById("contactDialog");
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeFormBtn");
const form = document.getElementById("actualForm");

// Открыть форму
openBtn.addEventListener("click", () => {
  dialog.showModal();
});

// Закрыть по крестику
closeBtn.addEventListener("click", () => {
  dialog.close();
});

// Закрыть при клике на темный фон (вне окна)
dialog.addEventListener("click", (e) => {
  const dialogDimensions = dialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
  }
});

// Показать сообщение об успехе после отправки (без перезагрузки страницы)
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Отменяем стандартную перезагрузку

  // Меняем текст кнопки на время отправки
  const submitBtn = form.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = "Отправка...";
  submitBtn.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      // Успех!
      form.innerHTML =
        '<p style="text-align:center; font-size: 18px; color: #4ade80; padding: 20px 0;">Спасибо! Письмо отправлено. Я свяжусь с вами в ближайшее время.</p>';
      setTimeout(() => {
        dialog.close();
        // Возвращаем форму обратно через 3 секунды после закрытия
        setTimeout(() => {
          form.innerHTML = originalHTML; // См. примечание ниже
          location.reload(); // Самый простой способ сбросить форму, если не хотите возиться с HTML
        }, 500);
      }, 2000);
    } else {
      throw new Error("Ошибка сервера");
    }
  } catch (error) {
    alert("Произошла ошибка при отправке. Пожалуйста, попробуйте позже.");
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});
