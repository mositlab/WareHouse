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
// Открытие складов
function openStorage1(){
window.open("storage1.html");
}
function openStorage2(){
window.open("storage2.html");
}
// token
const tokenKey = "accessToken";

// Проверяем, есть ли токен
const token = sessionStorage.getItem(tokenKey);

if (!token) {
    window.location.href = "index.html";
} else {
    // Можно вывести приветствие или продолжить работу
    document.addEventListener("DOMContentLoaded", async () => {
        // Проверим токен через API (если нужно)
        const response = await fetch("/data", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            sessionStorage.removeItem(tokenKey);
            window.location.href = "index.html";
        }
    });
}
// Склады
async function loadStorage() {
    try {
        const storageContainer = document.getElementById("storages");
        if (!storageContainer) {
            console.error("Контейнер 'storages' не найден");
            return;
        }

        storageContainer.innerHTML = ""; // Очищаем предыдущее содержимое

        // Создаём один раз структуру склада
        const storageHTML = `
           <!-- Обёртка для центрирования -->
<div class="d-flex justify-content-center align-items-center min-vh-100 w-100">
    <div class="text-center w-100" style="max-width: 1200px; padding: 20px;">

        <!-- Навбар по центру -->
        <nav class="navbar navbar-expand-lg bg-body-tertiary border border-danger border-5 mb-4 mx-auto" style="width: 52%; padding: 1%; border-radius: 10px; background-color: #f8f9fa; color: #2f2f2f;">
            <div class="container-fluid d-flex flex-column align-items-center">
                <h1 class="mb-3">Склад 1</h1>
                <div class="btn-group mb-3" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-danger btn-lg" data-bs-toggle="modal" data-bs-target="#deleteModal">-</button>
                    <button type="button" class="btn btn-success btn-lg" data-bs-toggle="modal" data-bs-target="#Modal">+</button>
                </div>
               
            </div>
        </nav>

        <!-- Модальное окно удаления -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Удалить элемент</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <label for="deleteIdInput" class="form-label">Введите ID:</label>
                        <input type="text" class="form-control" id="deleteIdInput" placeholder="Например: abc123xyz">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-danger" onclick="confirmDelete()">Подтвердить удаление</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Модальное окно добавления -->
        <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-center fs-5 border border-5 rounded-5 border-danger p-2" id="ModalLabel">Добавление предмета</h5>
                    </div>
                    <div class="modal-body">
                        <form id="addItemForm" class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">ФИО</label>
                                <input type="text" class="form-control" id="storagefullname" placeholder="ФИО">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="storageEmail" placeholder="Ваша почта">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Название</label>
                                <input type="text" class="form-control" id="storagenameitem" placeholder="Предмет">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Место</label>
                                <input type="text" class="form-control" id="storagelocationitem" placeholder="Какая полка">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Дата</label>
                                <input type="date" class="form-control" id="storagedate">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Фото</label>
                                <input type="file" id="photoInput" class="form-control" accept="image/*">
                            </div>
                            <div class="col-md-4">
                                <div class="border border-danger border-5" style="background-color: #222; width: 100%; height: auto; border-radius: 15px; aspect-ratio: 4/3; overflow: hidden;">
                                    <img id="preview" src="#" style="display: none; width: 100%; height: 100%; object-fit: cover;">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-success w-100" id="ButtonAdd">Добавить</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Контейнер для карточек -->
        <div id="itemsList" class="row g-4 my-3 overflow-auto p-3 border border-danger border-5" style="width: 50%; height: 700px; background-color: rgba(75, 75, 74, 0.151); margin: 0 auto;">
            <!-- Здесь будут динамически добавленные карточки -->
        </div>
    </div>
</div>
        `;

        // Вставляем разметку в контейнер
        storageContainer.insertAdjacentHTML("beforeend", storageHTML);

        // Теперь можно подключить обработчики
        setupEventListeners();

        // После вставки формы, подключаем превью фото
        const photoInput = document.getElementById("photoInput");
        if (photoInput) {
            photoInput.addEventListener("change", function () {
                const file = this.files[0];
                if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const preview = document.getElementById("preview");
                        if (preview) {
                            preview.src = e.target.result;
                            preview.style.display = "block";
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Загружаем существующие элементы
        await loadItems();

    } catch (error) {
        console.error("Ошибка:", error);
        const storageContainer = document.getElementById("storages");
        if (storageContainer) {
            storageContainer.innerHTML = "<p>Не удалось загрузить интерфейс склада</p>";
        }
    }
}

function setupEventListeners() {
    const buttonAdd = document.getElementById("ButtonAdd");
    if (buttonAdd) {
        buttonAdd.addEventListener("click", async function (e) {
            e.preventDefault();

            function generateId() {
                return Math.random().toString(36).substr(2, 9);
            }

            // Получаем значения из полей
            const fullnameEl = document.getElementById("storagefullname");
            const emailEl = document.getElementById("storageEmail");
            const nameItemEl = document.getElementById("storagenameitem");
            const locationItemEl = document.getElementById("storagelocationitem");
            const dateEl = document.getElementById("storagedate");
            const photoInput = document.getElementById("photoInput");

            if (!fullnameEl || !emailEl || !nameItemEl || !locationItemEl || !dateEl || !photoInput) {
                alert("Не все элементы формы найдены");
                return;
            }

            const data = {
                id: generateId(),
                fullname: fullnameEl.value || "",
                email: emailEl.value || "",
                nameItem: nameItemEl.value || "",
                locationitem: locationItemEl.value || "",
                date: dateEl.value || ""
            };

            const file = photoInput.files[0];
            if (!file) {
                alert("Выберите фото");
                return;
            }

            try {
                const reader = new FileReader();
                reader.onload = async function () {
                    const base64Image = reader.result;
                    data.image = base64Image;

                    try {
                        // Попробуем отправить на сервер
                        const response = await fetch("/data/save", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data)
                        });

                        if (response.ok) {
                            console.log("лак");
                        } else {
                            console.log("анлак");
                        }
                    } catch (fetchError) {
                        console.log(fetchError.message);
                    }

                    // В любом случае добавляем в локальный массив
                    itemsData.push(data);

                    alert("Данные сохранены!");

                    // Очищаем форму
                    fullnameEl.value = "";
                    emailEl.value = "";
                    nameItemEl.value = "";
                    locationItemEl.value = "";
                    dateEl.value = "";
                    photoInput.value = "";
                    const preview = document.getElementById("preview");
                    if (preview) {
                        preview.style.display = "none";
                    }

                    // Обновляем отображение
                    displayItems();

                    // Закрываем модальное окно
                    const modal = document.getElementById("Modal");
                    if (modal && window.bootstrap) {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                    }
                };

                reader.onerror = function (error) {
                    console.error("Ошибка чтения файла", error);
                    alert("Не удалось прочитать файл");
                };

                reader.readAsDataURL(file);
            } catch (error) {
                console.error("Ошибка при обработке файла:", error);
                alert("Ошибка при обработке файла");
            }
        });
    }
}



async function loadItems() {

    try {
        // Попробуем загрузить с сервера
        const response = await fetch("/data/load");
        if (response.ok) {
            const data = await response.json();
            itemsData = Array.isArray(data) ? data : [];
        } else {
            console.log("⚠️ Сервер недоступене");
        }
    } catch (error) {
        console.log(error.message);
    }

    // Отображаем данные
    displayItems();
}

function displayItems() {

    const container = document.getElementById("itemsList");

    if (!container) {
        // Попробуем найти через более общий селектор
        const allContainers = document.querySelectorAll("[id='itemsList']");

        if (allContainers.length === 0) {
            console.error("❌ Контейнер itemsList действительно не существует");
            return;
        }
    }

    container.innerHTML = ""; // Очищаем старые данные

    if (itemsData.length === 0) {
        container.innerHTML = "<p class='text-center text-muted'>Нет данных для отображения</p>";
        return;
    }


    itemsData.forEach((item, index) => {

        const card = document.createElement("div");
        card.className = "d-flex align-items-center border border-5 border-danger rounded shadow-sm p-4 mb-4 bg-white";
        card.style.height = "250px";

        card.innerHTML = `
            <div class="flex-grow-1 me-4">
                <p class="text-secondary fw-bold">ID: ${item.id || "—"}</p>
                <h4 class="text-success fw-bold">${item.nameItem || "—"}</h4><br>
                <strong class="mb-2 text-muted">ФИО: ${item.fullname || "—"}</strong><br>
                <strong class="mb-2 text-muted">Email: ${item.email || "—"}</strong><br>
                <strong class="mb-2 text-muted">Место: ${item.locationitem || "—"}</strong><br>
                <strong class="mb-2 text-muted">Дата: ${item.date || "—"}</strong>
            </div>
            <div style="flex-shrink: 0; width: 180px;">
                <img src="${item.image || 'images/default.jpg'}" 
                     alt="${item.nameItem || 'Предмет'}" 
                     class="img-fluid rounded shadow-sm"
                     onerror="this.src='images/default.jpg'" />
            </div>
        `;

        container.appendChild(card);
    });

}

// Функция для удаления элемента (если нужна)
async function confirmDelete() {
    const deleteIdInput = document.getElementById("deleteIdInput");
    if (!deleteIdInput) {
        alert("Поле для ID не найдено");
        return;
    }

    const itemId = deleteIdInput.value.trim();
    if (!itemId) {
        alert("Введите ID элемента");
        return;
    }

    try {
        const response = await fetch(`/data/delete/${itemId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Элемент удален");
            deleteIdInput.value = "";
            await loadItems();

            // Закрываем модальное окно
            const modal = document.getElementById("deleteModal");
            if (modal && window.bootstrap) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        } else {
            const errorText = await response.text();
            alert(`Ошибка при удалении: ${errorText}`);
        }
    } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Ошибка при удалении элемента");
    }
}


// При загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
    loadStorage();

    window.displayItems = displayItems;
});