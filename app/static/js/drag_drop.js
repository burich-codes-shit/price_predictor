// Coздаем обработчик события полной загрузки документа,
// внутри которого выполняется анонимная функция, цепляющая элемент из html
document.addEventListener('DOMContentLoaded', function(){
    const dropArea = document.getElementById('drag_drop_area_id');


// Для каждого элемента из списка, который обозначает действие с файлом применяется функция,
// которая отключает стандратное поведение браузера по типу (открыть файл при перетаскивании)
// Далее мы сможем обрабатывать данные события зная, что данные функции к ним уже применены
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, function(e){
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

// Подсветка области при наведении
dropArea.addEventListener('dragenter', () => {
    dropArea.classList.add('hover');
});

dropArea.addEventListener('dragover', () => {
    dropArea.classList.add('hover');
});

// Убираем подсветку, когда объект покидает область
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover');
});

// Убираем подсветку после того, как объект был отпущен
dropArea.addEventListener('drop', () => {
    dropArea.classList.remove('hover');
});

dropArea.addEventListener('drop', function(e){
    const file = e.dataTransfer.files;
    const display_elem = document.getElementById('result')
    display_elem.innerHTML = '>> Checking file<br><br>'
    if(file[0].type != 'text/csv'){
        display_elem.innerHTML = 'File Type is incorrect'
        return;
    }
    display_elem.innerHTML += '>> File TYPE: ' + file[0].type + '<br><br>'

    display_elem.innerHTML += '>> File name: ' + file[0].name + '<br><br>'
    display_elem.innerHTML += '>> File size: ' + file[0].size + 'bytes<br><br>'

    uploadFile(file[0])

}, false);


function uploadFile(file) {
    const url = '/uploading_file'; // Замените на URL вашего сервера
    const formData = new FormData();
    formData.append('file', file); // Добавляем файл в FormData

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Файл успешно загружен:', data);
        alert('Файл успешно загружен!');
    })
    .catch(error => {
        console.error('Ошибка при загрузке файла:', error);
        alert('Ошибка при загрузке файла.');
    });
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const resultToHTML = document.getElementById('result');

    try {
        const response = await fetch('/uploading_file', {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        // Проверяем, массив ли это
        let predictions = Array.isArray(data.file) ? data.file : data.file.split(",");

        // Очищаем старый вывод
        resultToHTML.innerHTML = '';

        // Красиво форматируем каждую строку
        predictions.forEach(line => {
            resultToHTML.innerHTML += `>> ${line.trim()}<br>`;
        });

        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

});

