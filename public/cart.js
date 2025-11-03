// Funciones globales del carrito

// Datos de productos disponibles
const PRODUCTS = {
	's900': {
		name: 'Extensor Dual Screen S900',
		price: 799,
		url: '/extensor-2-monitores-s900'
	},
	's788': {
		name: 'Extensor Triple Screen S788',
		price: 999,
		url: '/extensor-3-monitores'
	}
};

// Funciones de cookies
function getCart() {
	const cartCookie = document.cookie
		.split('; ')
		.find(row => row.startsWith('cart='));
	
	if (!cartCookie) return [];
	
	try {
		const cartData = decodeURIComponent(cartCookie.split('=')[1]);
		return JSON.parse(cartData);
	} catch {
		return [];
	}
}

function saveCart(cart) {
	const cartData = JSON.stringify(cart);
	const expires = new Date();
	expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días
	document.cookie = `cart=${encodeURIComponent(cartData)}; expires=${expires.toUTCString()}; path=/`;
	
	// Disparar evento para actualizar contadores
	document.dispatchEvent(new CustomEvent('cartUpdated'));
	window.dispatchEvent(new Event('storage'));
}

// Función para agregar producto al carrito
function addToCart(productId, quantity = 1) {
	const cart = getCart();
	const existingItem = cart.find(item => item.id === productId);
	
	if (existingItem) {
		existingItem.quantity = (existingItem.quantity || 1) + quantity;
	} else {
		cart.push({
			id: productId,
			quantity: quantity
		});
	}
	
	saveCart(cart);
	
	// Mostrar notificación
	showCartNotification();
	
	// Actualizar contador del carrito
	updateCartCount();
}

// Función para mostrar notificación de producto agregado
function showCartNotification() {
	// Crear elemento de notificación
	const notification = document.createElement('div');
	notification.className = 'fixed top-24 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in';
	notification.innerHTML = `
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
		</svg>
		<span>Producto agregado al carrito</span>
	`;
	
	document.body.appendChild(notification);
	
	setTimeout(() => {
		notification.classList.remove('animate-slide-in');
		notification.classList.add('animate-slide-out');
		setTimeout(() => {
			notification.remove();
		}, 300);
	}, 3000);
}

// Función para actualizar contador del carrito
function updateCartCount() {
	const cart = getCart();
	const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
	const cartCountElements = document.querySelectorAll('#cart-count');
	
	cartCountElements.forEach(cartCount => {
		if (cartCount) {
			if (totalItems > 0) {
				cartCount.textContent = totalItems > 99 ? '99+' : totalItems;
				cartCount.classList.remove('opacity-0', 'pointer-events-none');
				cartCount.classList.add('opacity-100');
			} else {
				cartCount.classList.add('opacity-0', 'pointer-events-none');
				cartCount.classList.remove('opacity-100');
			}
		}
	});
}

// Inicializar contador al cargar
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
	updateCartCount();
}

// Actualizar cuando cambie el carrito
document.addEventListener('cartUpdated', updateCartCount);
window.addEventListener('storage', updateCartCount);

// Función para abrir modal del carrito (si existe)
function openCartModal() {
	if (window.openCartModal) {
		window.openCartModal();
	} else {
		// Si no hay modal, redirigir a la página del carrito
		window.location.href = '/carrito';
	}
}

