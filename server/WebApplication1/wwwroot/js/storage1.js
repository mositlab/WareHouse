// Запрос на JSON  --> сервер
document.getElementById("ButtonAdd").addEventListener("click", async function (e) {
    e.preventDefault();

    // Получаем данные из формы
    const data = {
        fullname: document.getElementById("storagefullname")?.value || "",
        email: document.getElementById("storageEmail")?.value || "",
        nameItem: document.getElementById("storagenameitem")?.value || "",
        locationitem: document.getElementById("storagelocationitem")?.value || "",
        date: document.getElementById("storagedate")?.value || ""
    };

    // Получаем фото
    const photoInput = document.getElementById("photoInput");
    const file = photoInput.files[0];

    if (!file) {
        alert("Выберите фото");
        return;
    }

    // Конвертируем фото в Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async function () {
        const base64Image = reader.result; // ← это Data URL (включает тип и Base64)

        // Добавляем Base64 строку к данным
        const payload = {
            ...data,
            image: base64Image
        };

        // Отправляем на сервер
        try {
            const response = await fetch("/data/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Данные и фото успешно отправлены");
            } else {
                alert("Ошибка при отправке данных");
            }
        } catch (error) {
            console.error("Сеть сломана:", error);
            alert("Не удалось подключиться к серверу");
        }
    };

    reader.onerror = function (error) {
        console.error("Ошибка чтения файла", error);
        alert("Не удалось прочитать файл");
    };
});
document.addEventListener("DOMContentLoaded", () => {
    loadItems();
});

async function loadItems() {
    try {
        const response = await fetch("/data/load");

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json(); // получаем массив из JSON
        const container = document.getElementById("itemsList");

        if (!container) {
            console.warn("Элемент #itemsList не найден");
            return;
        }

        container.innerHTML = ""; // очищаем предыдущие элементы

        data.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-md-4 mb-4 d-flex";
            // ниже потом добавить карточки
            col.innerHTML = `

            `;

            container.appendChild(col);
        });
    } catch (error) {
        console.error("Ошибка загрузки:", error.message);
        const container = document.getElementById("itemsList");
        if (container) {
            container.innerHTML = "<p>Не удалось загрузить данные</p>";
        }
    }
}

// Пример функции для кнопки "Подробнее"
function showDetails(item) {
    alert(JSON.stringify(item, null, 2));
}