const removeElem = document.querySelectorAll('.del-item')

// ------------------- REMOVE ITEMS FROM TODO LIST -----------------------------
function removeItem(e, itemData) {
    itemData.parentElement.remove();
    const req = new XMLHttpRequest();
    req.open("POST", '/handle', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(body = `itemId=${e.target.id}`)
}

// ------------------ ADD ITEM TO LIST ---------------------------------------
document.getElementById('iteminput').addEventListener('keyup', (e) => {
    const addItem = document.querySelector('.color-high')
    const clearInput = document.getElementById('iteminput')
    if (e.key == "Enter") {
        let itemIdString = "";
        itemIdString = String(itemIdString += Math.random() * 90)
        const user_id = document.getElementsByClassName('header')
        let userValue = e.target.value
        const req = new XMLHttpRequest();
        req.open("post", "/addItem", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(body = `itemId=${itemIdString}&content=${userValue}&priority=${e.target.high = 1}&user_id=${user_id[0].getAttribute('data')}`)
            // document.location.reload(true)
        addItem.innerHTML += `<div class="container-high drag" draggable="true">
                                  <p class="todo-item">${e.target.value}</p>
                                  <p class="del-item" id="${itemIdString}" onclick="removeItem(event,this)">x</p>
                                   </div>`
        clearInput.value = ""
    }
})

// ------------------ DRAG AND DROP HANDLER ----------------------------------
const dragItemElems = document.querySelectorAll('.drag');
const dropContainerElem = document.querySelectorAll('.drop-box')
let dragDataElem
let targetElem

dragItemElems.forEach(() => {
    addEventListener('dragstart', (e) => {
        e.dataTransfer.dropEffect = 'move';
        // e.target.style.opacity = "0.3";
        dragDataElem = e.target
    }, false)

    // handling all the changes for the dragend + ajax call handler for priority changes 

    addEventListener('dragend', (e) => {
        e.stopImmediatePropagation()
            // const curElem = targetElem.parentElement

        e.target.style.opacity = "1"
        targetElem.classList.remove('over')
        const toAppend = targetElem.parentElement.parentElement.parentElement
        toAppend.children[1].append(dragDataElem)
        const req = new XMLHttpRequest()

        req.open("post", "priority", true)
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if (e.target.parentElement.classList == 'color-low') {
            req.send(body = `priority=3&itemId=${e.target.children[1].id}`)
        } else if (e.target.parentElement.classList == 'color-med') {
            req.send(body = `priority=2&itemId=${e.target.children[1].id}`)
        } else if (e.target.parentElement.classList == 'color-high') {
            req.send(body = `priority=1&itemId=${e.target.children[1].id}`)
        }
    }, true)
})

dropContainerElem.forEach(() => {
    addEventListener('dragover', (e) => {
        e.stopImmediatePropagation()
        e.dataTransfer.dropEffect = 'move';
        e.preventDefault();
        if (e.target.className == "container-low drop-box" || e.target.className == "todo-item dummy-item") {
            e.target.classList.add('over')
            targetElem = e.target
        }
    })
    addEventListener('dragleave', (e) => {
        e.target.classList.remove('over')
        targetElem = null
    })
})