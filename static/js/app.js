// ==========================================================================
// MANTICHA FRONTEND STATE MANAGEMENT & LOCALIZATION
// ==========================================================================

// Global state
let state = {
    chatId: null,
    lang: 'uz',
    deliveryType: 'delivery', // 'delivery' or 'pickup'
    userInfo: null,
    products: null,
    branches: null,
    selectedBranchId: 'b1',
    activeCategory: 'blyudo',
    cart: [],
    map: null,
    mapMarker: null,
    mapTarget: 'reg', // 'reg' or 'reconfirm'
    tempAddress: '',
    tempLat: null,
    tempLng: null,
    miniMap: null,
    miniMapMarker: null
};

// UI Translations
const TRANSLATIONS = {
    uz: {
        welcome_title: "Xush kelibsiz!",
        welcome_desc: "Buyurtma berishni boshlash uchun telefon raqamingiz va manzilingizni kiriting.",
        name_lbl: "Ismingiz",
        name_placeholder: "Ismingizni kiriting",
        phone_lbl: "Telefon raqamingiz",
        phone_placeholder: "90 123 45 67",
        address_lbl: "Yetkazib berish manzili",
        address_select_map: "Kartadan tanlash...",
        address_resolving: "Manzil qidirilmoqda...",
        address_resolved_fail: "Manzilni aniqlab bo'lmadi, xaritadan boshqatdan tanlang",
        confirm_btn: "Tasdiqlash",
        yetkazish: "Yetkazish",
        olib_ketish: "Olib ketish",
        manzil_kiritilmagan: "Manzil kiritilmagan...",
        category_blyudo: "Blyudo",
        category_salat: "Salat",
        category_non: "Non",
        category_napitki: "Napitki",
        category_choy: "Choy",
        category_soyus: "Soyus",
        qoshish: "+ Qo'shish",
        product_added: "Mahsulot savatga qo'shildi!",
        floating_cart_items: "{count} ta mahsulot",
        view_cart: "Savatni ko'rish",
        cart_title: "Savat",
        cart_empty: "Savat bo'sh. Mazali taomlarimizdan buyurtma qiling!",
        order_type_lbl: "Buyurtma turi:",
        delivery_info_title: "Yetkazib berish ma'lumotlari",
        podezd: "Podezd",
        qavat: "Qavat",
        xonadon: "Xonadon",
        kuryer_izoh: "Kuryerga izoh",
        kuryer_izoh_placeholder: "Masalan: Dom kodi 123, kuryer kelganda telefon qilsin...",
        map_confirm_title: "Xaritadagi joylashuv",
        change_btn: "O'zgartirish",
        pickup_info_title: "Filiallarimizdan birini tanlang",
        hours_lbl: "Ish vaqti",
        items_price: "Mahsulotlar narxi:",
        delivery_price: "Yetkazib berish:",
        delivery_free: "Bepul",
        total_price: "Jami to'lov:",
        place_order_btn: "Buyurtma berish",
        order_success_title: "Rahmat!",
        order_success_msg: "Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada siz bilan bog'lanamiz!",
        map_picker_title: "Manzilni belgilang"
    },
    ru: {
        welcome_title: "Добро пожаловать!",
        welcome_desc: "Для начала заказа введите ваше имя, номер телефона и адрес.",
        name_lbl: "Ваше имя",
        name_placeholder: "Введите ваше имя",
        phone_lbl: "Номер телефона",
        phone_placeholder: "90 123 45 67",
        address_lbl: "Адрес доставки",
        address_select_map: "Выбрать на карте...",
        address_resolving: "Поиск адреса...",
        address_resolved_fail: "Не удалось определить адрес, выберите другое место на карте",
        confirm_btn: "Подтвердить",
        yetkazish: "Доставка",
        olib_ketish: "Самовывоз",
        manzil_kiritilmagan: "Адрес не указан...",
        category_blyudo: "Блюдо",
        category_salat: "Салат",
        category_non: "Хлеб",
        category_napitki: "Напитки",
        category_choy: "Чай",
        category_soyus: "Соус",
        qoshish: "+ Добавить",
        product_added: "Товар добавлен в корзину!",
        floating_cart_items: "Товаров: {count}",
        view_cart: "Просмотреть корзину",
        cart_title: "Корзина",
        cart_empty: "Корзина пуста. Закажите наши вкусные блюда!",
        order_type_lbl: "Тип заказа:",
        delivery_info_title: "Информация о доставке",
        podezd: "Подъезд",
        qavat: "Этаж",
        xonadon: "Квартира",
        kuryer_izoh: "Комментарий курьеру",
        kuryer_izoh_placeholder: "Например: Код домофона 123, позвонить по прибытии...",
        map_confirm_title: "Местоположение на карте",
        change_btn: "Изменить",
        pickup_info_title: "Выберите один из филиалов",
        hours_lbl: "Время работы",
        items_price: "Стоимость товаров:",
        delivery_price: "Доставка:",
        delivery_free: "Бесплатно",
        total_price: "Итого к оплате:",
        place_order_btn: "Оформить заказ",
        order_success_title: "Спасибо!",
        order_success_msg: "Ваш заказ успешно принят. Мы свяжемся с вами в ближайшее время!",
        map_picker_title: "Укажите адрес"
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Telegram WebApp SDK if available
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        // Try to style WebApp based on Telegram Theme Colors
        const tgColors = window.Telegram.WebApp.themeParams;
        if (tgColors && tgColors.bg_color) {
            // Respect Telegram's dark/light modes but keep our cozy aesthetic style
            // Or we can stick to our premium brand design
        }
    }
    
    // Parse URL Query Params
    const urlParams = new URLSearchParams(window.location.search);
    state.chatId = urlParams.get('chat_id') || 'test_user_id';
    state.lang = urlParams.get('lang') || 'uz';
    
    // Apply initial language UI translations
    applyLanguageTranslations();
    
    // Load local storage details
    loadSavedUserInfo();
    
    // Fetch Products and Branches from Backend APIs
    fetchProducts();
    fetchBranches();
    
    // Setup inputs formatters
    setupInputMasks();
});

