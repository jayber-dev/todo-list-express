const removeElem = document.querySelectorAll('.del-item')

// ------------------- REMOVE ITEMS FROM TODO LIST -----------------------------
function removeItem(e, itemData) {
    console.log(e)
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
        req.send(body = `content=${userValue}`)
        document.location.reload(true)
    }
})