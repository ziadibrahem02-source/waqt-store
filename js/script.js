// ==============================================================================
// ملف جافاسكريبت الرئيسي لموقع وقت | WAQT Timepieces
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تأثير النافبار عند التمرير (Navbar Scrolled Effect)
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. التمرير السلس للروابط (Smooth Scrolling)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==============================================================================
    // 3. منطق النوافذ المنبثقة (Modal Popups Logic)
    // ==============================================================================
    const modals = {
        contact: document.getElementById('contactModal'),
        cart: document.getElementById('cartModal'),
        search: document.getElementById('searchModal'),
        user: document.getElementById('userModal'),
        checkout: document.getElementById('checkoutModal'),
        admin: document.getElementById('adminModal'),
        password: document.getElementById('passwordModal')
    };

    const triggers = {
        contactBtn: document.getElementById('contact-btn'),
        footerContact: document.getElementById('footer-contact'),
        cartIcon: document.getElementById('cart-icon'),
        searchIcon: document.getElementById('search-icon'),
        userIcon: document.getElementById('user-icon')
    };

    // دوال الفتح والإغلاق العامة
    function openModal(modalId) {
        if (modals[modalId]) {
            modals[modalId].style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModalFunc() {
        Object.values(modals).forEach(modal => {
            if (modal) {
                modal.style.display = 'none';
            }
        });
        document.body.style.overflow = '';
    }

    // ربط أزرار النافبار بفتح المودالات
    if (triggers.contactBtn) triggers.contactBtn.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });
    if (triggers.footerContact) triggers.footerContact.addEventListener('click', (e) => { e.preventDefault(); openModal('contact'); });
    if (triggers.cartIcon) triggers.cartIcon.addEventListener('click', (e) => { e.preventDefault(); openModal('cart'); });
    if (triggers.searchIcon) triggers.searchIcon.addEventListener('click', (e) => { e.preventDefault(); openModal('search'); });
    if (triggers.userIcon) triggers.userIcon.addEventListener('click', (e) => { e.preventDefault(); openModal('user'); });

    // أزرار الإغلاق (X)
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModalFunc);
    });

    // الإغلاق عند الضغط خارج النافذة
    window.addEventListener('click', (e) => {
        Object.values(modals).forEach(modal => {
            if (e.target === modal) {
                closeModalFunc();
            }
        });
    });

    // ==============================================================================
    // 4. نظام إدارة المنتجات الخفي (بالضغط 4 مرات على اللوجو + كلمة السر)
    // ==============================================================================
    const defaultProducts = [
        { name: "SEIKO 5", price: 4250, img: "assets/images/watch1.png", type: "أوتوماتيك" },
        { name: "TISSOT CLASSIC", price: 6750, img: "assets/images/watch2.png", type: "كوارتز" },
        { name: "ROLEX DATEJUST", price: 32500, img: "assets/images/watch3.png", type: "أوتوماتيك" },
        { name: "CASIO EDIFICE", price: 5200, img: "assets/images/watch4.png", type: "كرونوغراف" }
    ];

    let products = JSON.parse(localStorage.getItem('waqt_products')) || defaultProducts;

    const productsGrid = document.getElementById('products-grid');
    const adminProductsList = document.getElementById('admin-products-list');
    const adminModal = document.getElementById('adminModal');
    const passwordModal = document.getElementById('passwordModal');
    const waqtLogo = document.getElementById('waqt-logo');
    const adminPassInput = document.getElementById('admin-pass-input');
    const passwordSubmitBtn = document.getElementById('password-submit-btn');
    const passwordForm = document.getElementById('passwordForm');

    const ADMIN_PASSWORD = "zyad_3my"; // كلمة المرور الخاصة بك

    let clickCount = 0;
    let timer = null;

    // العد للضغط 4 مرات على اللوجو
    if (waqtLogo) {
        waqtLogo.addEventListener('click', () => {
            clickCount++;
            clearTimeout(timer);
            
            timer = setTimeout(() => {
                clickCount = 0;
            }, 800);

            if (clickCount === 4) {
                clickCount = 0;
                if (passwordModal) {
                    passwordModal.style.display = 'flex';
                    if (adminPassInput) {
                        adminPassInput.value = '';
                        adminPassInput.focus();
                    }
                }
            }
        });
    }

    // دالة موحدة للتحقق من كلمة المرور
    function handleAdminLogin(e) {
        if (e) e.preventDefault();
        const enteredValue = adminPassInput ? adminPassInput.value.trim() : '';
        
        if (enteredValue === ADMIN_PASSWORD) {
            if (passwordModal) passwordModal.style.display = 'none';
            
            renderAdminList();
            
            if (adminModal) {
                adminModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
            if (adminPassInput) adminPassInput.value = '';
        } else {
            alert('كلمة المرور غير صحيحة!');
            if (adminPassInput) {
                adminPassInput.value = '';
                adminPassInput.focus();
            }
        }
    }

    if (passwordSubmitBtn) {
        passwordSubmitBtn.addEventListener('click', handleAdminLogin);
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', handleAdminLogin);
    }

    // عرض الساعات في الموقع الرئيسية
    function renderProducts() {
        if (!productsGrid) return;
        productsGrid.innerHTML = '';

        products.forEach((product) => {
            const card = document.createElement('div');
            card.className = 'rolex-card';
            card.setAttribute('data-name', product.name);
            card.setAttribute('data-price', product.price);
            card.setAttribute('data-img', product.img);

            card.innerHTML = `
                <div class="product-img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p class="lang-text">${product.type}</p>
                <div class="price">EGP ${product.price.toLocaleString()}</div>
                <button class="add-to-cart-btn lang-text" data-ar="أضف للسلة <i class='fa-solid fa-bag-shopping'></i>" data-en="ADD TO CART <i class='fa-solid fa-bag-shopping'></i>">أضف للسلة <i class="fa-solid fa-bag-shopping"></i></button>
            `;
            productsGrid.appendChild(card);
        });

        initAddToCartButtons();
    }

    // عرض الساعات في لوحة التحكم لمسحها
    function renderAdminList() {
        if (!adminProductsList) return;
        adminProductsList.innerHTML = '';

        products.forEach((product, index) => {
            const row = document.createElement('div');
            row.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #111; padding: 8px 12px; border-radius: 5px;";
            row.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${product.img}" style="width: 30px; height: 30px; object-fit: contain;">
                    <span style="font-size: 0.85rem; color: #fff;">${product.name} - ${product.price} EGP</span>
                </div>
                <button onclick="window.deleteProduct(${index})" style="background: #ff4d4d; color: #fff; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 0.75rem;">مسح</button>
            `;
            adminProductsList.appendChild(row);
        });
    }

    // إضافة ساعة جديدة
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('new-name').value;
            const price = parseFloat(document.getElementById('new-price').value);
            const img = document.getElementById('new-img').value;
            const type = document.getElementById('new-type').value;

            products.push({ name, price, img, type });
            localStorage.setItem('waqt_products', JSON.stringify(products));

            renderProducts();
            renderAdminList();
            addProductForm.reset();
            alert('تمت إضافة الساعة بنجاح وظهرت في الموقع!');
        });
    }

    // مسح ساعة
    window.deleteProduct = function(index) {
        if (confirm('هل أنت متأكد من مسح هذه الساعة؟')) {
            products.splice(index, 1);
            localStorage.setItem('waqt_products', JSON.stringify(products));
            renderProducts();
            renderAdminList();
        }
    };

    // ==============================================================================
    // 5. منطق عربة التسوق (Shopping Cart Logic)
    // ==============================================================================
    let cart = [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceEl = document.getElementById('total-price');

    function initAddToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.rolex-card');
                const name = card.getAttribute('data-name');
                const price = parseFloat(card.getAttribute('data-price'));
                const img = card.getAttribute('data-img');

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ name, price, img, quantity: 1 });
                }

                updateCartUI();
                openModal('cart');
            });
        });
    }

    function updateCartUI() {
        let totalCount = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            if (cartItemsContainer) cartItemsContainer.innerHTML = '<p class="empty-cart-msg" style="text-align:center; color:#aaa; padding:15px;">عربة التسوق فارغة حالياً.</p>';
            removeCartActions();
        } else {
            if (cartItemsContainer) cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                totalCount += item.quantity;
                totalPrice += item.price * item.quantity;

                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item-row';
                itemRow.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.img}" alt="${item.name}">
                        <div>
                            <h4 style="font-size: 0.9rem; color: #fff;">${item.name}</h4>
                            <span style="font-size: 0.8rem; color: var(--waqt-gold);">${item.price.toLocaleString()} EGP (x${item.quantity})</span>
                        </div>
                    </div>
                    <button onclick="window.removeItem(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                `;
                if (cartItemsContainer) cartItemsContainer.appendChild(itemRow);
            });
            addCartActions();
        }

        if (cartCount) cartCount.textContent = totalCount;
        if (totalPriceEl) totalPriceEl.textContent = totalPrice.toLocaleString();
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    function addCartActions() {
        let cartModalContent = document.querySelector('#cartModal .modal-content');
        if (!cartModalContent) return;
        
        let actionsDiv = cartModalContent.querySelector('.cart-actions');
        if (!actionsDiv) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'cart-actions';
            cartModalContent.appendChild(actionsDiv);
        }

        const currentLang = document.documentElement.getAttribute('lang') || 'ar';
        
        if (currentLang === 'en') {
            actionsDiv.innerHTML = `
                <button class="continue-shopping-btn" id="continue-shopping">Continue Shopping</button>
                <button class="checkout-btn" id="proceed-checkout">Checkout</button>
            `;
        } else {
            actionsDiv.innerHTML = `
                <button class="continue-shopping-btn" id="continue-shopping">متابعة التسوق</button>
                <button class="checkout-btn" id="proceed-checkout">إتمام الشراء</button>
            `;
        }

        const contShopBtn = document.getElementById('continue-shopping');
        const procCheckBtn = document.getElementById('proceed-checkout');

        if (contShopBtn) contShopBtn.onclick = closeModalFunc;
        if (procCheckBtn) {
            procCheckBtn.onclick = () => {
                closeModalFunc();
                openModal('checkout');
            };
        }
    }

    function removeCartActions() {
        const actionsDiv = document.querySelector('#cartModal .cart-actions');
        if (actionsDiv) {
            actionsDiv.remove();
        }
    }

    // ==============================================================================
    // 6. التعامل مع نموذج إتمام الشراء (Checkout & Validation)
    // ==============================================================================
    const checkoutForm = document.getElementById('checkout-form');
    const phoneInput = document.getElementById('phone-input');
    const phoneErrorMsg = document.querySelector('#phone-input + .error-msg');
    const governorateSelect = document.getElementById('governorate-select');
    const manualGovGroup = document.getElementById('manual-governorate-group');
    const manualGovInput = document.getElementById('manual-governorate-input');

    const validateEgyptianPhone = (phone) => {
        return /^01[0-2,5][0-9]{8}$/.test(phone);
    };

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            if (validateEgyptianPhone(e.target.value)) {
                phoneInput.style.borderColor = '#c5a97d';
                if (phoneErrorMsg) phoneErrorMsg.style.display = 'none';
            } else {
                phoneInput.style.borderColor = '#ff4d4d';
                if (phoneErrorMsg) phoneErrorMsg.style.display = 'block';
            }
        });
    }

    if (governorateSelect) {
        governorateSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Other') {
                if (manualGovGroup) manualGovGroup.style.display = 'flex';
                if (manualGovInput) manualGovInput.setAttribute('required', 'required');
            } else {
                if (manualGovGroup) manualGovGroup.style.display = 'none';
                if (manualGovInput) manualGovInput.removeAttribute('required');
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const phone = phoneInput ? phoneInput.value : '';
            if (!validateEgyptianPhone(phone)) {
                alert('يرجى إدخال رقم هاتف مصري صحيح للمتابعة (11 رقم).');
                if (phoneInput) phoneInput.focus();
                return;
            }

            alert('تم تسجيل طلبك بنجاح! سنتواصل معك قريباً لتأكيد الشحن.');
            cart = [];
            updateCartUI();
            closeModalFunc();
            checkoutForm.reset();
            if (manualGovGroup) manualGovGroup.style.display = 'none';
        });
    }

    // ==============================================================================
    // 7. مبدل اللغة (Language Switcher)
    // ==============================================================================
    const langBtn = document.getElementById('lang-btn');
    const elementsToTranslate = document.querySelectorAll('.lang-text');
    const inputsToTranslate = document.querySelectorAll('.lang-input');

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const htmlElement = document.documentElement;
            const isArabic = htmlElement.getAttribute('lang') === 'ar';

            if (isArabic) {
                htmlElement.setAttribute('lang', 'en');
                htmlElement.setAttribute('dir', 'ltr');
                langBtn.textContent = 'AR';
                
                elementsToTranslate.forEach(element => {
                    if (element.getAttribute('data-en')) {
                        element.innerHTML = element.getAttribute('data-en');
                    }
                });
                inputsToTranslate.forEach(input => {
                    if (input.getAttribute('data-en-placeholder')) {
                        input.placeholder = input.getAttribute('data-en-placeholder');
                    }
                });
            } else {
                htmlElement.setAttribute('lang', 'ar');
                htmlElement.setAttribute('dir', 'rtl');
                langBtn.textContent = 'EN';

                elementsToTranslate.forEach(element => {
                    if (element.getAttribute('data-ar')) {
                        element.innerHTML = element.getAttribute('data-ar');
                    }
                });
                inputsToTranslate.forEach(input => {
                    if (input.getAttribute('data-ar-placeholder')) {
                        input.placeholder = input.getAttribute('data-ar-placeholder');
                    }
                });
            }

            if (cart.length > 0) {
                addCartActions();
            }
        });
    }

    // تهيئة أولية
    renderProducts();
    updateCartUI();

});