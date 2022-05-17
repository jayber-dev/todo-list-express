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

const dragItemElems = document.querySelectorAll('.drag');
const dropContainerElem = document.querySelectorAll('.drop-box')
let dragDataElem
let targetElem

dragItemElems.forEach(() => {
    addEventListener('dragstart', (e) => {
        e.dataTransfer.dropEffect = 'move';
        e.target.style.opacity = "0.3";
        dragDataElem = e.target
        console.log(e);
    }, false)
    addEventListener('dragend', (e) => {
        const curElem = targetElem.parentElement
        e.target.style.opacity = "1"
        e.target.style.color = "black"
            // console.log(targetElem.parentElement.parentElement.parentElement)
        const toAppend = targetElem.parentElement.parentElement.parentElement
        console.log(toAppend.children[0])
        toAppend.appendchild(dragDataElem)
            // targetElem.parentElement.remove()
    }, false)
})

dropContainerElem.forEach(() => {
    addEventListener('dragover', (e) => {
        e.dataTransfer.dropEffect = 'move';
        e.preventDefault(); // Necessary. Allows us to drop.
        if (e.target.className == "container-low drop-box" || e.target.className == "todo-item dummy-item") {
            console.log(e)
            e.target.classList.add('over')
            targetElem = e.target
        }
    })
    addEventListener('dragleave', (e) => {
        e.target.classList.remove('over')
        targetElem = null
    })
})

// dragItemElems.forEach(() => {


//     })
// })
console.log(dragItemElems)