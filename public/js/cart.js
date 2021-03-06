const cart = document.getElementById("cart");
const recept = document.getElementById("recept-container")
const overlay = document.querySelector("#overlay")
const popCard = document.getElementById('pop-container')
const allFirstRadio = document.querySelectorAll(".firstRadio")
const popQty = document.querySelector('.pop-qty-input')
const description = document.querySelector('#description-input')
const receptOrder = document.getElementById("recept")
let popName = document.querySelector('#orderName')
let price;

//Functions
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

function disableScrolling(){
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
    window.onscroll=function(){};
}

function outOfCart() {
    cart.style.visibility = "visible";
    enableScrolling();
    overlay.style.visibility = "hidden";
    recept.style.bottom = "-100%"
}
function showCard() {
    popCard.style.visibility = "visible";
    popCard.style.top = '50%'
    popCard.style.opacity = '1'
    overlay.style.visibility = "visible";
}
function unshowCard() {
    popCard.style.visibility = "hidden";
    popCard.style.top = '60%'
    popCard.style.opacity = '0'
    overlay.style.visibility = "hidden";
}

function resetPopCard() {
    allFirstRadio.forEach(radio => radio.checked = true)
    document.querySelectorAll('input[type=checkbox]').forEach(el => {
        if (el.checked) {el.checked = false};
    });
    popQty.value = 1;
    description.value = ""
    unshowCard()
}

function updateCart() {
    let orders = Object.keys(sessionStorage)
    receptOrder.innerHTML = ""
    orders.forEach(function (order) {
        if (order != "IsThisFirstTime_Log_From_LiveServer") {
            let orderOri = order
            QTY = sessionStorage.getItem(order)
            order = JSON.parse(order)
            receptOrder.innerHTML += `<div class="order" data-foodName="${orderOri.replaceAll("\"", "'")}">
                <img class="order-img" src="./images/??????????????????.png" alt="${order.name}">
                <h4 class="order-name">${order.name}<span class="extras">${order.extras.length > 2 ? "(" : ""}${order.extras.slice(order.extras.indexOf("[")+ 1, order.extras.indexOf("]"))}${order.extras.length > 2 ? ")" : ""}</span></h4>
                <h4 class="order-price">${parseInt(order.price) * parseInt(QTY)}???</h4>
                <div class="order-qty" data-price="${order.price}"><label class="qty">qty: </label><input onclick="updateQTY(this)" min="1" step="1" oninput="validity.valid||(value='');" style="padding-left: .5em;" class="qty" id="qty" type="number" value="${QTY}"></div>
                <h4 onclick="deleteOrder(this)" class="order-delete"><svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 0 24 24" width="1.2em" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM9 9h6c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1v-8c0-.55.45-1 1-1zm6.5-5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1h-2.5z"/></svg> ?????????</h4>
            </div>`
        }
    })
}
function deleteOrder(e) {
    sessionStorage.removeItem(e.parentElement.getAttribute('data-foodName').replaceAll("'", "\""))
    e.parentElement.remove()
    if (removeItemOnce(Object.keys(sessionStorage), "IsThisFirstTime_Log_From_LiveServer").length == 0) {
        outOfCart();
        cart.style.visibility = "hidden"
    }
}
function updateQTY(e) {
    e.addEventListener('blur', function () {
        sessionStorage.setItem(e.parentElement.parentElement.getAttribute('data-foodName').replaceAll("'", "\""), e.value)
        e.parentElement.parentElement.querySelector('.order-price').innerHTML = `${e.parentElement.getAttribute("data-price") * e.value}$`
    })
}


// Loops
for (let food of document.querySelectorAll(".specific-food")) {
    food.addEventListener("click", function () {
        popName.innerHTML = food.querySelector('.food-name').innerHTML;
        price = food.getAttribute('data-price');
        document.querySelector('#extras-div').innerHTML = ""
        food.getAttribute('data-category').split(' ').forEach(category => {
            const categoryOBJ = categoryData[category]
            let options = ''
            categoryOBJ['options'].forEach(option => {
                options += `<label for="${option}"><input type="${categoryOBJ['type']}" id="${option}" name="${category}" class="choiceBtn">${option}</label>`
            })
            document.querySelector('#extras-div').innerHTML +=`<div class="extra"><h4>${category}</h4>${options}</div>`
        })
        showCard()
    })
}

//Event Listener
removeItemOnce(Object.keys(sessionStorage), "IsThisFirstTime_Log_From_LiveServer").length == 0 ? cart.style.visibility = "hidden" : cart.style.visibility = "visible";
cart.addEventListener("click", function () {
    cart.style.visibility = "hidden"
    disableScrolling()
    overlay.style.visibility = "visible"
    recept.style.bottom = "0"
    updateCart()
})
document.getElementById("cross").addEventListener("click", outOfCart)
overlay.addEventListener("click", function () {
    outOfCart();
    unshowCard();
})
document.getElementById('pop-cross').addEventListener("click", function () {
    resetPopCard();
    unshowCard();
})

document.getElementById("addCartBtn").addEventListener('click', function () {
    var allExtras = [];

    // radios
    document.querySelectorAll('input[type=radio]').forEach(function (theRadio) {
        if (theRadio.checked) {
            allExtras.push(theRadio.getAttribute('id'));
        }
    })

    // checkboxes
    document.querySelectorAll('input[type=checkbox]').forEach(function (theCheckbox) {
        if (theCheckbox.checked) {
            allExtras.push(theCheckbox.getAttribute('id'));
        }
    });
    value = `{"name": "${popName.innerHTML}","price":"${price}", "extras": "${"[" + allExtras + "]"}", "description": "${description.value.replace(/\n/g, "_ ")}"}`
    if (sessionStorage.getItem(value)) { popQty.value = parseInt(sessionStorage.getItem(value)) + parseInt(popQty.value) }
    sessionStorage.setItem(value, popQty.value)
    sessionStorage == [] ? cart.style.visibility = "hidden" : cart.style.visibility = "visible"
    resetPopCard()
})



