const parsedUrl= new URL (window.location.href)
const productId = parsedUrl.searchParams.get("id")
const url = "http://localhost:3000/api/products/"
const productUrl = url + productId
const addToCart = document.getElementById("addToCart")
const arrayProduct =  JSON.parse(localStorage.getItem('cart'))

function showDetails() {
    fetch(productUrl)
    .then(res => res.json())
    .then((product) => { console.log(product.imageUrl)
    let image = document.querySelector(".item__img")
    let title = document.getElementById("title")
    let price = document.getElementById("price")
    let description = document.getElementById("description")
    let color = document.getElementById("colors")

    image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    title.innerHTML = product.name
    price.innerHTML = product.price
    description.innerHTML = product.description
    
    for (i = 0; i < product.colors.length; i++){
        color.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`
    }
    })
    .catch(function (err) {
        console.log(err);
      });}
   
showDetails();

addToCart.addEventListener("click", (event) =>{
    event.preventDefault()
    const colors = document.getElementById("colors").value
    const quantity = parseInt(document.getElementById("quantity").value)
    const newItem = {
        id: productId,
        colors,
        quantity,
    };
    const item = localStorage.getItem('cart');
    let itemAlreadyExist = false;

    if (newItem.quantity >= 100) {
        newItem.quantity = 100;
    } 
    if (newItem.quantity == 0 || newItem.colors === "") {
        alert('Votre panier est incomplet, veuillez sélectionner une quantité et une couleur')
        return
    }
    if (newItem.quantity <= 0){
        newItem.quantity = 0
    }

    if (!item) return localStorage.setItem('cart', JSON.stringify([{ ...newItem }]));
    
    const newCart = JSON.parse(item).map((element) => {
        const elementSpread = { ...element };
        if (elementSpread.colors === newItem.colors && elementSpread.id === newItem.id) {
            elementSpread.quantity = elementSpread.quantity + newItem.quantity;
            if (elementSpread.quantity >= 100) {
                elementSpread.quantity = 100
            }
            if (elementSpread.quantity <= 0){
                elementSpread.quantity = 0
            }
            itemAlreadyExist = true;
        }
        return elementSpread;
    });
    
    document.location.reload();
    window.location.href = "./cart.html"

    if (!itemAlreadyExist) newCart.push({ ...newItem });
    return localStorage.setItem('cart', JSON.stringify(newCart));  
});





















// Incrémenterla quantité Décrémenter la quantité   
// Ajouter au panier
// Id du produit, le couleur et la quantité
// On veut "enregistrer" ces paramètres
// Envoyer ces paramètres à la page panier