// ==========================================================================
// TRANSLATION ENGINE
// ==========================================================================
function applyLanguageTranslations() {
    const t = TRANSLATIONS[state.lang];
    
    // Set Header/Navbar elements
    document.getElementById('currentLangLabel').textContent = state.lang === 'uz' ? "O'z" : "Ru";
    
    // Update Delivery Toggle buttons
    document.getElementById('deliveryBtn').textContent = t.yetkazish;
    document.getElementById('pickupBtn').textContent = t.olib_ketish;
    
    // Categories translation
    const categoryEls = document.querySelectorAll('.category-pill');
    categoryEls.forEach(el => {
        const cat = el.getAttribute('data-category');
        if (cat === 'blyudo') el.textContent = t.category_blyudo;
        else if (cat === 'salat') el.textContent = t.category_salat;
        else if (cat === 'non') el.textContent = t.category_non;
        else if (cat === 'napitki') el.textContent = t.category_napitki;
        else if (cat === 'choy') el.textContent = t.category_choy;
        else if (cat === 'soyus') el.textContent = t.category_soyus;
    });
    
    // Registration Screen
    document.getElementById('regWelcomeTitle').textContent = t.welcome_title;
    document.getElementById('regWelcomeDesc').textContent = t.welcome_desc;
    document.getElementById('regNameLabel').textContent = t.name_lbl;
    document.getElementById('regName').placeholder = t.name_placeholder;
    document.getElementById('regPhoneLabel').textContent = t.phone_lbl;
    document.getElementById('regPhone').placeholder = t.phone_placeholder;
    document.getElementById('regAddressLabel').textContent = t.address_lbl;
    if (!state.userInfo) {
        document.getElementById('regAddressDisplay').textContent = t.address_select_map;
    }
    document.getElementById('regSubmitBtn').textContent = t.confirm_btn;
    
    // Map Picker Modal
    document.getElementById('mapPickerTitle').textContent = t.map_picker_title;
    document.getElementById('confirmAddressBtn').textContent = t.confirm_btn;
    
    // Cart Modal
    document.getElementById('cartModalTitle').textContent = t.cart_title;
    document.getElementById('cartEmptyText').textContent = t.cart_empty;
    document.getElementById('orderTypeSummaryLabel').textContent = t.order_type_lbl;
    document.getElementById('orderTypeSummaryValue').textContent = state.deliveryType === 'delivery' ? t.yetkazish : t.olib_ketish;
    
    // Checkout details form
    document.getElementById('deliveryDetailsTitle').textContent = t.delivery_info_title;
    document.getElementById('lblEntrance').textContent = t.podezd;
    document.getElementById('lblFloor').textContent = t.qavat;
    document.getElementById('lblApartment').textContent = t.xonadon;
    document.getElementById('lblComment').textContent = t.kuryer_izoh;
    document.getElementById('checkoutComment').placeholder = t.kuryer_izoh_placeholder;
    document.getElementById('lblConfirmOnMap').textContent = t.map_confirm_title;
    document.getElementById('btnChangeAddress').textContent = t.change_btn;
    document.getElementById('pickupDetailsTitle').textContent = t.pickup_info_title;
    
    // Pricing info
    document.getElementById('lblItemsTotal').textContent = t.items_price;
    document.getElementById('lblDeliveryFee').textContent = t.delivery_price;
    document.getElementById('lblTotalToPay').textContent = t.total_price;
    document.getElementById('submitOrderBtn').textContent = t.place_order_btn;
    document.getElementById('viewCartText').textContent = t.view_cart;
    
    // Refresh address strings in views
    updateAddressViews();
    
    // Re-render components to apply dynamic text changes
    renderProducts();
    renderCart();
    renderBranches();
}

