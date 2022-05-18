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
    if (e.key == "Enter") {
        let userValue = e.target.value
        const req = new XMLHttpRequest();
        req.open("post", "addItem", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(body = `content=${userValue}&priority=${e.target.high = 1}`)
        document.location.reload(true)
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
        e.target.style.color = "black"
        targetElem.classList.remove('over')
        const toAppend = targetElem.parentElement.parentElement.parentElement
        toAppend.children[1].append(dragDataElem)

        console.log(e.target.children[1].id);
        const req = new XMLHttpRequest()
        req.open("post", "priority", true)
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if (e.target.parentElement.classList == 'color-low') {
            console.log('low priority');
            req.send(body = `priority=3&id=${e.target.children[1].id}`)


        } else if (e.target.parentElement.classList == 'color-med') {
            console.log('med priority');
            req.send(body = `priority='2'&id=${e.target.children[1].id}`)

        } else if (e.target.parentElement.classList == 'color-high') {
            console.log('high priority');
            req.send(body = `priority=1&id=${e.target.children[1].id}`)

        }

    }, true)
})

dropContainerElem.forEach(() => {
    addEventListener('dragover', (e) => {
        e.stopImmediatePropagation()
        console.log(e);
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