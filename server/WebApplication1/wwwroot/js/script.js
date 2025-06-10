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
function openStorage1(){
window.open("storage1.html");
}

    // js for card

function returnMainPage() {
window.open("main.html");
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

// storage
document.getElementById('photoInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')){
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});
// Запрос на JSON файл
document.getElementById("ButtonAdd").addEventListener('click', async (e) => {
    e.preventDefault();

    const data = {
        fullname: document.getElementById("storagefullname")?.value || "",
        email: document.getElementById("storageEmail")?.value || "",
        nameItem: document.getElementById("storagenameitem")?.value || "",
        locationItem: document.getElementById("storagelocationitem")?.value || "",
        date: document.getElementById("storagedate")?.value || ""
    };

    // Отправляем данные на сервер
    const response = await fetch("/data/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Данные сохранены");
    } else {
        alert("Ошибка сохранения");
    }
});