function changeAppLanguage(langCode, event) {
    if (event) event.stopPropagation();
    state.lang = langCode;
    document.getElementById('langDropdown').parentElement.classList.remove('active');
    applyLanguageTranslations();
}

function toggleLangDropdown() {
    const el = document.getElementById('langBtn');
    el.classList.toggle('active');
}

// Close language dropdown if clicking outside
window.addEventListener('click', (e) => {
    const dropdown = document.getElementById('langDropdown');
    const langBtn = document.getElementById('langBtn');
    if (langBtn && !langBtn.contains(e.target)) {
        langBtn.classList.remove('active');
    }
});

// ==========================================================================
// REGISTRATION & PERSISTENCE
// ==========================================================================
function loadSavedUserInfo() {
    const saved = localStorage.getItem('manticha_user_info');
    if (saved) {
        try {
            state.userInfo = JSON.parse(saved);
            
            // Auto fill checkout address
            state.tempAddress = state.userInfo.address;
            state.tempLat = state.userInfo.lat;
            state.tempLng = state.userInfo.lng;
            
            // Hide registration modal
            document.getElementById('registrationModal').classList.remove('active');
            updateAddressViews();
        } catch (e) {
            console.error("Error loading user info", e);
        }
    } else {
        // Pre-fill Telegram name if possible
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            let fullName = user.first_name || '';
            if (user.last_name) fullName += ' ' + user.last_name;
            document.getElementById('regName').value = fullName;
        }
        
        // Show registration modal
        document.getElementById('registrationModal').classList.add('active');
    }
}

function setupInputMasks() {
    const phoneInput = document.getElementById('regPhone');
    phoneInput.addEventListener('input', (e) => {
        // Only numbers
        let value = e.target.value.replace(/\D/g, '');
        
        // Format: 90 123 45 67
        let formatted = '';
        if (value.length > 0) {
            formatted += value.substring(0, 2);
        }
        if (value.length > 2) {
            formatted += ' ' + value.substring(2, 5);
        }
        if (value.length > 5) {
            formatted += ' ' + value.substring(5, 7);
        }
        if (value.length > 7) {
            formatted += ' ' + value.substring(7, 9);
        }
        e.target.value = formatted;
    });
}

