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

const dragItemElems = document.querySelectorAll('.drag')

dragItemElems.forEach(() => {
    addEventListener('dragstart', (e) => {
        e.target.style.opacity = "0.3"
        e.target.style.color = "blue"
        e.dataTransfer.dropEffect = 'move'
        e.dataTransfer.setData('text/html', this.innerHTML);
        console.log(e.dataTransfer.getData('dropEffect'));
    }, false)
    addEventListener('dragenter', (e) => {
        e.target.classList.add('over')
    }, false)

    addEventListener('dragover', (e) => {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }

        e.dataTransfer.dropEffect = 'move';
    }, false)
    addEventListener('dragleave', (e) => {
        e.target.classList.remove('over')
    })
    addEventListener('dragend', (e) => {
        e.target.style.opacity = "1"
        e.target.style.color = "black"
    }, false)
})

// dragItemElems.forEach(() => {


//     })
// })
console.log(dragItemElems)