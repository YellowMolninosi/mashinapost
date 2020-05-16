var lenta = [];//массив в котором хранятся данные ленты
var ukazka = 0;// индекс ячейки на котором находится указатель
var size=39;// кол-во ячеек в ленте
var Timer;//Переменная для остановки программы'
var speed=750;//скорость исполнения команд
function render_lenta(a, b) {//функция которая рисует заданный участок ленты
    let html = ``;
    for (let i = a; i <= b; i++){
        if(lenta[i]===undefined){
            lenta[i]={
                mark: false};
        }
        html +=`<div class="cel ${lenta[i].mark ? 'mark':''} ${ i == ukazka ? 'active':''}" data-id="${i}"></div>`
    }
    $('.tape').html(html);
}
function init() {// функция которая обнуляет ленту
    lenta = [];
    for (let i = 0; i <= size; i++){
        lenta.push ({
            mark: false}
        )
    }
}
function add_command(){//функция которая добавляет новую команду 
    let html = ``;
    html +=`<div class="item">
        <div class="number"></div>
        <div class="command"><select>
            <option value="<"><-</option>
            <option value=">">-></option>
            <option value="V">V</option>
            <option value="?">?</option>
            <option value="X">X</option>
            <option value="!">!</option></select></div>
       <input type="number" class="number_command" min="1"></input>
        <div class="comment" contenteditable="true"></div>
    </div>`;
    $('.commands').append(html);
}
function execute(n) {//функция которая выполняет команду и запускает на выполнение следующую команду
    let command=$(`.item:eq(${n})`);//получаем команду под номером N
    if(!command){//проверяется существование команды 
        return {
            'status':false,
            'message':`Ошибка. Команда ${n} не найдена`
        }
    }
    $('.run').removeClass ('run');
    command.addClass('run');//подсвечиваем команду которую выполняем
    let make = command.find('select').val();//получение значения команды
    let num=command.find('.number_command').val();//получаем номер следующей команды
    switch (make) {
        case '<': {//если команда-шаг влево

            ukazka--;
            render_lenta(ukazka-20, ukazka+20);
            break;};
        case '>': {//если команда -шаг вправо

            ukazka++;
            render_lenta(ukazka-20, ukazka+20);
            break;};
        case'!':return true;//если команда -остановка
        case'V'://если команда -установить метку
            if(lenta[ukazka].mark){// проверка существования метки
                return {
                    'status':false,
                    'message':`Ошибка в команде ${n}. Указатель уже стоит`
                }
            }
            lenta[ukazka].mark=true;
            render_lenta(ukazka-20, ukazka+20);
            break;
        case 'X'://если команда- удалить метку
            if(!lenta[ukazka].mark){//проверка существования метки
                return {
                    'status':false,
                    'message':`Ошибка в команде ${n}. Указателя нет`
                }
            }
            lenta[ukazka].mark=false;
            render_lenta(ukazka-20, ukazka+20);
            break;
        case '?'://если команда-условие
            let  wars=command.find('.number_command').val().toString().split('.');
            if (lenta[ukazka].mark){
                num=wars[1];
            }else {
                num=wars[0];
            }
    }
    if(num===''){
        return {
            'status':false,
            'message':`Ошибка в команде ${n}. Отсутствует ссылка на следущую команду`
        }
    }

    Timer= setTimeout(execute, speed,num);//Отсроченный запуск следующей команды
}
function tohtml() {
    $(".commands .item").each(function (index,element){
        if (index==0) return;
        element=$(element.currentTarget)
        let command=$(element).find(".command select").val();
        console.log(command);
        let comment=$(element).find(".comment ").html();
        let number_command=$(element).find(".number_command").val();
        let html = ``;
        html +=`
        <div class="number"></div>
        <div class="command"><select>
            <option value="<" ${command=="<"?"selected":""}><-</option>
            <option value=">" ${command==">"?"selected":""}>-></option>
            <option value="V" ${command=="V"?"selected":""}>V</option>
            <option value="?" ${command=="?"?"selected":""}>?</option>
            <option value="X" ${command=="X"?"selected":""}>X</option>
            <option value="!" ${command=="!"?"selected":""}>!</option></select></div>
       <input type="number" class="number_command" value=${number_command} min="1"></input>
        <div class="comment" contenteditable="true">${comment}</div>
    `;
        $(element).html(html);
    })
    let jsonlenta=JSON.stringify(lenta);
    let js=`lenta=$.parseJSON('${jsonlenta}');
    render_lenta(${ukazka-20},${ukazka+20});console.log("gg")`;
    $(".machine").append(`<script>${js}</script>`);
}

$(function () {//jQvery функция выполняющаяся после полной загрузки страницы

    // init();//опустошает ленту
    ukazka = 0 ;//ставим указку в середину ленты
    render_lenta(ukazka-20, ukazka+20);//рисует ленту
    $('.tape').on('click', '.cel', function (e) {//вешаем событие на клик по ячейке ленты для установки/удаления метки
        let id= $(e.currentTarget).data('id');
        lenta[id].mark=!lenta[id].mark;
        render_lenta(ukazka-20, ukazka+20);
    });
    $('.btn.left').on('click', function (e) {//вешаем событие на клик по кнопке для смещения указателя влево
        //if (ukazka>0)
        ukazka--;
        render_lenta( ukazka-20, ukazka+20);
    });
    $('.btn.right').on('click', function (e) {//вешаем событие на клик по кнопке для смещения указателя вправо
        // if (ukazka<size)
        ukazka++;
        render_lenta( ukazka-20, ukazka+20);
    });
    $('.commands').on('click', '.item:last', function(e){add_command()});//вешаем событие на клик по последней команде для добавление новой
    $('.btn.start').on('click', function (e) {//событие клика по кнопке старт
        (execute(1));
    });
    $('.btn.stop').on('click', function (e) {//событие клика по кнопке старт
        clearInterval(Timer);
    });
    $('.btn.speed .hover_menu div').on('click', function (e) {//событие клика по кнопке старт
        speed=$(e.currentTarget).data("speed");
        $(".hover_menu .activ").removeClass("activ");
        $(e.currentTarget).addClass("activ");
    });
    $('.res_lenta').on('click', function (e) {//событие клика по кнопке сброс ленты
        lenta=[];
        ukazka=0;
        render_lenta(ukazka-20, ukazka+20);
        clearInterval(Timer);
    });
    $('.res_comand').on('click', function (e) {//событие клика по кнопке сброс команд
        $('.commands').html('<div class="item"><div class="number">Номер</div><div class="command">Команда</div><div class="number_command">Отсылка</div><div class="comment">Комментарий</div></div>');
        add_command();
        add_command();
        add_command();
        add_command();
        add_command();
        clearInterval(Timer);
    });
    $('.res_vsu').on('click', function (e) {//событие клика по кнопке сброс всего
        lenta=[];
        ukazka=0;
        render_lenta(ukazka-20, ukazka+20);
        $('.commands').html('<div class="item"><div class="number">Номер</div><div class="command">Команда</div><div class="number_command">Отсылка</div><div class="comment">Комментарий</div></div>');
        add_command();
        add_command();
        add_command();
        add_command();
        add_command();
        clearInterval(Timer);
    });
    $('.btn.save').on('click', function (e) {
        tohtml();
        console.log("ff");
        var text = $("html").html(),
            blob = new Blob([text], { type: 'text/plain' }),
            anchor = document.createElement('a');

        anchor.download = "hello.html";
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();
    });

});