function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const rawPhone = document.getElementById('regPhone').value.replace(/\s/g, '');
    const address = document.getElementById('regAddress').value;
    const lat = parseFloat(document.getElementById('regLat').value);
    const lng = parseFloat(document.getElementById('regLng').value);
    
    if (!address || isNaN(lat) || isNaN(lng)) {
        showToast(state.lang === 'uz' ? "Iltimos, manzilingizni xaritadan belgilang!" : "Пожалуйста, укажите ваш адрес на карте!");
        return;
    }
    
    const phone = "+998" + rawPhone;
    
    state.userInfo = { name, phone, address, lat, lng };
    localStorage.setItem('manticha_user_info', JSON.stringify(state.userInfo));
    
    // Save to server database
    fetch(`/api/user-data/${state.chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.userInfo)
    }).then(res => res.json())
      .then(data => console.log("User synced with server", data))
      .catch(err => console.error("Error syncing user", err));
      
    // Update local state views
    state.tempAddress = address;
    state.tempLat = lat;
    state.tempLng = lng;
    
    updateAddressViews();
    
    // Hide registration modal with smooth animation
    document.getElementById('registrationModal').classList.remove('active');
    showToast(state.lang === 'uz' ? "Muvaffaqiyatli ro'yxatdan o'tdingiz!" : "Вы успешно зарегистрировались!");
}

function updateAddressViews() {
    const t = TRANSLATIONS[state.lang];
    const displayAddr = state.tempAddress || (state.userInfo ? state.userInfo.address : null) || t.manzil_kiritilmagan;
    
    // Update Header Address Display
    document.getElementById('selectedAddressText').textContent = displayAddr;
    
    // Update Checkout modal preview address
    document.getElementById('checkoutAddressDisplay').textContent = displayAddr;
}

// Trigger Address Change (open map picker from header click)
function triggerAddressChange() {
    if (state.deliveryType === 'delivery') {
        openMapPicker('reconfirm');
    } else {
        openCartModal();
        setDeliveryType('pickup');
    }
}

// ==========================================================================
// MAP SELECTION INTEGRATION (LEAFLET)
// ==========================================================================
function openMapPicker(target) {
    state.mapTarget = target;
    document.getElementById('mapPickerModal').classList.add('active');
    
    // Start address search indicator
    document.getElementById('resolvedAddressText').textContent = TRANSLATIONS[state.lang].address_resolving;
    document.getElementById('resolvePulse').classList.add('pulse-dot');
    
    // Initialize Leaflet Map if not created yet
    setTimeout(() => {
        if (!state.map) {
            // Default center is Tashkent
            const defaultLat = 41.31108;
            const defaultLng = 69.24056;
            
            state.map = L.map('mapContainer', {
                zoomControl: false,
                attributionControl: false
            }).setView([defaultLat, defaultLng], 14);
            
            // Add premium themed vector map layers (CartoDB Positron is clean and fits our color theme)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 19
            }).addTo(state.map);
            
            // Listen to move events to trigger reverse geocoding
            state.map.on('moveend', () => {
                const center = state.map.getCenter();
                reverseGeocode(center.lat, center.lng);
            });
            
            // Try to find user current location if geolocation is active
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const userLat = pos.coords.latitude;
                    const userLng = pos.coords.longitude;
                    state.map.setView([userLat, userLng], 16);
                    reverseGeocode(userLat, userLng);
                }, () => {
                    // Fallback to Tashkent
                    reverseGeocode(defaultLat, defaultLng);
                });
            } else {
                reverseGeocode(defaultLat, defaultLng);
            }
        } else {
            // Map exists, force resize/refresh
            state.map.invalidateSize();
            
            // Position at current location or cached location
            const targetLat = state.tempLat || (state.userInfo ? state.userInfo.lat : 41.31108);
            const targetLng = state.tempLng || (state.userInfo ? state.userInfo.lng : 69.24056);
            state.map.setView([targetLat, targetLng], 16);
            reverseGeocode(targetLat, targetLng);
        }
    }, 300);
}

function closeMapPicker() {
    document.getElementById('mapPickerModal').classList.remove('active');
}

// Reverse Geocoding with OpenStreetMap Nominatim API
let geocodeTimeout = null;
function reverseGeocode(lat, lng) {
    // Debounce calls to avoid overloading Nominatim API
    if (geocodeTimeout) clearTimeout(geocodeTimeout);
    
    document.getElementById('resolvedAddressText').textContent = TRANSLATIONS[state.lang].address_resolving;
    document.getElementById('resolvePulse').style.display = 'block';
    
    geocodeTimeout = setTimeout(() => {
        const langParam = state.lang === 'ru' ? 'ru' : 'uz';
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${langParam}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.display_name) {
                    // Format address cleanly: extract street/house numbers
                    let cleanAddr = data.display_name;
                    
                    // Simple cleanups
                    const parts = cleanAddr.split(', ');
                    if (parts.length > 4) {
                        // Truncate country/postcodes at the end if too long
                        cleanAddr = parts.slice(0, 4).join(', ');
                    }
                    
                    state.tempAddress = cleanAddr;
                    state.tempLat = lat;
                    state.tempLng = lng;
                    
                    document.getElementById('resolvedAddressText').textContent = cleanAddr;
                } else {
                    state.tempAddress = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
                    state.tempLat = lat;
                    state.tempLng = lng;
                    document.getElementById('resolvedAddressText').textContent = state.tempAddress;
                }
                document.getElementById('resolvePulse').style.display = 'none';
            })
            .catch(err => {
                console.error("Geocoding failed", err);
                state.tempAddress = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
                state.tempLat = lat;
                state.tempLng = lng;
                document.getElementById('resolvedAddressText').textContent = state.tempAddress;
                document.getElementById('resolvePulse').style.display = 'none';
            });
    }, 800);
}

function confirmSelectedMapAddress() {
    if (!state.tempAddress) return;
    
    if (state.mapTarget === 'reg') {
        document.getElementById('regAddressDisplay').textContent = state.tempAddress;
        document.getElementById('regAddress').value = state.tempAddress;
        document.getElementById('regLat').value = state.tempLat;
        document.getElementById('regLng').value = state.tempLng;
    } else {
        updateAddressViews();
        // Update user coordinates in DB if logged in
        if (state.userInfo) {
            state.userInfo.address = state.tempAddress;
            state.userInfo.lat = state.tempLat;
            state.userInfo.lng = state.tempLng;
            localStorage.setItem('manticha_user_info', JSON.stringify(state.userInfo));
        }
    }
    
    closeMapPicker();
}

// ==========================================================================
// PRODUCTS AND CATEGORIES ENGINE
// ==========================================================================
function fetchProducts() {
    fetch('/api/products')
        .then(res => res.json())
        .then(data => {
            state.products = data;
            renderProducts();
        })
        .catch(err => console.error("Error loading products", err));
}

function selectCategory(category) {
    state.activeCategory = category;
    
    // Update pills active state
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
        if (pill.getAttribute('data-category') === category) {
            pill.classList.add('active');
            // Scroll category pill to view
            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            pill.classList.remove('active');
        }
    });
    
    // Update active view
    const titleText = TRANSLATIONS[state.lang][`category_${category}`] || category;
    document.getElementById('categoryTitleText').textContent = titleText;
    
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (!state.products || !state.products[state.activeCategory]) {
        grid.innerHTML = '<div class="loading-products">Loading...</div>';
        return;
    }
    
    const activeProducts = state.products[state.activeCategory];
    const t = TRANSLATIONS[state.lang];
    
    activeProducts.forEach(prod => {
        const cartItem = state.cart.find(item => item.id === prod.id);
        const qty = cartItem ? cartItem.quantity : 0;
        
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const name = state.lang === 'uz' ? prod.name_uz : prod.name_ru;
        const desc = state.lang === 'uz' ? prod.desc_uz : prod.desc_ru;
        
        // Generate styled SVG or placeholder image if files not loaded
        // For premium feel we display a beautiful styled food placeholder or direct SVG
        const imgUrl = `/static/images/${prod.image}`;
        
        card.innerHTML = `
            <div class="product-image-container">
                <!-- Fallback to placeholder manti icon if image load fails -->
                <img src="${imgUrl}" alt="${name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e9d4ba%22/><text x=%2250%22 y=%2255%22 font-family=%22sans-serif%22 font-size=%2212%22 fill=%22%235c2518%22 text-anchor=%22middle%22>${state.lang === 'uz' ? 'Mazali' : 'Вкусно'}</text></svg>'"/>
                <div class="product-badge">${prod.weight}</div>
            </div>
            <div class="product-info">
                <div class="product-price">${prod.price.toLocaleString()} UZS</div>
                <div class="product-name" title="${desc}">${name}</div>
                <div class="product-weight">${prod.weight}</div>
                
                <div class="add-to-cart-container" id="btn-container-${prod.id}">
                    ${qty === 0 ? 
                        `<button class="add-btn" onclick="addToCart('${prod.id}')">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1V11M1 6H11" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>${t.qoshish}</span>
                         </button>` : 
                        `<div class="counter-container">
                            <button class="counter-btn" onclick="updateQty('${prod.id}', -1)">&minus;</button>
                            <span class="counter-value">${qty}</span>
                            <button class="counter-btn" onclick="updateQty('${prod.id}', 1)">&plus;</button>
                         </div>`
                    }
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================================================
// SHOPPING CART ENGINE
// ==========================================================================
function addToCart(productId) {
    // Find product in state
    let foundProduct = null;
    for (const cat in state.products) {
        const prod = state.products[cat].find(p => p.id === productId);
        if (prod) {
            foundProduct = prod;
            break;
        }
    }
    
    if (!foundProduct) return;
    
    state.cart.push({
        id: foundProduct.id,
        name_uz: foundProduct.name_uz,
        name_ru: foundProduct.name_ru,
        price: foundProduct.price,
        image: foundProduct.image,
        quantity: 1
    });
    
    updateCartTotals();
    renderProducts();
    showToast(TRANSLATIONS[state.lang].product_added);
}

function updateQty(productId, change) {
    const itemIndex = state.cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;
    
    state.cart[itemIndex].quantity += change;
    
    if (state.cart[itemIndex].quantity <= 0) {
        state.cart.splice(itemIndex, 1);
    }
    
    updateCartTotals();
    renderProducts();
    renderCart(); // If cart modal is open
}

function updateCartTotals() {
    let totalCount = 0;
    let totalSum = 0;
    
    state.cart.forEach(item => {
        totalCount += item.quantity;
        totalSum += item.price * item.quantity;
    });
    
    // Update Header Pill
    document.getElementById('cartTotalSum').textContent = `${totalSum.toLocaleString()} UZS`;
    
    // Update Floating Bottom Bar
    const floatingBar = document.getElementById('floatingCartBar');
    if (totalCount > 0) {
        floatingBar.style.display = 'block';
        document.getElementById('floatingCartCount').textContent = TRANSLATIONS[state.lang].floating_cart_items.replace('{count}', totalCount);
        document.getElementById('floatingCartTotal').textContent = `${totalSum.toLocaleString()} UZS`;
    } else {
        floatingBar.style.display = 'none';
    }
}

function openCartModal() {
    document.getElementById('cartModal').classList.add('active');
    renderCart();
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

function renderCart() {
    const listContainer = document.getElementById('cartItemsList');
    const emptyView = document.getElementById('cartEmptyView');
    const footerSection = document.getElementById('cartFooterSection');
    const detailsForm = document.getElementById('cartOrderDetails');
    
    if (state.cart.length === 0) {
        listContainer.classList.add('hidden');
        detailsForm.classList.add('hidden');
        footerSection.classList.add('hidden');
        emptyView.classList.remove('hidden');
        return;
    }
    
    listContainer.classList.remove('hidden');
    detailsForm.classList.remove('hidden');
    footerSection.classList.remove('hidden');
    emptyView.classList.add('hidden');
    
    listContainer.innerHTML = '';
    
    let itemsSubtotal = 0;
    
    state.cart.forEach(item => {
        itemsSubtotal += item.price * item.quantity;
        const name = state.lang === 'uz' ? item.name_uz : item.name_ru;
        const imgUrl = `/static/images/${item.image}`;
        
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img class="cart-item-img" src="${imgUrl}" alt="${name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 50 50%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e9d4ba%22/><text x=%2225%22 y=%2230%22 font-size=%228%22 fill=%22%235c2518%22 text-anchor=%22middle%22>Food</text></svg>'"/>
            <div class="cart-item-details">
                <div class="cart-item-name">${name}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} UZS</div>
            </div>
            <div class="counter-container">
                <button class="counter-btn" onclick="updateQty('${item.id}', -1)">&minus;</button>
                <span class="counter-value">${item.quantity}</span>
                <button class="counter-btn" onclick="updateQty('${item.id}', 1)">&plus;</button>
            </div>
        `;
        listContainer.appendChild(row);
    });
    
    // Calculate final billing
    document.getElementById('cartItemsSubtotal').textContent = `${itemsSubtotal.toLocaleString()} UZS`;
    
    let deliveryFee = 0; // Free delivery
    const t = TRANSLATIONS[state.lang];
    document.getElementById('cartDeliveryPrice').textContent = t.delivery_free;
    
    const finalTotal = itemsSubtotal + deliveryFee;
    document.getElementById('cartFinalTotal').textContent = `${finalTotal.toLocaleString()} UZS`;
    
    // Address reconfirm label in checkout
    updateAddressViews();
}

// ==========================================================================
// DELIVERY VS PICKUP TOGGLES & BRANCHES (SELF-PICKUP)
// ==========================================================================
function setDeliveryType(type) {
    state.deliveryType = type;
    
    const t = TRANSLATIONS[state.lang];
    document.getElementById('orderTypeSummaryValue').textContent = type === 'delivery' ? t.yetkazish : t.olib_ketish;
    
    const deliveryBtn = document.getElementById('deliveryBtn');
    const pickupBtn = document.getElementById('pickupBtn');
    
    const deliveryForm = document.getElementById('deliveryDetailsForm');
    const pickupForm = document.getElementById('pickupDetailsForm');
    
    const deliveryPriceRow = document.getElementById('deliveryPriceRow');
    
    if (type === 'delivery') {
        deliveryBtn.classList.add('active');
        pickupBtn.classList.remove('active');
        
        deliveryForm.classList.remove('hidden');
        pickupForm.classList.add('hidden');
        deliveryPriceRow.classList.remove('hidden');
    } else {
        deliveryBtn.classList.remove('active');
        pickupBtn.classList.add('active');
        
        deliveryForm.classList.add('hidden');
        pickupForm.classList.remove('hidden');
        deliveryPriceRow.classList.add('hidden');
        
        // Render and load mini branches map
        renderBranches();
        initBranchMiniMap();
    }
}

function fetchBranches() {
    fetch('/api/branches')
        .then(res => res.json())
        .then(data => {
            state.branches = data;
            if (data && data.length > 0) {
                state.selectedBranchId = data[0].id;
            }
            renderBranches();
        })
        .catch(err => console.error("Error loading branches", err));
}

function renderBranches() {
    const container = document.getElementById('branchesContainer');
    if (!container || !state.branches) return;
    
    container.innerHTML = '';
    
    const t = TRANSLATIONS[state.lang];
    
    state.branches.forEach(branch => {
        const isActive = branch.id === state.selectedBranchId;
        const name = branch.name_uz; // Same name for both
        const addr = state.lang === 'uz' ? branch.address_uz : branch.address_ru;
        
        const card = document.createElement('div');
        card.className = `branch-card ${isActive ? 'active' : ''}`;
        card.onclick = () => selectBranch(branch.id);
        
        card.innerHTML = `
            <div class="branch-name">
                <span>${name}</span>
                <span class="branch-hours">${t.hours_lbl}: ${branch.hours}</span>
            </div>
            <div class="branch-address">${addr}</div>
        `;
        
        container.appendChild(card);
    });
}

function selectBranch(branchId) {
    state.selectedBranchId = branchId;
    renderBranches();
    
    // Center branch map
    const branch = state.branches.find(b => b.id === branchId);
    if (branch && state.miniMap) {
        state.miniMap.setView([branch.lat, branch.lng], 15);
        state.miniMapMarker.setLatLng([branch.lat, branch.lng]);
    }
}

// Mini map for pickup location preview
function initBranchMiniMap() {
    if (!state.branches || state.branches.length === 0) return;
    
    const selectedBranch = state.branches.find(b => b.id === state.selectedBranchId) || state.branches[0];
    
    setTimeout(() => {
        if (!state.miniMap) {
            state.miniMap = L.map('branchMiniMap', {
                zoomControl: false,
                attributionControl: false
            }).setView([selectedBranch.lat, selectedBranch.lng], 15);
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 19
            }).addTo(state.miniMap);
            
            // Custom brown pin for branch location
            const brownIcon = L.divIcon({
                html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#5c2518"/>
                       </svg>`,
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });
            
            state.miniMapMarker = L.marker([selectedBranch.lat, selectedBranch.lng], { icon: brownIcon }).addTo(state.miniMap);
        } else {
            state.miniMap.invalidateSize();
            state.miniMap.setView([selectedBranch.lat, selectedBranch.lng], 15);
            state.miniMapMarker.setLatLng([selectedBranch.lat, selectedBranch.lng]);
        }
    }, 200);
}

