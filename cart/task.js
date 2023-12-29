const products = document.querySelectorAll('.product');
const cartBlock = document.querySelector('.cart')
const cart = document.querySelector('.cart__products');

let cartListIds = JSON.parse(localStorage.getItem('cart'));
// Если корзины в локальном хранилище нет - создаю
if (!cartListIds) {
    cartListIds = [];
// иначе заполняю корзину товарами из локального хранилища
} else {
    cartListIds.forEach(elem => {
        createProductCartCard(elem.id, elem.image, elem.count);
    })
}

async function movePicture(image1, image2) {
    const moveImage = async (image, targetImage) => {
        const img = image.cloneNode(false);
        img.classList.remove('product__image');
        img.classList.add('moved-image');

        let x = image.getBoundingClientRect().x;
        let y = image.getBoundingClientRect().y;

        const targetX = targetImage.getBoundingClientRect().x;
        const targetY = targetImage.getBoundingClientRect().y;

        const dx = x - targetX;
        const dy = y - targetY;

        const animationInterval = 20;

        let i = 0;
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        document.body.appendChild(img);

        const movePromise = new Promise(resolve => {
            const animate = () => {
                i += 1;
                x = (x - (dx * i / animationInterval)).toFixed(0);
                y = (y - (dy * i / animationInterval)).toFixed(0);
                img.style.left = x + 'px';
                img.style.top = y + 'px';
            };

            const index = setInterval(() => {
                animate();
                if ((parseInt(img.style.left) >= targetX) && (parseInt(img.style.top) <= targetY)) {
                    clearInterval(index);
                    img.remove();
                    resolve(); // Разрешаем обещание по завершении анимации
                }
            }, 100);
        });

        await movePromise;
    };

    await moveImage(image1, image2);
}


function createProductCartCard(dataId, image, count) {
    if (cartListIds) {
        cartBlock.classList.add('cart-visible');
    }
    const cartProduct = document.createElement('div');
    cartProduct.classList.add('cart__product');
    cartProduct.setAttribute('data-id', dataId);

    const cartProductImage = document.createElement('img');
    cartProductImage.classList.add('cart__product-image');
    cartProductImage.src = image;

    const cartProductCount = document.createElement('div');
    cartProductCount.classList.add('cart__product-count');
    cartProductCount.textContent = count;

    const cartProductrRemove = document.createElement('div');
    cartProductrRemove.classList.add('cart__product-remove');

    cartProduct.appendChild(cartProductImage);
    cartProduct.appendChild(cartProductCount);
    cartProduct.appendChild(cartProductrRemove);

    cartProductrRemove.addEventListener('click', () => {
        cartProduct.remove();

        cartListIds = JSON.parse(localStorage.getItem('cart'));
        indexToDelete = cartListIds.findIndex(elem => elem.id === dataId);
        if (indexToDelete !== -1) {
            cartListIds.splice(indexToDelete, 1);
            localStorage.setItem('cart', JSON.stringify(cartListIds));
        }

        // Если корзина пустая удаляю ее отображение
        if (cartListIds.length === 0) {
            cartBlock.classList.remove('cart-visible');
        }
    });

    cart.appendChild(cartProduct);

    return cartProductImage;
}

function addToCart(dataId, image, count) {
    // добавляю товар в локальное хранилище
    let item = {
        'id': dataId,
        'image': image,
        'count': parseInt(count)
    };

    cartListIds.push(item);
    // обвновляю корзину в локальном хранилище
    localStorage.setItem('cart', JSON.stringify(cartListIds));

    const newPosImage = createProductCartCard(dataId, image, count);
    return newPosImage;
}

function changeQuantity(dataId, count) {
    const cartProduct = cart.querySelector(`[data-id="${dataId}"]`);

    const cartProductCount = cartProduct.querySelector('.cart__product-count');

    cartProductCount.textContent = parseInt(cartProductCount.textContent) + parseInt(count);

    // получаю индекс объекта товара
    indexObj = cartListIds.findIndex(elem => elem.id === dataId);
    // увеличиваю количество товара
    cartListIds[indexObj].count = parseInt(cartProductCount.textContent);
    // обновляю локальное хранилище
    localStorage.setItem('cart', JSON.stringify(cartListIds));

    return cartProduct.querySelector('img');
}

products.forEach((product) => {
    const quantity = product.querySelector('.product__quantity-value');
    const quantityPlus = product.querySelector('.product__quantity-control_inc');
    const quantityMinus = product.querySelector('.product__quantity-control_dec');
    const btnAddToCart = product.querySelector('.product__add');

    quantityPlus.addEventListener('click', () => {
        quantity.textContent = parseInt(quantity.textContent) + 1;
    })

    quantityMinus.addEventListener('click', () => {
        if (parseInt(quantity.textContent) > 0) {
            quantity.textContent = parseInt(quantity.textContent) - 1;
        }
    })

    btnAddToCart.addEventListener('click', (e) => {
        e.preventDefault();
        const dataId = product.getAttribute('data-id');
        const image = product.querySelector('img')
        const imageUrl = image.src;
        const count = quantity.textContent;
        // получаю индекс товара в локальном храналище
        index = cartListIds.findIndex(elem => elem.id === dataId);
        let newPosImage;
        if (index !== -1) {
            newPosImage = changeQuantity(dataId, count);
        } else {
            newPosImage = addToCart(dataId, imageUrl, count);
        }
        
        movePicture(image, newPosImage)
    })
})