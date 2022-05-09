function removeItem(e, itemData, x) {
    setTimeout(() => {
        e.defaultPrevented;
    }, 0)

    itemData.parentElement.remove();
    const req = new XMLHttpRequest();
    req.open("GET", '#');
    req.send(body = `${x}`)

    console.log(e)

}

document.getElementById('del-1')