// ==========================================================================
// ORDER SUBMISSION & COMPLETION FLOW
// ==========================================================================
function submitFinalOrder() {
    if (state.cart.length === 0) return;
    
    // Check registration profile details
    if (!state.userInfo) {
        showToast(state.lang === 'uz' ? "Siz ro'yxatdan o'tmagansiz!" : "Вы не зарегистрированы!");
        document.getElementById('cartModal').classList.remove('active');
        document.getElementById('registrationModal').classList.add('active');
        return;
    }
    
    // Block double submissions
    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    let orderPayload = {
        chat_id: state.chatId,
        user_name: state.userInfo.name,
        user_phone: state.userInfo.phone,
        delivery_type: state.deliveryType,
        items: state.cart,
        total_price: state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    if (state.deliveryType === 'delivery') {
        orderPayload.address = state.tempAddress || state.userInfo.address;
        orderPayload.lat = state.tempLat || state.userInfo.lat;
        orderPayload.lng = state.tempLng || state.userInfo.lng;
        orderPayload.entrance = document.getElementById('checkoutEntrance').value.trim();
        orderPayload.floor = document.getElementById('checkoutFloor').value.trim();
        orderPayload.apartment = document.getElementById('checkoutApartment').value.trim();
        orderPayload.comment = document.getElementById('checkoutComment').value.trim();
    } else {
        // Self-pickup
        const branch = state.branches.find(b => b.id === state.selectedBranchId);
        orderPayload.address = branch ? branch.name_uz + " (" + branch.address_uz + ")" : "Filialda olib ketish";
        orderPayload.lat = branch ? branch.lat : null;
        orderPayload.lng = branch ? branch.lng : null;
        orderPayload.entrance = '';
        orderPayload.floor = '';
        orderPayload.apartment = '';
        orderPayload.comment = '';
    }
    
    // Submit to Flask API
    fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Show successful message and close Telegram WebApp
            showToast(TRANSLATIONS[state.lang].order_success_msg);
            
            // Clear cart
            state.cart = [];
            updateCartTotals();
            closeCartModal();
            
            setTimeout(() => {
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.close();
                }
            }, 2500);
        } else {
            alert("Order Error: " + data.message);
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    })
    .catch(err => {
        console.error("Order API request failed", err);
        alert("Server error, please try again.");
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    });
}

// ==========================================================================
// TOAST NOTIFICATIONS HELPER
// ==========================================================================
let toastTimeout = null;
function showToast(message) {
    const toast = document.getElementById('notificationToast');
    const toastMsg = document.getElementById('toastMessage');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    
    toastMsg.textContent = message;
    toast.classList.add('active');
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}
