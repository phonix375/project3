document.addEventListener('DOMContentLoaded', () => { 
    
    document.querySelector('#conform').onclick = function() {
        sendOrder();
    };
    
    
    let cl = document.querySelectorAll('.close');
    cl.forEach(function(item){
        item.onclick = function() {
            this.parentElement.style.display = 'none'
        };
    });
    
    document.querySelector('#registerBtn').onclick = function() {
        closeAllPopups();
        document.querySelector('#register').style.display = 'block';
        return false;
    }

    
    document.querySelector('#closetest').onclick = function() {
        this.parentElement.style.display = 'none';
        document.querySelector('#itemName').innerHTML = '';
        document.querySelector('#toppingsList').innerHTML = '';
        document.querySelector('#option').innerHTML = '';
    };

    const mi = document.querySelectorAll('.plus');
    mi.forEach(bt => {
        bt.onclick = function () {
            popup(bt, bt.dataset.user, bt.dataset.id);
        };
    });

    document.querySelector('#login').onclick = () => {
        document.querySelector('#loginForm').style.display = 'block';
        return false;
    };

    document.querySelector('#openLogin').onclick = function () {
        document.querySelector('#PleaseLogin').style.display = 'none';
        document.querySelector('#loginForm').style.display = 'block';
        return false;
    };

    document.querySelectorAll('.close').forEach(function(value) {
        value.addEventListener('click', function(){
            this.parentElement.style.display = 'none';
        });
    });

});





function popup(bt, user, itemId) {
    if (user == 'none'){
        let forms = document.querySelectorAll('.form-popup');
        forms.forEach(function(item){
            item.style.display = 'none'
        });
        document.querySelector('#PleaseLogin').style.display = 'block';
    }
    else {
        let form = document.querySelector('#addToOrder');
        let title = document.querySelector('#itemName');
        title.innerHTML = bt.dataset.name;
        requestTopings(bt.dataset.id);
        form.style.display = 'block';
        

    };
};

function closePopup() {
    document.querySelector('.form-popup').innerHTML = '';
    document.querySelector('.form-popup').style.display = 'none';   
};

function callBack() {
    topingsOption.forEach(function(item){
        let li = document.createElement('li');
        let y = document.createElement('input');
        let label = document.createElement('label');
        label.setAttribute('for',item);
        label.innerHTML = item;
        y,id = item;
        y.setAttribute('type','checkbox');
        y.setAttribute('class','topings1');
        y.onchange = priceCalculate;
        y.innerHTML = item;
        li.appendChild(y);
        li.appendChild(label);
        document.querySelector('#toppingsList').appendChild(li);

    });
    if(largePrice != 0) {
        let form = document.querySelector('#option')
        let select = document.createElement('select');
        select.id = 'itemOptions';
        let option1 = document.createElement('option');
        option1.setAttribute('value', itemPrice);
        option1.innerHTML = 'Small ' + itemPrice;
        option1.setAttribute('data-option','small');
        let option2 = document.createElement('option');
        option2.setAttribute('value', largePrice);
        option2.innerHTML = 'Large ' + largePrice;
        option2.setAttribute('data-option','large');
        select.appendChild(option1);
        select.appendChild(option2);
        form.appendChild(select);
        select.onchange = priceCalculate;
        priceCalculate();

    };

};


function requestTopings(itemId) {
    var csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    var parameter = 'itemId=' + itemId;
    request = new XMLHttpRequest();
    request.open('POST','gettopings'+'?' + parameter,true);
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        topingsOption = request.response.data;
        itemPrice = request.response.price;
        largePrice = request.response.large;
        callBack();
    };
};


