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
// Отправка данных с формы конструктора
document.getElementById('ConstructorStorageForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const ConstructorData = {
        StorageNumber: document.getElementById("storageNumberInput").value,
        StorageName: document.getElementById("storageNameInput").value
    }
    try {
        const response = await fetch('/api/StorageControllers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ConstructorData)
        });
        if (response.ok) {
            alert("Склад успешно добавлен");
        } else {
            alert("Ошибка при отправке данных");
        }
        

    }
    catch (error) {
        console.error('Ошибка', error)
    }
})
// Загрузка кнопок складов
async function NavStorageButtons() {
    try {
        const response = await fetch('/api/StorageControllers'); 
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const StorageButtons = await response.json(); 

        const list = document.getElementById('storageButtons');
        if (!list) {
            throw new Error('Элемент с ID "storageButtons" не найден');
        }
        list.innerHTML = '';

        if (!Array.isArray(StorageButtons) || StorageButtons.length === 0) {
            list.textContent = 'Склады не найдены';
            return;
        }

        StorageButtons.forEach(storage => {
            const item = document.createElement('button');
            item.textContent = `Название: ${storage.storageName}, Номер склада: ${storage.storageNumber}`;
            item.classList.add('btn', 'btn-primary', 'mb-2');
            item.setAttribute('data-storage-id', storage.id);
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Ошибка:', error.message || error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    NavStorageButtons();
    token123()
});
