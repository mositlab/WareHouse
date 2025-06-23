
console.log("main.js загружен!");

document.getElementById('itemInput').addEventListener('click', function () {
    const innerWindow = document.getElementById('innerWindow');
    innerWindow.style.display = 'block';
});

function kek() {
    return "Bolt"
}

document.querySelector('.search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    addItem();
});

function openPage() {
    
        window.open("card.html");
    
}

function addItem() {
    const input = document.getElementById('itemInput');
    const list = document.getElementById('items-list');

    const results = getSearchResults(input.value.trim());
    list.innerHTML = ''; // Очищаем предыдущие результаты

    if (results.length > 0) {
        results.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');

            link.textContent = item;
            link.href = "#"; // Временная заглушка

            // Обработчик клика по ссылке
            link.addEventListener('click', function(e) {
                e.preventDefault();
                input.value = item; // Подставляем значение в инпут
                closeInnerWindow(); // Закрываем окно
                openPage(item); // Передаём имя/параметр в openPage
            });

            // Обработчик клика по li — если хочешь, чтобы работало по li
            li.addEventListener('click', function() {
                input.value = item;
                closeInnerWindow();
                openPage(item);
            });

            li.appendChild(link);
            list.appendChild(li);
        });
    }
}

function getSearchResults(query) {
    if (!query) return [];

    // Пример: ищем совпадения в каком-то статичном списке
    const database = ["яблоко", "банан", "апельсин", "виноград", "мандарин", "персик", "баня"];
    
    // Фильтруем по запросу пользователя
    return database.filter(item => item.toLowerCase().includes(query.toLowerCase()));
}
function closeInnerWindow() {
    const innerWindow = document.getElementById('innerWindow');
    innerWindow.style.display = 'none';
}
function token123() {

    // Проверяем, есть ли токен
    const tokenKey = "accessToken";
    const token = sessionStorage.getItem(tokenKey);

    if (!token) {
        window.location.href = "index.html";
    } else {
        document.addEventListener("DOMContentLoaded", async () => {
            try {
                const response = await fetch("/api/data/check-token", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                if (!response.ok) {
                    // Токен недействителен → удаляем его
                    sessionStorage.removeItem(tokenKey);
                    window.location.href = "index.html";
                } else {
                    console.log("Токен действителен");
                    // Можно показать данные пользователя или интерфейс
                }
            } catch (error) {
                console.error("Ошибка сети:", error);
                alert("Не удалось проверить токен");
                window.location.href = "index.html";
            }
        });
    }
}
// Загрузка складов

async function showStorage(storageId, storageName) {
    
    // Проверяем, существует ли уже панель этого склада
    const existingPanel = document.getElementById(`storagePanel-${storageId}`);
    if (existingPanel) {
        // Прокручиваем к нему, если он уже есть
        existingPanel.scrollIntoView({ behavior: "smooth" });
        return;
    }

    // Если нет — создаём его интерфейс
    const container = document.getElementById("storagesContainer");
    if (!container) {
        console.error("Контейнер 'storagesContainer' не найден");
        return;
    }

    // Генерируем HTML для склада
    const panelHTML = `
      <div id="storagePanel-${storageId}" class="storage-panel">
            <!-- Обёртка для центрирования -->
            <div class="d-flex justify-content-center align-items-center min-vh-100 w-100">
                <div class="text-center w-100" style="max-width: 1200px; padding: 20px;">

                    <!-- Навбар по центру -->
                    <nav class="navbar navbar-expand-lg bg-body-tertiary border border-danger border-5 mb-4 mx-auto" style="width: 52%; padding: 1%; border-radius: 10px; background-color: #f8f9fa; color: #2f2f2f;">
                        <div class="container-fluid d-flex flex-column align-items-center">
                            <h1 class="mb-3">Склад ${storageId}: ${storageName}</h1>
                            <div class="btn-group mb-3" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-danger btn-lg" data-bs-toggle="modal" data-bs-target="#deleteModal-${storageId}">-</button>
                                <button type="button" class="btn btn-success btn-lg" data-bs-toggle="modal" data-bs-target="#Modal-${storageId}">+</button>
                            </div>
                        </div>
                    </nav>

                    <!-- Модальное окно удаления -->
                    <div class="modal fade" id="deleteModal-${storageId}" tabindex="-1" aria-labelledby="deleteModalLabel-${storageId}" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="deleteModalLabel-${storageId}">Удалить элемент</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <label for="deleteIdInput-${storageId}" class="form-label">Введите ID:</label>
                                    <input type="text" class="form-control" id="deleteIdInput-${storageId}" placeholder="Например: abc123xyz">
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                                    <button type="button" class="btn btn-danger" onclick="confirmDelete(${storageId})">Подтвердить удаление</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Модальное окно добавления -->
                    <div class="modal fade" id="Modal-${storageId}" tabindex="-1" aria-labelledby="ModalLabel-${storageId}" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title text-center fs-5 border border-5 rounded-5 border-danger p-2" id="ModalLabel-${storageId}">Добавление предмета</h5>
                                </div>
                                <div class="modal-body">
                                    <form id="addItemForm-${storageId}" class="row g-3">
                                        <div class="col-md-4">
                                            <label class="form-label">ФИО</label>
                                            <input type="text" class="form-control" id="storagefullname-${storageId}" placeholder="ФИО">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" id="storageEmail-${storageId}" placeholder="Ваша почта">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Название</label>
                                            <input type="text" class="form-control" id="storagenameitem-${storageId}" placeholder="Предмет">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Место</label>
                                            <input type="text" class="form-control" id="storagelocationitem-${storageId}" placeholder="Какая полка">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Дата</label>
                                            <input type="date" class="form-control" id="storagedate-${storageId}">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Фото</label>
                                            <input type="file" id="photoInput-${storageId}" class="form-control" accept="image/*">
                                        </div>
                                        <div class="col-md-4">
                                            <div class="border border-danger border-5" style="background-color: #222; width: 100%; height: auto; border-radius: 15px; aspect-ratio: 4/3; overflow: hidden;">
                                                <img id="preview-${storageId}" src="#" style="display: none; width: 100%; height: 100%; object-fit: cover;">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-success w-100" onclick="addItemToStorage(${storageId})">Добавить</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Контейнер для карточек -->
                    <div id="itemsList-${storageId}" class="row g-4 my-3 overflow-auto p-3 border border-danger border-5" style="width: 50%; height: 700px; background-color: rgba(75, 75, 74, 0.151); margin: 0 auto;">
                        <!-- Здесь будут динамически добавленные карточки -->
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML("beforeend", panelHTML);

    // Подключаем превью фото
    setupImagePreview(storageId);

    // Загружаем карточки для этого склада
    loadItems(storageId);
}



// Создание склада
async function addNewStorage() {
    const numberInput = document.getElementById("storageNumberInput");
    const nameInput = document.getElementById("storageNameInput");

    const storageId = numberInput.value.trim();
    const storageName = nameInput.value.trim();

    if (!storageId || isNaN(storageId)) {
        alert("Введите корректный номер склада");
        return;
    }

    if (!storageName) {
        alert("Введите название склада");
        return;
    }

    // Проверяем, не создан ли уже такой склад
    const container = document.getElementById(`storagePanel-${storageId}`);
    if (container) {
        alert("Этот склад уже существует");
        return;
    }

    // Генерируем HTML для нового склада
    const panelHTML = `
        <div id="storagePanel-${storageId}" class="storage-panel">
            <!-- Обёртка для центрирования -->
            <div class="d-flex justify-content-center align-items-center min-vh-100 w-100">
                <div class="text-center w-100" style="max-width: 1200px; padding: 20px;">

                    <!-- Навбар по центру -->
                    <nav class="navbar navbar-expand-lg bg-body-tertiary border border-danger border-5 mb-4 mx-auto" style="width: 52%; padding: 1%; border-radius: 10px; background-color: #f8f9fa; color: #2f2f2f;">
                        <div class="container-fluid d-flex flex-column align-items-center">
                            <h1 class="mb-3">Склад ${storageId}: ${storageName}</h1>
                            <div class="btn-group mb-3" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-danger btn-lg" data-bs-toggle="modal" data-bs-target="#deleteModal-${storageId}">-</button>
                                <button type="button" class="btn btn-success btn-lg" data-bs-toggle="modal" data-bs-target="#Modal-${storageId}">+</button>
                            </div>
                        </div>
                    </nav>

                    <!-- Модальное окно удаления -->
                    <div class="modal fade" id="deleteModal-${storageId}" tabindex="-1" aria-labelledby="deleteModalLabel-${storageId}" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="deleteModalLabel-${storageId}">Удалить элемент</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <label for="deleteIdInput-${storageId}" class="form-label">Введите ID:</label>
                                    <input type="text" class="form-control" id="deleteIdInput-${storageId}" placeholder="Например: abc123xyz">
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                                    <button type="button" class="btn btn-danger" onclick="confirmDelete(${storageId})">Подтвердить удаление</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Модальное окно добавления -->
                    <div class="modal fade" id="Modal-${storageId}" tabindex="-1" aria-labelledby="ModalLabel-${storageId}" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title text-center fs-5 border border-5 rounded-5 border-danger p-2" id="ModalLabel-${storageId}">Добавление предмета</h5>
                                </div>
                                <div class="modal-body">
                                    <form id="addItemForm-${storageId}" class="row g-3">
                                        <div class="col-md-4">
                                            <label class="form-label">ФИО</label>
                                            <input type="text" class="form-control" id="storagefullname-${storageId}" placeholder="ФИО">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" id="storageEmail-${storageId}" placeholder="Ваша почта">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Название</label>
                                            <input type="text" class="form-control" id="storagenameitem-${storageId}" placeholder="Предмет">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Место</label>
                                            <input type="text" class="form-control" id="storagelocationitem-${storageId}" placeholder="Какая полка">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Дата</label>
                                            <input type="date" class="form-control" id="storagedate-${storageId}">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Фото</label>
                                            <input type="file" id="photoInput-${storageId}" class="form-control" accept="image/*">
                                        </div>
                                        <div class="col-md-4">
                                            <div class="border border-danger border-5" style="background-color: #222; width: 100%; height: auto; border-radius: 15px; aspect-ratio: 4/3; overflow: hidden;">
                                                <img id="preview-${storageId}" src="#" style="display: none; width: 100%; height: 100%; object-fit: cover;">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-success w-100" onclick="addItemToStorage(${storageId})">Добавить</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Контейнер для карточек -->
                    <div id="itemsList-${storageId}" class="row g-4 my-3 overflow-auto p-3 border border-danger border-5" style="width: 50%; height: 700px; background-color: rgba(75, 75, 74, 0.151); margin: 0 auto;">
                        <!-- Здесь будут динамически добавленные карточки -->
                    </div>
                </div>
            </div>
        </div>
    `;

    const storagesContainer = document.getElementById("storagesContainer");
    storagesContainer.insertAdjacentHTML("beforeend", panelHTML);

    // Добавляем обработчик для превью изображения
    setupImagePreview(storageId);



    // Загружаем карточки для этого склада
    loadItems(storageId);

    // Обновляем список кнопок
    renderStorageButtons();

    // Закрываем модальное окно
    const modal = bootstrap.Modal.getInstance(document.getElementById("Constructor"));
    if (modal) {
        modal.hide();
    }

    // Очищаем поля
    numberInput.value = "";
    nameInput.value = "";

    const data = {
        type: "storage",
        storageId,
        name: storageName
    };

    try {
        const response = await fetch("/api/data/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log("Склад сохранён в JSON");
            renderStorageButtons(); // обновляем кнопки
        } else {
            alert("Не удалось сохранить склад");
        }
    } catch (error) {
        console.error("Ошибка сети:", error);
        alert("Не удалось подключиться к серверу");
    }

}


async function loadStorages() {
    try {
        const response = await fetch("/api/storage/list");
        const data = await response.json(); // Получаем массив складов

        const buttonsContainer = document.getElementById("storageButtons");
        buttonsContainer.innerHTML = "";

        data.forEach(storage => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-primary m-2";
            button.textContent = `${storage.name} (${storage.storageId})`;
            button.onclick = () => showStorage(storage.storageId);
            buttonsContainer.appendChild(button);
        });

        // По умолчанию показываем первый склад
        if (data.length > 0) {
            showStorage(data[0].storageId);
        }

    } catch (error) {
        console.error("Ошибка загрузки складов:", error);
        alert("Не удалось загрузить список складов");
    }
}

// Функция для настройки превью изображения
function setupImagePreview(storageId) {
    const photoInput = document.getElementById(`photoInput-${storageId}`);
    const preview = document.getElementById(`preview-${storageId}`);

    if (photoInput && preview) {
        photoInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}
function generateId() {
    return Math.random().toString(36).substr(2, 9); // например: abcdefg12
}
// Функция добавления предмета на склад
async function addItemToStorage(storageId) {
    const fullname = document.getElementById(`storagefullname-${storageId}`).value.trim();
    const email = document.getElementById(`storageEmail-${storageId}`).value.trim();
    const nameItem = document.getElementById(`storagenameitem-${storageId}`).value.trim();
    const locationitem = document.getElementById(`storagelocationitem-${storageId}`).value.trim();
    const date = document.getElementById(`storagedate-${storageId}`).value.trim();
    const photoInput = document.getElementById(`photoInput-${storageId}`);
    const file = photoInput.files[0];

    if (!fullname || !email || !nameItem || !locationitem || !date) {
        alert("Заполните все поля");
        return;
    }

    // Собираем данные
    const data = {
        id: generateId(),
        storageId,
        fullname,
        email,
        nameItem,
        locationitem,
        date
    };

    // Если есть фото — конвертируем в Base64
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = async function () {
            data.image = reader.result; // base64

            // Отправляем как JSON
            const response = await fetch("/api/data/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById(`Modal-${storageId}`));
                if (modal) modal.hide();

                document.getElementById(`addItemForm-${storageId}`).reset();
                document.getElementById(`preview-${storageId}`).style.display = 'none';

                loadItems(storageId); // обновляем список
            } else {
                alert("Ошибка при отправке данных");
            }
        };

        reader.onerror = function () {
            alert("Не удалось прочитать файл");
        };

        reader.readAsDataURL(file);
    } else {
        alert("Выберите изображение");
    }
}

// Функция подтверждения удаления
async function confirmDelete(storageId) {
    const deleteIdInput = document.getElementById(`deleteIdInput-${storageId}`);
    const itemId = deleteIdInput.value.trim();

    if (!itemId) {
        alert("Введите ID элемента");
        return;
    }

    try {
        const response = await fetch(`/data/delete/${encodeURIComponent(itemId)}`, {
            method: "DELETE"
        });

        if (response.ok) {
            deleteIdInput.value = "";
            const modal = bootstrap.Modal.getInstance(document.getElementById(`deleteModal-${storageId}`));
            if (modal) modal.hide();
            loadItems(storageId); // обновляем список
        } else {
            const errorText = await response.text();
            alert(`Ошибка при удалении: ${errorText}`);
        }
    } catch (error) {
        console.error("Ошибка сети:", error.message);
        alert("Не удалось подключиться к серверу");
    }
}

// Исправленная функция загрузки карточек
async function loadItems(storageId) {
    try {
        const response = await fetch(`/api/data/load?storageId=${storageId}`);

        if (!response.ok) {
            const text = await response.text();
            console.warn("Получено:", text);
            return;
        }

        const data = await response.json();
        const container = document.getElementById(`itemsList-${storageId}`);

        if (!container) {
            console.error("Контейнер itemsList-${storageId} не найден");
            return;
        }

        container.innerHTML = ""; // очищаем старое содержимое

        if (!data.length) {
            container.innerHTML = "<p class='text-center'>Нет данных</p>";
            return;
        }

        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "col-md-6 mb-3 w-100";
            card.innerHTML = `
                <div class="card h-70">
                    <div class="card-body d-flex">
                        <div class="flex-grow-1 me-3">
                            <p class="text-secondary fw-bold small">ID: ${item.id || "—"}</p>
                            <h5 class="card-title text-success fw-bold">${item.nameItem || "—"}</h5>
                            <p class="card-text">
                                <strong class="text-muted">ФИО:</strong> ${item.fullname || "—"}<br>
                                <strong class="text-muted">Email:</strong> ${item.email || "—"}<br>
                                <strong class="text-muted">Место:</strong> ${item.locationitem || "—"}<br>
                                <strong class="text-muted">Дата:</strong> ${item.date || "—"}
                            </p>
                        </div>
                        <div style="flex-shrink: 0; width: 120px;">
                            <img src="${item.image || 'images/default.jpg'}" 
                                 alt="${item.nameItem || 'Предмет'}" 
                                 class="img-fluid rounded shadow-sm"
                                 style="width: 100%; height: 100px; object-fit: cover;"
                                 " />
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Ошибка:", error);
        const container = document.getElementById(`itemsList-${storageId}`);
        if (container) {
            container.innerHTML = "<p class='text-center text-danger'>Ошибка загрузки данных</p>";
        }
    }
}