function priceCalculate() {
    let numOfTopings = 0
    let price = 0;
    let base = parseFloat(document.querySelector('#itemOptions').value);
    topings = document.querySelectorAll('.topings1')
    let select = document.querySelector('#itemOptions');
    topings.forEach(function(item){
        if(item.checked) {
            numOfTopings+=1;
        };
    });
    if(numOfTopings == 1){
        if(select.options[select.selectedIndex].dataset.option == 'small'){
        price += 1;
        }
        else {
            price += 2;
        };
    };
    if(numOfTopings == 2){
        if(select.options[select.selectedIndex].dataset.option == 'small'){
            price += 2.5;
        }
        else {
            price += numOfTopings * 2;
        }
    };
    if(numOfTopings == 3){
        if(select.options[select.selectedIndex].dataset.option == 'small'){
            price += 3.5;
        }
        else {
            price += numOfTopings *2;
        };
    
    };
    if(numOfTopings > 3){
        if(select.options[select.selectedIndex].dataset.option == 'small'){
            price += 5.05;
        }
        else {
            price += 8;
        }
    
    };
    price += base;
    let btn = document.createElement('button');
    btn.innerHTML = 'add to my order';
    document.querySelector('#product_price').innerHTML = '';
    document.querySelector('#product_price').innerHTML += price;

};

function addToOrder() {
    let price = document.querySelector('#product_price').innerHTML;
    let item = document.querySelector('#itemName').innerHTML;
    let topings = document.querySelector('#toppingsList').getElementsByClassName('topings1');
    let topingsCheked = [];
    let option = document.querySelector('#itemOptions').options[document.querySelector('#itemOptions').selectedIndex].dataset.option;
    for(var i=0; i < topings.length; i++) {
        if(topings[i].checked){
            topingsCheked.push(topings[i].nextElementSibling.innerHTML);
        };
    };
    if (localStorage.getItem('myOrder') != null) {
        
        let myOrder = JSON.parse(localStorage.getItem('myOrder'));
        myOrder.push({'item':item,'topings':topingsCheked,'price':price, 'size':option})
        localStorage.setItem('myOrder',JSON.stringify(myOrder));
    }
    else{
        localStorage.removeItem('myOrder');
        localStorage.setItem('myOrder', JSON.stringify([{'item':item,'topings':topingsCheked,'price':price, 'size':option}]));
    };
    document.querySelector('#addToOrder').style.display = 'none';
    document.querySelector('#itemName').innerHTML = '';
    document.querySelector('#option').innerHTML = '';
    document.querySelector('#toppingsList').innerHTML = '';
    document.querySelector('#addedToOrder').style.display = 'block';
    let orderItems = JSON.parse(localStorage.getItem('myOrder'));
    document.querySelector('#numberOfItems').innerHTML = orderItems.length;

};


function myorder() {
    let orderItems = JSON.parse(localStorage.getItem('myOrder'));
    document.querySelector('#myOrderList').innerHTML ='';
    if(orderItems.length != 0){
    for(let i=0; i<orderItems.length;i++){

        let itemOrder = document.createElement('div');

        let divHeader = document.createElement('p');
        divHeader.innerHTML = orderItems[i].item + '-' + orderItems[i].size;
        itemOrder.appendChild(divHeader);


        let ditals = document.createElement('p');
        ditals.innerHTML = orderItems[i].topings + ' price: ' + orderItems[i].price;
        itemOrder.appendChild(ditals);
        let btn = document.createElement('button');
        btn.innerHTML = 'X';
        btn.setAttribute('onclick',`deleteItem(${i})`);
        itemOrder.appendChild(btn);
        let hr = document.createElement('hr');
        document.querySelector('#myOrderList').appendChild(itemOrder);
        document.querySelector('#myOrderList').appendChild(hr);
        
    };
};
    document.querySelector('#myOrder').style.display = 'block';

};

function deleteItem(i){
    console.log('deliting item ' + i);
    let orderItems = JSON.parse(localStorage.getItem('myOrder'));
    orderItems.splice(i,1);
    console.log(orderItems);
    localStorage.setItem('myOrder',JSON.stringify(orderItems));
    myorder();
    document.querySelector('#numberOfItems').innerHTML = orderItems.length;
};


function closeAllPopups() {
    let popups = document.querySelectorAll('.form-popup');
    popups.forEach(function(item){
        item.style.display = 'none';
    });
    return false;
};


function sendOrder() {
    var csrftoken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    let order = localStorage.getItem('myOrder');
    var parameter = 'order=' + order;
    request = new XMLHttpRequest();
    request.open('POST','order'+'?' + parameter,true);
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.send();
    request.onload = function() {
        console.log('send :' + request.response)
    };
};