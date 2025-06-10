// === Показываем окно по клику на инпут ===
document.addEventListener("DOMContentLoaded", function () {
    const itemInput = document.getElementById("itemInput");

    if (!itemInput) {
        console.warn("Элемент #itemInput не найден");
        return;
    }

    itemInput.addEventListener("click", function () {
        const innerWindow = document.getElementById("innerWindow");
        if (innerWindow) {
            innerWindow.style.display = "block";
        }
    });
});

// === Отправка формы поиска ===
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector(".search-form");

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            addItem();
        });
    } else {
        console.warn("Форма .search-form не найдена");
    }
});

// === Функция открытия страницы card.html с параметром ===
function openPage(item) {
    window.open(`card.html?item=${encodeURIComponent(item)}`);
}

function openStorage1() {
    window.open("storage1.html");
}

// === Получение результатов поиска ===
function addItem() {
    const input = document.getElementById('itemInput');
    const list = document.getElementById('items-list');

    const results = getSearchResults(input.value.trim());
    list.innerHTML = ''; // очищаем предыдущие результаты

    if (results.length > 0) {
        results.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');

            link.textContent = item;
            link.href = "#";

            // Обработчик клика по ссылке
            link.addEventListener('click', function (e) {
                e.preventDefault();
                input.value = item;
                closeInnerWindow();
                openPage(item);
            });

            // Обработчик клика по li
            li.addEventListener('click', function () {
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

    const database = ["яблоко", "банан", "апельсин", "виноград", "мандарин", "персик", "баня"];
    return database.filter(item => item.toLowerCase().includes(query.toLowerCase()));
}

function closeInnerWindow() {
    const innerWindow = document.getElementById('innerWindow');
    if (innerWindow) {
        innerWindow.style.display = 'none';
    }
}

// === Проверка токена при загрузке страницы ===
const tokenKey = "accessToken";
const token = sessionStorage.getItem(tokenKey);

if (!token) {
    window.location.href = "index.html";
} else {
    document.addEventListener("DOMContentLoaded", async function () {
        try {
            const response = await fetch("/data", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok) {
                sessionStorage.removeItem(tokenKey);
                window.location.href = "index.html";
            } else {
                const data = await response.json();
                // можно вывести имя пользователя
                // document.getElementById("userName").innerText = data.username;
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
            sessionStorage.removeItem(tokenKey);
            window.location.href = "index.html";
        }
    });
}