document.addEventListener('DOMContentLoaded', function() {
    // --- DATA (Pengganti Database) ---
    const drinks = [
        { id: 1, name: 'Cappuccino', price: 25000, image: 'https://cdn.pixabay.com/photo/2018/01/31/09/57/coffee-3120750_1280.jpg' },
        { id: 2, name: 'Latte', price: 28000, image: 'https://cdn.pixabay.com/photo/2020/03/07/05/18/coffee-4908764_1280.jpg' },
        { id: 3, name: 'Americano', price: 22000, image: 'https://cdn.pixabay.com/photo/2022/04/05/07/46/iced-coffee-7113044_1280.jpg' },
        { id: 4, name: 'Espresso', price: 18000, image: 'https://cdn.pixabay.com/photo/2019/01/16/22/37/coffee-3936903_1280.jpg' }
    ];

    const beans = [
        { id: 'gayo', name: 'Gayo', description: 'Originating from Aceh, Gayo beans have a unique taste with hints of nuts, caramel, and a clean finish. Perfect for those who love a balanced and aromatic coffee.', image: 'https://cdn.pixabay.com/photo/2024/02/23/22/13/ai-generated-8592890_1280.jpg' },
        { id: 'lampung', name: 'Lampung', description: 'A classic Robusta from Lampung, Sumatra. Known for its bold, strong, and full-bodied character with earthy and dark chocolate notes.', image: 'https://cdn.pixabay.com/photo/2022/06/02/20/49/coffee-beans-7238936_1280.jpg' },
        { id: 'robusta', name: 'Robusta', description: 'A general selection of quality Robusta beans, delivering a powerful punch of caffeine and a strong, sharp flavor profile. Ideal for a morning kickstart.', image: 'https://cdn.pixabay.com/photo/2020/07/13/08/47/coffee-beans-5400045_1280.jpg' }
    ];

    // --- State Aplikasi ---
    let currentOrder = {
        drink: null,
        bean: null,
        sugar: 'normal',
        shot: 'single',
        ice: 'normal',
        orderType: 'dine-in',
        quantity: 1,
        name: '',
        whatsapp: '',
        address: '',
        totalPrice: 0
    };

    // --- Elemen DOM ---
    const drinkMenu = document.getElementById('drink-menu');
    const beanSelection = document.getElementById('bean-selection');
    const beanDetails = document.getElementById('bean-details');
    const orderFormSection = document.getElementById('order-form-section');
    const paymentSection = document.getElementById('payment-section');
    const successMessageSection = document.getElementById('success-message');
    
    const selectedDrinkName = document.getElementById('selected-drink-name');
    const selectedBeanName = document.getElementById('selected-bean-name');
    const totalPriceDisplay = document.getElementById('total-price');

    // --- Render Functions ---
    function renderDrinks() {
        drinkMenu.innerHTML = '';
        drinks.forEach(drink => {
            const drinkEl = document.createElement('div');
            drinkEl.classList.add('menu-item');
            drinkEl.dataset.id = drink.id;
            drinkEl.innerHTML = `
                <img src="${drink.image}" alt="${drink.name}">
                <h3>${drink.name}</h3>
                <p>Rp ${drink.price.toLocaleString('id-ID')}</p>
            `;
            drinkEl.addEventListener('click', () => selectDrink(drink));
            drinkMenu.appendChild(drinkEl);
        });
    }

    function renderBeans() {
        beanSelection.innerHTML = '';
        beans.forEach(bean => {
            const beanEl = document.createElement('div');
            beanEl.classList.add('bean-item');
            beanEl.dataset.id = bean.id;
            beanEl.innerHTML = `
                <img src="${bean.image}" alt="${bean.name}">
                <h3>${bean.name}</h3>
            `;
            beanEl.addEventListener('click', () => selectBean(bean));
            beanSelection.appendChild(beanEl);
        });
    }

    // --- Logic Functions ---
    function selectDrink(drink) {
        currentOrder.drink = drink;
        selectedDrinkName.textContent = drink.name;
        
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('selected'));
        document.querySelector(`.menu-item[data-id='${drink.id}']`).classList.add('selected');
        
        checkOrderReady();
        updateTotalPrice();
    }

    function selectBean(bean) {
        currentOrder.bean = bean;
        selectedBeanName.textContent = bean.name;
        beanDetails.innerHTML = `<p><strong>About ${bean.name}:</strong> ${bean.description}</p>`;
        
        document.querySelectorAll('.bean-item').forEach(el => el.classList.remove('selected'));
        document.querySelector(`.bean-item[data-id='${bean.id}']`).classList.add('selected');

        checkOrderReady();
    }

    function checkOrderReady() {
        if (currentOrder.drink && currentOrder.bean) {
            orderFormSection.classList.remove('hidden');
        }
    }

    function updateTotalPrice() {
        if (!currentOrder.drink) return;
        
        let basePrice = currentOrder.drink.price;
        let shotPrice = document.getElementById('shot').value === 'double' ? 5000 : 0;
        let quantity = parseInt(document.getElementById('quantity').value) || 1;
        
        currentOrder.totalPrice = (basePrice + shotPrice) * quantity;
        totalPriceDisplay.textContent = `Rp ${currentOrder.totalPrice.toLocaleString('id-ID')}`;
    }

    function generateID() {
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        
        let randomLetter = alphabet.charAt(randomIndex)
        
        return randomLetter + String(randomNumber);
    }

    const resGenerateID = generateID();

    // --- Event Listeners ---
    document.getElementById('order-form').addEventListener('input', (e) => {
        const targetId = e.target.id;
        const targetValue = e.target.value;

        if (targetId === 'sugar') currentOrder.sugar = targetValue;
        if (targetId === 'shot') currentOrder.shot = targetValue;
        if (targetId === 'ice') currentOrder.ice = targetValue;
        if (targetId === 'quantity') currentOrder.quantity = parseInt(targetValue);
        if (targetId === 'customer-name') currentOrder.name = targetValue;
        if (targetId === 'whatsapp') currentOrder.whatsapp = targetValue;
        if (targetId === 'address') currentOrder.address = targetValue;
        
        updateTotalPrice();
    });

    document.querySelectorAll('input[name="order-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentOrder.orderType = e.target.value;
            const deliveryInfo = document.getElementById('delivery-info');
            if (currentOrder.orderType === 'delivery') {
                deliveryInfo.classList.remove('hidden');
                document.getElementById('whatsapp').required = true;
                document.getElementById('address').required = true;
            } else {
                deliveryInfo.classList.add('hidden');
                document.getElementById('whatsapp').required = false;
                document.getElementById('address').required = false;
            }
        });
    });

    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        orderFormSection.classList.add('hidden');
        paymentSection.classList.remove('hidden');
        const date = new Date();
        const orderNumber = `GO-${date.getHours()}${date.getMinutes()}-${Math.floor(Math.random() * 100)}`;
        
        document.getElementById('order-summary').innerHTML = `
            <h4>Order #${orderNumber} Summary</h4>
            <p><strong>Customer:</strong> ${currentOrder.name}</p>
            <p><strong>Item:</strong> ${currentOrder.quantity}x ${currentOrder.drink.name} with ${currentOrder.bean.name} bean</p>
            <p><strong>Total:</strong> Rp ${currentOrder.totalPrice.toLocaleString('id-ID')}</p>
        `;
    });

    document.getElementById('confirm-payment-btn').addEventListener('click', () => {
        paymentSection.classList.add('hidden');
        successMessageSection.classList.remove('hidden');
        document.getElementById('final-message').textContent = `Pesanan sukses, Pesanan ${currentOrder.drink.name} dengan biji kopi ${currentOrder.bean.name} dengan ID ${resGenerateID} sedang dalam proses pembuatan.`;
    });
    
    document.getElementById('new-order-btn').addEventListener('click', () => {
       location.reload(); // Cara termudah untuk reset ke halaman utama
    });


    // --- Inisialisasi Aplikasi ---
    renderDrinks();
    renderBeans();
});