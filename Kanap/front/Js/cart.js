async function getCartInLocalStorage() {
  const product = await getAllProductsApi();
  const arrayLocalStorage = JSON.parse(localStorage.getItem("cart"));
  return arrayLocalStorage.map((element) => {
    const newElement = { ...element };
    const productIndex = product.findIndex(
      (item) => item._id === newElement.id
    );
    newElement.price = product[productIndex].price;
    newElement.image = product[productIndex].imageUrl;
    newElement.altTxt = product[productIndex].altTxt;
    newElement.name = product[productIndex].name;
    return newElement;
  });
}

function renderItems(items) {
  const cartItems = document.getElementById("cart__items");
  cartItems.innerHTML = '';

  items.forEach((item) => {
    const article = document.createElement("article");
    article.setAttribute("class", "cart__item");
    article.setAttribute("data-id", item.id);
    article.setAttribute("data-color", item.colors);
    article.innerHTML = `
      <div class="cart__item__img">
          <img src="${item.image}" alt="${item.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.colors}</p>
          <p>${item.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>`;

    cartItems.appendChild(article);
  });

  priceAmount(items);
  renderTotalArticles(items);
}

async function getAllProductsApi() {
  try {
    const url = "http://localhost:3000/api/products/";
    const allProducts = await fetch(url);
    const products = await allProducts.json();
    return products;
  } catch (error) {
    console.error(error.message);
  }
}

function priceAmount(itemsInLocalStorage) {
  const totalPrice = document.getElementById("totalPrice");
  totalPrice.innerHTML = itemsInLocalStorage
    .map((element) => element.quantity * element.price)
    .reduce((prev, next) => {
      return prev + next;
    }, 0);
}

function renderTotalArticles(itemsInLocalStorage) {
  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerHTML = itemsInLocalStorage
    .map((element) => element.quantity)
    .reduce((prev, next) => {
      return prev + next;
    }, 0);
}

(async () => {
  try {
    const itemsParsed = await getCartInLocalStorage();
    renderItems([...itemsParsed]);
    await detectQuantityChange(".itemQuantity");
    await detectDeleteItem(".deleteItem");
    await submitForm();
  } catch (error) {
    console.error(error.message);
  }
})();

async function detectQuantityChange(classElement) {
  document.querySelectorAll(classElement).forEach((quantityBtn) => {
    quantityBtn.addEventListener("change", async (e) => {
      const id = e.target.closest(".cart__item").dataset.id;
      const color = e.target.closest(".cart__item").dataset.color;
      let newQuantity = quantityBtn.value;
      const newCart = (await getCartInLocalStorage()).map((element) => {
        const newItem = { ...element };
        if (newItem.id === id && newItem.colors === color) {
          newItem.quantity = parseInt(newQuantity);
        }
        return newItem;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      priceAmount(newCart);
      renderTotalArticles(newCart);
    });
  });
}

async function detectDeleteItem(classElement) {
  document.querySelectorAll(classElement).forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", async (e) => {
      const itemId = e.target.closest(".cart__item").dataset.id;
      const itemColor = e.target.closest(".cart__item").dataset.color;
      const deleteCart = (await getCartInLocalStorage()).filter((element) => {
        if (element.id !== itemId && element.colors !== itemColor) {
          return true;
        }
      });
      localStorage.setItem("cart", JSON.stringify(deleteCart));
      priceAmount(deleteCart);
      renderTotalArticles(deleteCart);
      renderItems(deleteCart);
    });
  });
}

// REGEX

function submitForm() {
  const order = document.getElementById("order");

  function validateForm(inputValue, elementErrorId) { 
    const regexName = /^[a-z][a-z '-.,]{2,40}$|^$/i;
    const inputValueErrorMsg = document.getElementById(elementErrorId);  
    if (regexName.test(inputValue) === false){ 
      inputValueErrorMsg.innerHTML =
              "Saisie invalide, veuillez remplir ce champ avec uniquement des lettres (minimum 2 et maximum 40)";
      return false;
      
    } 
    if (!inputValue.length) { 
      inputValueErrorMsg.innerHTML =
      "Saisie invalide, veuillez remplir ce champ";
      return false;
    } 
    return true;
  };
  
  order.addEventListener("click", async (e) => {
    e.preventDefault();
    const firstNameValue = document.getElementById("firstName");
    const lastNameValue = document.getElementById("lastName");
    const addressValue = document.getElementById("address");
    const cityValue = document.getElementById("city");
    const emailValue = document.getElementById("email");
   
    if (
      !validateForm(firstNameValue.value, 'firstNameErrorMsg') ||
      !validateForm(lastNameValue.value, 'lastNameErrorMsg' ) || 
      !validateForm(cityValue.value, 'cityErrorMsg') 
    ) return false
    
    if (/^[a-zA-Z0-9\s]+[a-zA-Z]+[a-zA-Z]$/g.test(addressValue.value) === false) {
      addressErrorMsg.innerHTML =
      "Saisie invalide, ce champ doit contenir un numéro et une rue/avenue/chemin etc";
      return false;
    }
     if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(emailValue.value) === false){
      emailErrorMsg.innerHTML = "Entrez une adresse e-mail valide. L'adresse mail doit comporter un @";
      return false;
     }
      
    const productArray = (await getCartInLocalStorage()).map((element) => element.id);
    console.log(productArray) 

    const orderData = {
      contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
      
    },
    products : productArray,
    
  }

    const getOrderId = await fetch ("http://localhost:3000/api/products/order", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(orderData),
    });
    const result = await getOrderId.json()
    const orderId = result.orderId
    console.log(orderId)        
       console.log(result)
        document.location.href = 'confirmation.html?orderId='+ orderId
  }); 
};

