var lenta = [];
var ukazka = 0;
var timer;
var size=39;
function render_lenta(a, b) {
    let html = ``;
    for (let i = a; i <= b; i++){
        html +=`<div class="cel ${lenta[i].mark ? 'mark':''} ${ i == ukazka ? 'active':''}" data-id="${i}"></div>`
    }
    $('.tape').html(html);
}
function init() {
    lenta = [];
    for (let i = 0; i <= size; i++){
        lenta.push ({
            mark: false}
        )
    }
}
function add_command(){
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
function execute(n) {
    let command=$(`.item:eq(${n})`);
    if(!command){
        return {
            'status':false,
            'message':`Ошибка. Команда ${n} не найдена`
        }
    }
    $('.run').removeClass ('run');
    command.addClass('run');
    let make = command.find('select').val();
    let num=command.find('.number_command').val();
    switch (make) {
        case '<': {
		if (ukazka>0)
		ukazka--;
            render_lenta(0, size);
        break;};
        case '>': {
		if (ukazka<size)
		ukazka++;

            render_lenta(0, size);
        break;};
        case'!':return true;
        case'V':
            if(lenta[ukazka].mark){
                return {
                    'status':false,
                    'message':`Ошибка в команде ${n}. Указатель уже стоит`
                }
            }
            lenta[ukazka].mark=true;
        render_lenta(0,size);
        break;
        case 'X':
            if(!lenta[ukazka].mark){
            return {
                'status':false,
                'message':`Ошибка в команде ${n}. Указателя нет`
            }
        }
            lenta[ukazka].mark=false;
            render_lenta(0,size);
            break;
        case '?':
            let  wars=command.find('.number_command').val().toString().split('.');
		//console.log(toString(command.find('.number_command').val()));
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
    setTimeout(execute, $('.speed').val(),num);
}

$(function () {

   init();
   ukazka = lenta.length / 2;
   render_lenta(0, lenta.length - 1);
   $('.tape').on('click', '.cel', function (e) {
       let id= $(e.currentTarget).data('id');
   lenta[id].mark=!lenta[id].mark;
   render_lenta(0, size);
   });
    $('.button.left').on('click', function (e) {
        if (ukazka>0)
        ukazka--;
        render_lenta(0, size);
    });
    $('.button.right').on('click', function (e) {
        if (ukazka<size)
        ukazka++;
        render_lenta(0, size);
    });
    $('.commands').on('click', '.item:last', function(e){add_command()});
    $('.button.start').on('click', function (e) {
        (execute(1));
    });
    $('.button.save').on('click', function (e) {
       $.cookie('save',$('.command').html());
    });
    $('.button.load').on('click', function (e) {
        $('.command').html(  $.cookie('save'));
    })
});
