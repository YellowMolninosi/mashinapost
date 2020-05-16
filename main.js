var lenta = [];//массив в котором хранятся данные ленты
var ukazka = 0;// индекс ячейки на котором находится указатель
var size=39;// кол-во ячеек в ленте
var Timer;//Переменная для остановки программы
function render_lenta(a, b) {//функция которая рисует заданный участок ленты
    let html = ``;
    for (let i = a; i <= b; i++){
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
		if (ukazka>0)
		ukazka--;
            render_lenta(0, size);
        break;};
        case '>': {//если команда -шаг вправо
		if (ukazka<size)
		ukazka++;
            render_lenta(0, size);
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
        render_lenta(0,size);
        break;
        case 'X'://если команда- удалить метку
            if(!lenta[ukazka].mark){//проверка существования метки
            return {
                'status':false,
                'message':`Ошибка в команде ${n}. Указателя нет`
            }
        }
            lenta[ukazka].mark=false;
            render_lenta(0,size);
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

   Timer= setTimeout(execute, $('.speed').val(),num);//Отсроченный запуск следующей команды
}

$(function () {//jQvery функция выполняющаяся после полной загрузки страницы

   init();//опустошает ленту
   ukazka = lenta.length / 2;//ставим указку в середину ленты
   render_lenta(0, lenta.length - 1);//рисует ленту
   $('.tape').on('click', '.cel', function (e) {//вешаем событие на клик по ячейке ленты для установки/удаления метки
       let id= $(e.currentTarget).data('id');
   lenta[id].mark=!lenta[id].mark;
   render_lenta(0, size);
   });
    $('.button.left').on('click', function (e) {//вешаем событие на клик по кнопке для смещения указателя влево
        if (ukazka>0)
        ukazka--;
        render_lenta(0, size);
    });
    $('.button.right').on('click', function (e) {//вешаем событие на клик по кнопке для смещения указателя вправо
        if (ukazka<size)
        ukazka++;
        render_lenta(0, size);
    });
    $('.commands').on('click', '.item:last', function(e){add_command()});//вешаем событие на клик по последней команде для добавление новой
    $('.button.start').on('click', function (e) {//событие клика по кнопке старт
        (execute(1));
    });
    $('.button.stop').on('click', function (e) {//событие клика по кнопке старт
        clearInterval(Timer);
    });
});
