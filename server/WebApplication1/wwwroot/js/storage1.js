
document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("ButtonAdd");

    if (!saveButton) {
        console.warn("Кнопка #ButtonAdd не найдена");
        return;
    }

    saveButton.addEventListener("click", async function (e) {
        e.preventDefault(); 

        const storagefullname = document.getElementById("storagefullname");
        const storageEmail = document.getElementById("storageEmail");
        const storagenameitem = document.getElementById("storagenameitem");
        const storagelocationitem = document.getElementById("storagelocationitem");
        const storagedate = document.getElementById("storagedate");

        if (!storagefullname || !storageEmail || !storagenameitem || !storagelocationitem || !storagedate) {
            console.error("Не все элементы формы найдены");
            return;
        }

        const data = {
            fullname: storagefullname.value,
            email: storageEmail.value,
            nameItem: storagenameitem.value,
            locationItem: storagelocationitem.value,
            date: storagedate.value
        };

        try {
            const response = await fetch("/api/data/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                con
            } else {
                console.error("Ошибка при сохранении данных");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    });
});

// Карточки
async function loadItems() {
    try {
        const response = await fetch("/api/data/load?filename=logs");
        if (!response.ok) throw new Error("Ошибка загрузки данных");

        const data = await response.json();
        const container = document.getElementById("itemsList");
        container.innerHTML = ""; // очищаем предыдущие элементы

        data.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-md-4 mb-4";

            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Предмет: ${item.nameItem}</h5>
                        <p class="card-text">
                            <strong>ФИО:</strong> ${item.fullname}<br/>
                            <strong>Email:</strong> ${item.email}<br/>
                            <strong>Местоположение:</strong> ${item.locationItem}<br/>
                            <strong>Дата:</strong> ${item.date}
                        </p>
                    </div>
                </div>
            `;

            container.appendChild(col);
        });
    } catch (error) {
        console.error("Не удалось загрузить данные:", error);
        document.getElementById("itemsList").innerHTML = "<p>Не удалось загрузить данные</p>";
    }
}

// Вызываем при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadItems(); // ← загружаем данные из JSON
});