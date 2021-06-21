$(document).ready(() => {
    let form = $("#messageForm");
    let messageContainer = $("#messageContainer");
    // по-хорошему надо читать данные авторизации из скрытого файла

    form.submit((event) => {
        // мешаем стандартному поведению при сабмите формы
        event.preventDefault();

        // очищаем контейнер
        messageContainer.html("");

        // считываем введенные логин и пароль
        let login = $("#login").val();
        let password = $("#password").val();


        // вытягиваем из данных формы номер запроса
        let queryKey = form.serializeArray().filter(
            entry => entry.name === "queryKey"
            )[0].value;
        
        
        // выполняем запрос к серверу
        (async () => {
            // авторизуемся
            let authResp = await $.ajax({
                url: `https://chat-test.treolan.ru/api/Chat/Login?Login=${login}&Password=${password}`});
            let token = authResp.Token;
            
            // получаем ID чата
            let chatIdResp = await $.ajax({
                url: `https://chat-test.treolan.ru/api/ChatExt/GetChat?queryKey=${queryKey}`,
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
            });
            let chatId = chatIdResp.Id;

            // получаем список сообщений
            let messages = await  $.ajax({
                url: `https://chat-test.treolan.ru/api/Chat/GetMessages?ChatId=${chatId}`,
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }});
            
            // выводим список сообщений на UI
            messages.forEach(message => {
                messageContainer.append(`<p>${message.Author.Name}: ${message.Message}<p>`);
            });
        })();
    })

});