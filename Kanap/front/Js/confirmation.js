function confirmation() {
    const params = (new URL(document.location)).searchParams;
    const id = params.get("orderId")
    orderId.innerHTML = id;
}
confirmation();