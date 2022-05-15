const removeElem = document.querySelectorAll('.del-item')


console.log(removeElem)

function removeItem(e, itemData, x) {


    itemData.parentElement.remove();
    const req = new XMLHttpRequest();
    req.open("POST", '/handle', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(body = `itemId=${x}`)

    console.log(e)

}

document.getElementById('iteminput').addEventListener('keyup', (e) => {
    console.log(e)
    if (e.key == "Enter") {
        let userValue = e.target.value
        e.target.value = ""
        const req = new XMLHttpRequest();
        req.open("post", "addItem", true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(body = `content=${userValue}`)
        e.target.value = ""

    }
})
document.getElementById('del-1')