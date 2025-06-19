// Запрос на JSON  --> сервер
document.getElementById("ButtonAdd").addEventListener("click", async function (e) {
    e.preventDefault();

    function generateId() {
        return Math.random().toString(36).substr(2, 9); // например: "abc123xyz78"
    }

    // Получаем данные из формы
    const data = {
        id: generateId(),
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
        if (!response.ok) throw new Error("Ошибка загрузки");

        const data = await response.json(); // Получаем JSON
        const container = document.getElementById("itemsList");

        container.innerHTML = ""; // Очищаем старые данные

        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "d-flex align-items-center border border-5 border-danger rounded shadow-sm p-4 mb-4 bg-white";
            card.style.height = "250px";

            card.innerHTML = `
                <div class="flex-grow-1 me-4">
                    <p class="text-secondary fw-bold">ID: ${item.id}</p>
                    <h4 class="text-success fw-bold">${item.nameItem}</h4><br>
                    <strong class="mb-2 text-muted">ФИО: ${item.fullname || "—"}</strong><br>
                    <strong class="mb-2 text-muted">Email: ${item.email || "—"}</strong><br>
                    <strong class="mb-2 text-muted">Место: ${item.locationitem || "—"}</strong><br>
                    <strong class="mb-2 text-muted">Дата: ${item.date || "—"}</strong>
                </div>
                <div style="flex-shrink: 0; width: 180px;">
                    <img src="${item.image || 'images/default.jpg'}" 
                         alt="${item.nameItem}" 
                         class="img-fluid rounded shadow-sm" />
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Ошибка:", error);
        document.getElementById("itemsList").innerHTML = "<p>Не удалось загрузить данные</p>";
    }
}

async function confirmDelete() {
    const input = document.getElementById("deleteIdInput");
    const idToDelete = input.value.trim();

    if (!idToDelete) {
        alert("Введите ID для удаления");
        return;
    }

    const response = await fetch(`/data/delete/${encodeURIComponent(idToDelete)}`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Элемент удален");
        input.value = ""; // очищаем поле
        bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide(); // скрываем модальное окно
        loadItems(); // обновляем список карточек
    } else {
        alert("Ошибка при удалении");
    }
}

// Вызываем при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadItems();
});