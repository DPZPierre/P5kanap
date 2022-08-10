
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then((product) => {
      let productPath = document.getElementById("items");

      for (i = 0; i < product.length; i++) {
        productPath.innerHTML += `
        <a href="./product.html?id=${product[i]._id}">
          <article>
            <img src="${product[i].imageUrl}" alt="${product[i].altTxt}"/>
            <h3 class="productName">${product[i].name}</h3>
            <p class="productDescription">${product[i].description}</p>
          </article>
        </a>
        `
    }})
    .catch(function (err) {
      console.log(err);
    });