// Обновление кнопок
function renderStorageButtons() {
    const storagesContainer = document.getElementById("storagesContainer");

    if (!storagesContainer) {
        console.error("Контейнер storagesContainer не найден");
        return;
    }

    // Получаем все панели складов
    const panels = storagesContainer.querySelectorAll(".storage-panel");
    const buttonsContainer = document.getElementById("storageButtons");

    if (!buttonsContainer) {
        console.error("Контейнер storageButtons не найден");
        return;
    }

    buttonsContainer.innerHTML = "";

    panels.forEach(panel => {
        const id = panel.id.replace("storagePanel-", "");
        const storageTitle = panel.querySelector("h1").textContent;

        const button = document.createElement("button");
        button.className = "btn btn-outline-primary m-1";
        button.textContent = storageTitle;
        button.onclick = () => {
            scrollToStorage(id);
        };

        buttonsContainer.appendChild(button);
    });
}

// Прокрутка к складу
function scrollToStorage(storageId) {
    const element = document.getElementById(`storagePanel-${storageId}`);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// При загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    // Убираем автоматический вызов addNewStorage()
    // addNewStorage();

    // Добавляем функции в глобальную область видимости
    window.addItemToStorage = addItemToStorage;
    window.confirmDelete = confirmDelete;
    window.scrollToStorage = scrollToStorage;
});
