function removeItem(e, itemData, x) {
    setTimeout(() => {
        e.defaultPrevented;
    }, 0)

    itemData.parentElement.remove();
    const req = new XMLHttpRequest();
    req.open("POST", '/handle', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(body = `itemId=${x}`)

    console.log(e)

}

document.getElementById('del-1')