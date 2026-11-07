<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title> ROJE.Wig | Premium Wigs Online</title>

<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
html{scroll-behavior:smooth}
body{background:#fff8fb;color:#2b1b25}
button,input,select{font:inherit}
button{cursor:pointer}

header{position:sticky;top:0;z-index:1000;background:#fffffff7;border-bottom:1px solid #f0dce6}
.top-bar{background:#2b1b25;color:#fff;text-align:center;padding:9px;font-size:13px}
.navbar{max-width:1250px;margin:auto;min-height:75px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;gap:25px}
.logo{font-size:26px;font-weight:800;color:#b7356d;text-decoration:none;white-space:nowrap}
.logo span{color:#2b1b25}
nav{display:flex;gap:25px}
nav a{color:#2b1b25;text-decoration:none;font-weight:600;font-size:14px}
nav a:hover{color:#b7356d}
.nav-actions{display:flex;align-items:center;gap:10px}
.icon-btn{width:42px;height:42px;border:1px solid #ead5df;background:#fff;border-radius:50%;font-size:18px;position:relative}
.icon-btn:hover{background:#fff0f6}
.cart-count{position:absolute;top:-4px;right:-3px;background:#b7356d;color:#fff;width:19px;height:19px;border-radius:50%;font-size:11px;display:flex;align-items:center;justify-content:center}

.hero{min-height:570px;display:flex;align-items:center;background:linear-gradient(90deg,#e876a9fa 0%,#efaecbad 45%,#f4f3f414 100%),url("C:/Users/admin/Desktop/R&M Web/co  is ver.jpg") center/cover;}.hero-content{max-width:1250px;width:100%;margin:auto;padding:70px 20px}
.hero-content small,.section-heading small{color:#b7356d;font-weight:800;text-transform:uppercase;letter-spacing:2px}
.hero h1{font-size:clamp(45px,6vw,78px);line-height:1;max-width:650px;margin:18px 0}
.hero p{max-width:550px;color:#624e59;font-size:18px;line-height:1.7;margin-bottom:30px}
.primary-btn{border:0;background:#b7356d;color:#fff;padding:15px 28px;border-radius:8px;font-weight:700}
.primary-btn:hover{background:#922653}
.secondary-btn{border:1px solid #b7356d;background:#fff;color:#b7356d;padding:14px 27px;border-radius:8px;font-weight:700}
.secondary-btn:hover{background:#fff0f6}

.features{background:#fff;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #f0dce6}
.feature{padding:28px 20px;text-align:center;border-right:1px solid #f0dce6}
.feature:last-child{border:0}
.feature-icon{font-size:28px;margin-bottom:10px}
.feature h3{font-size:15px;margin-bottom:5px}
.feature p{font-size:12px;color:#806b76}

.section{max-width:1250px;margin:auto;padding:80px 20px}
.section-heading{text-align:center;margin-bottom:40px}
.section-heading h2{font-size:40px;margin-top:10px}
.section-heading p{color:#806b76;margin-top:10px}

.categories{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.category-card{height:240px;border-radius:15px;overflow:hidden;position:relative;cursor:pointer}
.category-card img{width:100%;height:100%;object-fit:cover;transition:.4s}
.category-card:hover img{transform:scale(1.07)}
.category-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;padding:22px;background:linear-gradient(transparent,#000b);color:#fff}
.category-overlay h3{font-size:23px}

.shop-header{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:30px;flex-wrap:wrap}
.search-box{display:flex;border:1px solid #ead5df;background:#fff;border-radius:8px;overflow:hidden;min-width:280px}
.search-box input{border:0;outline:0;padding:13px;width:240px}
.search-box button{border:0;background:#fff0f6;padding:0 15px}
.filters{display:flex;gap:10px;flex-wrap:wrap}
.filter-btn{border:1px solid #e7d1dc;background:#fff;padding:10px 16px;border-radius:20px;color:#573d49}
.filter-btn.active,.filter-btn:hover{background:#b7356d;color:#fff;border-color:#b7356d}
.sort-select{padding:11px 15px;border:1px solid #ead5df;border-radius:8px;background:#fff;outline:0}

.products{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.product-card{background:#fff;border-radius:13px;overflow:hidden;border:1px solid #f0dce6;transition:.3s}
.product-card:hover{transform:translateY(-5px);box-shadow:0 12px 30px #53253b1a}
.product-image{height:300px;position:relative;overflow:hidden;background:#f7eaf0}
.product-image img{width:100%;height:100%;object-fit:cover;transition:.4s}
.product-card:hover .product-image img{transform:scale(1.04)}
.badge{position:absolute;left:12px;top:12px;background:#2b1b25;color:#fff;padding:6px 9px;border-radius:5px;font-size:11px;font-weight:700}
.heart{position:absolute;right:12px;top:12px;width:38px;height:38px;border-radius:50%;border:0;background:#fff;font-size:18px}
.heart.liked{color:#b7356d}
.product-info{padding:18px}
.product-category{color:#a6788e;font-size:11px;text-transform:uppercase;font-weight:700}
.product-info h3{margin:7px 0;font-size:17px}
.rating{color:#d69b20;font-size:13px}
.reviews{color:#99818d;font-size:12px}
.product-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:15px}
.price{font-size:20px;font-weight:800;color:#b7356d}
.add-cart{border:0;background:#2b1b25;color:#fff;padding:10px 13px;border-radius:7px;font-size:12px;font-weight:700}
.add-cart:hover{background:#b7356d}

.about{background:#f8eaf1}
.about-container{max-width:1250px;margin:auto;padding:80px 20px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.about-image img{width:100%;height:500px;object-fit:cover;border-radius:18px}
.about-text small{color:#b7356d;font-weight:800;letter-spacing:2px}
.about-text h2{font-size:42px;margin:15px 0}
.about-text p{color:#68545f;line-height:1.8;margin-bottom:20px}
.check{margin:12px 0;font-weight:600}

.newsletter{background:#2b1b25;color:#fff;text-align:center;padding:70px 20px}
.newsletter h2{font-size:35px;margin-bottom:10px}
.newsletter p{color:#dbcbd3;margin-bottom:25px}
.newsletter-form{display:flex;justify-content:center;max-width:520px;margin:auto}
.newsletter-form input{flex:1;border:0;padding:15px;outline:0;border-radius:7px 0 0 7px}
.newsletter-form button{border:0;background:#b7356d;color:#fff;padding:0 22px;border-radius:0 7px 7px 0;font-weight:700}

footer{background:#20151c;color:#fff;padding:60px 20px 25px}
.footer-container{max-width:1250px;margin:auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px}
.footer-logo{color:#ef78a9;font-size:25px;font-weight:800}
footer p{color:#bbaab3;line-height:1.7;margin-top:12px;font-size:14px}
footer h3{margin-bottom:15px}
footer a{display:block;color:#bbaab3;text-decoration:none;margin:10px 0;font-size:14px}
footer a:hover{color:#fff}
.copyright{max-width:1250px;margin:45px auto 0;padding-top:20px;border-top:1px solid #3c2d35;color:#9b8b94;font-size:13px}

.modal{position:fixed;inset:0;background:#0000008c;z-index:2000;display:none;align-items:center;justify-content:center;padding:20px}
.modal.show{display:flex}
.modal-content{background:#fff;width:100%;max-width:650px;max-height:90vh;overflow-y:auto;border-radius:15px;padding:30px;position:relative}
.close{position:absolute;top:15px;right:18px;border:0;background:0;font-size:25px}
.modal h2{margin-bottom:25px}

.cart-item{display:flex;gap:15px;border-bottom:1px solid #eee;padding:15px 0}
.cart-item img{width:80px;height:80px;border-radius:8px;object-fit:cover}
.cart-details{flex:1}
.cart-details h4{margin-bottom:5px}
.cart-price{color:#b7356d;font-weight:700}
.quantity{display:flex;align-items:center;gap:8px;margin-top:8px}
.quantity button{width:27px;height:27px;border:1px solid #ddd;background:#fff;border-radius:5px}
.remove-btn{border:0;background:0;color:#b7356d;font-size:12px;margin-top:5px}
.cart-total{display:flex;justify-content:space-between;font-size:20px;font-weight:800;padding:20px 0}
.empty-cart{text-align:center;padding:35px 10px;color:#806b76}

.checkout-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.form-group{margin-bottom:15px}
.form-group label{display:block;margin-bottom:7px;font-size:13px;font-weight:700}
.form-group input,.form-group select,.form-group textarea{width:100%;border:1px solid #e2d3da;border-radius:7px;padding:12px;outline:0}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#b7356d}
.payment-options{display:grid;gap:10px}
.payment-option{border:1px solid #e3d4db;padding:14px;border-radius:8px}
.payment-option label{cursor:pointer;font-weight:600}
.checkout-summary{background:#fff4f8;padding:18px;border-radius:10px;margin:20px 0}
.summary-row{display:flex;justify-content:space-between;padding:7px 0}

.auth-form input{width:100%;padding:13px;border:1px solid #e3d4db;border-radius:7px;margin-bottom:13px;outline:0}
.auth-form button{width:100%}
.switch-auth{text-align:center;margin-top:15px;font-size:13px}
.switch-auth span{color:#b7356d;font-weight:700;cursor:pointer}
.account-box{text-align:center;padding:10px 5px 5px}
.account-avatar{width:70px;height:70px;border-radius:50%;background:#fff0f6;color:#b7356d;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 15px}
.account-box h3{margin-bottom:5px}.account-box p{color:#806b76;font-size:14px;margin-bottom:20px}
.account-actions{display:grid;gap:10px}
.danger-btn{border:1px solid #b7356d;background:#fff;color:#b7356d;padding:13px;border-radius:8px;font-weight:700;cursor:pointer}
.danger-btn:hover{background:#fff0f6}

.toast{position:fixed;bottom:25px;right:25px;background:#2b1b25;color:#fff;padding:15px 20px;border-radius:8px;transform:translateY(100px);opacity:0;transition:.3s;z-index:5000}
.toast.show{transform:translateY(0);opacity:1}

@media(max-width:1000px){
.products{grid-template-columns:repeat(3,1fr)}
.categories{grid-template-columns:repeat(2,1fr)}
.features{grid-template-columns:repeat(2,1fr)}
.footer-container{grid-template-columns:1fr 1fr}
}
@media(max-width:750px){
nav{display:none}
.hero{min-height:500px}
.products{grid-template-columns:repeat(2,1fr)}
.about-container{grid-template-columns:1fr}
.about-image img{height:350px}
.checkout-grid{grid-template-columns:1fr}
}
@media(max-width:520px){
.navbar{padding:0 12px}
.logo{font-size:21px}
.nav-actions{gap:5px}
.icon-btn{width:36px;height:36px}
.products,.categories,.features,.footer-container{grid-template-columns:1fr}
.feature{border-right:0;border-bottom:1px solid #f0dce6}
.newsletter-form{flex-direction:column;gap:10px}
.newsletter-form input,.newsletter-form button{border-radius:7px;padding:14px}
.shop-header{align-items:stretch}
.search-box{width:100%}
.search-box input{width:100%}
}
</style>
</head>

<body>
<header>
<div class="top-bar">✨ Free shipping on orders over ₱2,500</div>
<div class="navbar">
<a href="#" class="logo">ROJE.<span>Wig</span></a>
<nav>
<a href="#home">Home</a><a href="#shop">Shop</a><a href="#categories">Collections</a><a href="#about">About</a><a href="#contact">Contact</a>
</nav>
<div class="nav-actions">
<button class="icon-btn" onclick="openAuth()" title="Account">👤</button>
<button class="icon-btn" onclick="openWishlist()" title="Wishlist">♡</button>
<button class="icon-btn" onclick="openCart()" title="Cart">🛒<span class="cart-count" id="cartCount">0</span></button>
</div>
</div>
</header>

<section class="hero" id="home">
<div class="hero-content">
<small>Premium Hair Collection</small>
<h1>Your Hair.<br>Your Confidence.</h1>
<p>Discover premium-quality wigs designed to help you express your beauty, personality, and confidence every day.</p>
<button class="primary-btn" onclick="scrollToShop()">Shop Collection</button>
<button class="secondary-btn" onclick="document.getElementById('categories').scrollIntoView()">Explore Styles</button>
</div>
</section>

<section class="features">
<div class="feature"><div class="feature-icon">🚚</div><h3>Fast Delivery</h3><p>Reliable nationwide shipping</p></div>
<div class="feature"><div class="feature-icon">✨</div><h3>Premium Quality</h3><p>Beautiful and comfortable wigs</p></div>
<div class="feature"><div class="feature-icon">🔒</div><h3>Secure Payment</h3><p>Safe and protected checkout</p></div>
<div class="feature"><div class="feature-icon">💬</div><h3>Customer Support</h3><p>We're here when you need us</p></div>
</section>

<section class="section" id="categories">
<div class="section-heading"><small>Shop by Style</small><h2>Find Your Perfect Look</h2><p>Explore our most-loved wig collections.</p></div>
<div class="categories">
<div class="category-card" onclick="filterCategory('Straight')"><img src="C:\Users\admin\Downloads\straight long.png"><div class="category-overlay"><h3>Straight Wigs</h3></div></div>
<div class="category-card" onclick="filterCategory('Curly')"><img src="C:\Users\admin\Downloads\curlyy.png"><div class="category-overlay"><h3>Curly Wigs</h3></div></div>
<div class="category-card" onclick="filterCategory('Bob')"><img src="C:\Users\admin\Downloads\Bob hair.png"><div class="category-overlay"><h3>Bob Wigs</h3></div></div>
<div class="category-card" onclick="filterCategory('Lace')"><img src="C:\Users\admin\OneDrive\Desktop\R&M Web\front lace.png"><div class="category-overlay"><h3>Lace Front</h3></div></div>
</div>
</section>

<section class="section" id="shop">
<div class="section-heading"><small>Our Collection</small><h2>Shop Wigs</h2><p>Premium styles for every occasion.</p></div>
<div class="shop-header">
<div class="search-box"><input id="searchInput" placeholder="Search wigs..." oninput="searchProducts()"><button>🔎</button></div>
<select class="sort-select" id="sortSelect" onchange="sortProducts()">
<option value="default">Sort: Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Highest Rated</option>
</select>
</div>
<div class="filters">
<button class="filter-btn active" onclick="filterCategory('All',this)">All</button>
<button class="filter-btn" onclick="filterCategory('Straight',this)">Straight</button>
<button class="filter-btn" onclick="filterCategory('Curly',this)">Curly</button>
<button class="filter-btn" onclick="filterCategory('Bob',this)">Bob</button>
<button class="filter-btn" onclick="filterCategory('Lace',this)">Lace Front</button>
</div><br>
<div class="products" id="productGrid"></div>
</section>

<section class="about" id="about">
<div class="about-container">
<div class="about-image"><img src="C:\Users\admin\Desktop\R&M Web\watermarked_img_13305642138444145026 (1).jpg"></div>
<div class="about-text">
<small>Why ROJE.Wig?</small><h2>Made for your confidence.</h2>
<p>At ROJE.Wig, we believe hair is more than an accessory. It's a way to express your identity, creativity, and confidence.</p>
<p>We carefully select beautiful wig styles that combine comfort, quality, and modern fashion.</p>
<div class="check">✓ Premium-looking styles</div><div class="check">✓ Comfortable everyday wear</div><div class="check">✓ Affordable prices</div><div class="check">✓ Customer-first service</div><br>
<button class="primary-btn" onclick="scrollToShop()">Shop Now</button>
</div>
</div>
</section>

<section class="newsletter">
<h2>Get 10% Off Your First Order</h2>
<p>Subscribe to our newsletter for new arrivals, promotions, and exclusive offers.</p>
<form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
<input type="email" placeholder="Enter your email address" required><button>Subscribe</button>
</form>
</section>

<footer id="contact">
<div class="footer-container">
<div><div class="footer-logo">ROJE.Wig</div><p>Premium wigs for every style, occasion, and personality.</p><p>📍 Philippines<br>📧 support@roje.wig<br>📞 +63 9940605849</p></div>
<div><h3>Shop</h3><a href="#shop">All Wigs</a><a href="#shop">Straight Wigs</a><a href="#shop">Curly Wigs</a><a href="#shop">Bob Wigs</a></div>
<div><h3>Customer Care</h3><a href="#">Shipping & Delivery</a><a href="#">Returns & Exchanges</a><a href="#">Size Guide</a><a href="#">FAQs</a></div>
<div><h3>Follow Us</h3><a href="https://www.facebook.com/share/19gRMjLsae/?mibextid=wwXIfr">Facebook</a><a href="https://www.instagram.com/roje.wig?igsi=MXY4d3pnbGIyN2Z2Yw%3D%3D&utm_source=qr">Instagram</a><a href="#">TikTok</a><a href="#">Messenger</a></div>
</div>
<div class="copyright">© 2026 ROJE.Wig. |MASANGYA & SILONGAN| All Rights Reserved.</div>
</footer>

<div class="modal" id="cartModal">
<div class="modal-content"><button class="close" onclick="closeModal('cartModal')">×</button><h2>Shopping Cart</h2><div id="cartItems"></div><div class="cart-total"><span>Total</span><span id="cartTotal">₱0.00</span></div><button class="primary-btn" style="width:100%" onclick="openCheckout()">Proceed to Checkout</button></div>
</div>

<div class="modal" id="checkoutModal">
<div class="modal-content"><button class="close" onclick="closeModal('checkoutModal')">×</button><h2>Checkout</h2>
<form onsubmit="placeOrder(event)">
<div class="checkout-grid">
<div>
<div class="form-group"><label>First Name</label><input required></div>
<div class="form-group"><label>Last Name</label><input required></div>
<div class="form-group"><label>Email</label><input type="email" required></div>
<div class="form-group"><label>Phone Number</label><input type="tel" required></div>
</div>
<div>
<div class="form-group"><label>Complete Address</label><textarea rows="4" required></textarea></div>
<div class="form-group"><label>City</label><input required></div>
<div class="form-group"><label>Postal Code</label><input required></div>
</div>
</div>
<h3>Payment Method</h3>
<div class="payment-options">
<div class="payment-option"><label><input type="radio" name="payment" value="COD" checked> Cash on Delivery</label></div>
<div class="payment-option"><label><input type="radio" name="payment" value="GCash"> GCash</label></div>
<div class="payment-option"><label><input type="radio" name="payment" value="Card"> Credit / Debit Card</label></div>
</div> 
<div class="checkout-summary">
<div class="summary-row"><span>Subtotal</span><strong id="checkoutSubtotal">₱0.00</strong></div>
<div class="summary-row"><span>Shipping</span><strong id="checkoutShipping">₱150.00</strong></div><hr>
<div class="summary-row"><strong>Total</strong><strong id="checkoutTotal">₱0.00</strong></div>
</div>
<button class="primary-btn" style="width:100%">Place Order</button>
</form></div>
</div>

<div class="modal" id="authModal">
<div class="modal-content"><button class="close" onclick="closeModal('authModal')">×</button>
<div id="authContent"></div>
</div>
</div>

<div class="modal" id="wishlistModal">
<div class="modal-content"><button class="close" onclick="closeModal('wishlistModal')">×</button><h2>My Wishlist ❤️</h2><div id="wishlistItems"></div></div>
</div>

<div class="toast" id="toast"></div>

<script>
const products=[
{id:1,name:"Silky Straight 24”",category:"Straight",price:3299,rating:4.9,reviews:128,image:"C:/Users/admin/Downloads/sily straight.png",badge:"BEST SELLER"},
{id:2,name:"Natural Curly 20”",category:"Curly",price:2899,rating:4.8,reviews:94,image:"C:/Users/admin/Desktop/R&M Web/natural curl.png",badge:"POPULAR"},
{id:3,name:"Classic Bob 12”",category:"Bob",price:2199,rating:4.7,reviews:76,image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80",badge:"NEW"},
{id:4,name:"HD Lace Front 26”",category:"Lace",price:4499,rating:5,reviews:51,image:"https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=80",badge:"PREMIUM"},
{id:5,name:"Honey Straight 18”",category:"Straight",price:2499,rating:4.6,reviews:65,image:"C:/Users/admin/Desktop/R&M Web/honey straight.png",badge:""},
{id:6,name:"Soft Wave 22”",category:"Curly",price:3199,rating:4.9,reviews:88,image:"C:/Users/admin/Desktop/R&M Web/soft curl.png",badge:"TRENDING"},
{id:7,name:"Luxury Bob 14”",category:"Bob",price:2599,rating:4.8,reviews:43,image:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",badge:""},
{id:8,name:"Transparent Lace 24”",category:"Lace",price:4999,rating:4.9,reviews:39,image:"https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=700&q=80",badge:"PREMIUM"}
];

let cart=JSON.parse(localStorage.getItem("ROJE.WigCart"))||[],wishlist=JSON.parse(localStorage.getItem("ROJE.WigWishlist"))||[],currentCategory="All";

const money=v=>"₱"+v.toLocaleString("en-PH",{minimumFractionDigits:2});

function displayProducts(list=products){
const grid=document.getElementById("productGrid");
if(!list.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px"><h3>No products found.</h3><p style="color:#806b76;margin-top:8px">Try another search or category.</p></div>';return}
grid.innerHTML=list.map(p=>`
<div class="product-card"><div class="product-image">
<img src="${p.image}" alt="${p.name}">${p.badge?`<span class="badge">${p.badge}</span>`:""}
<button class="heart ${wishlist.includes(p.id)?"liked":""}" onclick="toggleWishlist(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
</div><div class="product-info"><span class="product-category">${p.category} Wig</span>
<h3>${p.name}</h3><div><span class="rating">${"★".repeat(Math.round(p.rating))}</span><span class="reviews">(${p.reviews})</span></div>
<div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-cart" onclick="addToCart(${p.id})">Add to Cart</button></div>
</div></div>`).join("");
}

function filterCategory(c,btn){
currentCategory=c;
document.querySelectorAll(".filter-btn").forEach(x=>x.classList.remove("active"));
if(btn)btn.classList.add("active");
else document.querySelectorAll(".filter-btn").forEach(x=>x.textContent.trim().toLowerCase().includes(c.toLowerCase())&&x.classList.add("active"));
applyFilters();
document.getElementById("shop").scrollIntoView({behavior:"smooth"});
}

function searchProducts(){applyFilters()}

function applyFilters(){
const s=document.getElementById("searchInput").value.toLowerCase();
let r=products.filter(p=>(currentCategory==="All"||p.category===currentCategory)&&(p.name.toLowerCase().includes(s)||p.category.toLowerCase().includes(s)));
sortList(r);displayProducts(r);
}

function sortProducts(){applyFilters()}

function sortList(l){
const s=document.getElementById("sortSelect").value;
if(s==="low")l.sort((a,b)=>a.price-b.price);
if(s==="high")l.sort((a,b)=>b.price-a.price);
if(s==="rating")l.sort((a,b)=>b.rating-a.rating);
}

function addToCart(id){
const x=cart.find(i=>i.id===id);
x?x.quantity++:cart.push({id,quantity:1});
saveCart();showToast("Added to your cart 🛒");
}

function saveCart(){
localStorage.setItem("ROJE.WigCart",JSON.stringify(cart));updateCartCount();
}

function updateCartCount(){
document.getElementById("cartCount").textContent=cart.reduce((t,i)=>t+i.quantity,0);
}

function getCartTotal(){
return cart.reduce((t,i)=>{const p=products.find(x=>x.id===i.id);return t+p.price*i.quantity},0);
}

function openCart(){renderCart();document.getElementById("cartModal").classList.add("show")}

function renderCart(){
const c=document.getElementById("cartItems");
if(!cart.length){
c.innerHTML='<div class="empty-cart"><div style="font-size:45px">🛒</div><h3>Your cart is empty</h3><p>Add a beautiful wig to get started.</p></div>';
document.getElementById("cartTotal").textContent=money(0);return;
}
c.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return`
<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div class="cart-details"><h4>${p.name}</h4><div class="cart-price">${money(p.price)}</div>
<div class="quantity"><button onclick="changeQuantity(${p.id},-1)">−</button><strong>${i.quantity}</strong><button onclick="changeQuantity(${p.id},1)">+</button></div>
<button class="remove-btn" onclick="removeFromCart(${p.id})">Remove</button></div></div>`}).join("");
document.getElementById("cartTotal").textContent=money(getCartTotal());
}

function changeQuantity(id,n){
const i=cart.find(x=>x.id===id);if(!i)return;
i.quantity+=n;if(i.quantity<=0)cart=cart.filter(x=>x.id!==id);
saveCart();renderCart();
}

function removeFromCart(id){
cart=cart.filter(x=>x.id!==id);saveCart();renderCart();showToast("Item removed from cart");
}

function openCheckout(){
if(!cart.length){showToast("Your cart is empty.");return}
closeModal("cartModal");
const sub=getCartTotal(),ship=sub>=2500?0:150;
document.getElementById("checkoutSubtotal").textContent=money(sub);
document.getElementById("checkoutShipping").textContent=ship?"₱150.00":"FREE";
document.getElementById("checkoutTotal").textContent=money(sub+ship);
document.getElementById("checkoutModal").classList.add("show");
}

function placeOrder(e){
e.preventDefault();
const n="LW-"+Math.floor(100000+Math.random()*900000);
cart=[];saveCart();closeModal("checkoutModal");
showToast("Order "+n+" placed successfully! 🎉");
setTimeout(()=>alert("Thank you for your order!\n\nOrder Number: "+n+"\n\nThis demo checkout does not process real payments."),500);
}

function toggleWishlist(id){
wishlist.includes(id)?(wishlist=wishlist.filter(x=>x!==id),showToast("Removed from wishlist")):(wishlist.push(id),showToast("Added to wishlist ❤️"));
localStorage.setItem("ROJE.WigWishlist",JSON.stringify(wishlist));applyFilters();
}

function openWishlist(){
const c=document.getElementById("wishlistItems"),items=products.filter(p=>wishlist.includes(p.id));
c.innerHTML=items.length?items.map(p=>`
<div class="cart-item"><img src="${p.image}"><div class="cart-details"><h4>${p.name}</h4><div class="cart-price">${money(p.price)}</div>
<button class="add-cart" style="margin-top:10px" onclick="addToCart(${p.id})">Add to Cart</button></div></div>`).join(""):'<div class="empty-cart"><div style="font-size:45px">♡</div><h3>Your wishlist is empty</h3><p>Tap the heart on products you love.</p></div>';
document.getElementById("wishlistModal").classList.add("show");
}

let loginMode=true;
let accounts=JSON.parse(localStorage.getItem("ROJE.WigAccounts"))||[];
let currentUser=JSON.parse(localStorage.getItem("ROJE.WigCurrentUser"))||null;

function saveAccounts(){localStorage.setItem("ROJE.WigAccounts",JSON.stringify(accounts))}
function saveCurrentUser(){currentUser?localStorage.setItem("ROJE.WigCurrentUser",JSON.stringify(currentUser)):localStorage.removeItem("ROJE.WigCurrentUser")}

function openAuth(){
renderAuth();
document.getElementById("authModal").classList.add("show")
}

function renderAuth(){
const c=document.getElementById("authContent");
if(currentUser){
c.innerHTML=`<div class="account-box">
<div class="account-avatar">👤</div>
<h2>My Account</h2>
<h3>${currentUser.name}</h3>
<p>${currentUser.email}</p>
<div class="account-actions">
<button class="primary-btn" onclick="closeModal('authModal');showToast('Welcome back, ${currentUser.name.split(" ")[0]}! 👋')">Continue Shopping</button>
<button class="danger-btn" onclick="logout()">Logout</button>
</div>
</div>`;
return;
}
c.innerHTML=`<h2 id="authTitle">${loginMode?"Login":"Create Account"}</h2>
<form class="auth-form" onsubmit="handleAuth(event)">
${loginMode?"":'<input type="text" id="authName" placeholder="Full name" required>'}
<input type="email" id="authEmail" placeholder="Email address" required>
<input type="password" id="authPassword" placeholder="Password" minlength="6" required>
${loginMode?"":'<input type="password" id="authConfirmPassword" placeholder="Confirm password" minlength="6" required>'}
<button class="primary-btn">${loginMode?"Login":"Create Account"}</button>
</form>
<div class="switch-auth">${loginMode?'Don\'t have an account? <span onclick="toggleAuth()">Create one</span>':'Already have an account? <span onclick="toggleAuth()">Login</span>'}</div>`;
}

function toggleAuth(){
loginMode=!loginMode;
renderAuth();
}

function handleAuth(e){
e.preventDefault();
const email=document.getElementById("authEmail").value.trim().toLowerCase();
const password=document.getElementById("authPassword").value;

if(loginMode){
const account=accounts.find(a=>a.email===email&&a.password===password);
if(!account){showToast("Invalid email or password.");return}
currentUser={name:account.name,email:account.email};
saveCurrentUser();
closeModal("authModal");
showToast(`Login successful! Welcome, ${account.name.split(" ")[0]} 👋`);
updateAccountButton();
}else{
const name=document.getElementById("authName").value.trim();
const confirm=document.getElementById("authConfirmPassword").value;
if(password!==confirm){showToast("Passwords do not match.");return}
if(accounts.some(a=>a.email===email)){showToast("An account with this email already exists.");return}
const account={name,email,password};
accounts.push(account);
saveAccounts();
currentUser={name,email};
saveCurrentUser();
closeModal("authModal");
showToast(`Account created! Welcome, ${name.split(" ")[0]} 🎉`);
updateAccountButton();
}
}

function logout(){
currentUser=null;
saveCurrentUser();
closeModal("authModal");
updateAccountButton();
showToast("You have been logged out.");
}

function updateAccountButton(){
const btn=document.querySelector('.nav-actions .icon-btn[title="Account"]');
if(btn){
btn.title=currentUser?`Account: ${currentUser.name}`:"Account";
btn.textContent="👤";
}
}

function subscribeNewsletter(e){
e.preventDefault();showToast("You're subscribed! Check your inbox 💌");e.target.reset();
}

function closeModal(id){document.getElementById(id).classList.remove("show")}

document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>e.target===m&&m.classList.remove("show")));

function showToast(msg){
const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");
setTimeout(()=>t.classList.remove("show"),2500);
}

function scrollToShop(){document.getElementById("shop").scrollIntoView({behavior:"smooth"})}

displayProducts();updateCartCount();updateAccountButton();
</script>
</body>
</html><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title> ROJEWig | Premium Wigs Online</title>

<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
html{scroll-behavior:smooth}
body{background:#fff8fb;color:#2b1b25}
button,input,select{font:inherit}
button{cursor:pointer}

header{position:sticky;top:0;z-index:1000;background:#fffffff7;border-bottom:1px solid #f0dce6}
.top-bar{background:#2b1b25;color:#fff;text-align:center;padding:9px;font-size:13px}
.navbar{max-width:1250px;margin:auto;min-height:75px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;gap:25px}
.logo{font-size:26px;font-weight:800;color:#b7356d;text-decoration:none;white-space:nowrap}
.logo span{color:#2b1b25}
nav{display:flex;gap:25px}
nav a{color:#2b1b25;text-decoration:none;font-weight:600;font-size:14px}
nav a:hover{color:#b7356d}
.nav-actions{display:flex;align-items:center;gap:10px}
.icon-btn{width:42px;height:42px;border:1px solid #ead5df;background:#fff;border-radius:50%;font-size:18px;position:relative}
.icon-btn:hover{background:#fff0f6}
.cart-count{position:absolute;top:-4px;right:-3px;background:#b7356d;color:#fff;width:19px;height:19px;border-radius:50%;font-size:11px;display:flex;align-items:center;justify-content:center}

.hero{min-height:570px;display:flex;align-items:center;background:linear-gradient(90deg,#fff4f9fa 0%,#fff4f9e0 45%,#fff4f926 100%),url("C:\\Users\\Hi\\Desktop\\R&M WEB\\Screenshot 2026-09-05 142322.png") center/cover}
.hero-content{max-width:1250px;width:100%;margin:auto;padding:70px 20px}
.hero-content small,.section-heading small{color:#b7356d;font-weight:800;text-transform:uppercase;letter-spacing:2px}
.hero h1{font-size:clamp(45px,6vw,78px);line-height:1;max-width:650px;margin:18px 0}
.hero p{max-width:550px;color:#624e59;font-size:18px;line-height:1.7;margin-bottom:30px}
.primary-btn{border:0;background:#b7356d;color:#fff;padding:15px 28px;border-radius:8px;font-weight:700}
.primary-btn:hover{background:#922653}
.secondary-btn{border:1px solid #b7356d;background:#fff;color:#b7356d;padding:14px 27px;border-radius:8px;font-weight:700}
.secondary-btn:hover{background:#fff0f6}

.features{background:#fff;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #f0dce6}
.feature{padding:28px 20px;text-align:center;border-right:1px solid #f0dce6}
.feature:last-child{border:0}
.feature-icon{font-size:28px;margin-bottom:10px}
.feature h3{font-size:15px;margin-bottom:5px}
.feature p{font-size:12px;color:#806b76}

.section{max-width:1250px;margin:auto;padding:80px 20px}
.section-heading{text-align:center;margin-bottom:40px}
.section-heading h2{font-size:40px;margin-top:10px}
.section-heading p{color:#806b76;margin-top:10px}

.categories{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.category-card{height:240px;border-radius:15px;overflow:hidden;position:relative;cursor:pointer}
.category-card img{width:100%;height:100%;object-fit:cover;transition:.4s}
.category-card:hover img{transform:scale(1.07)}
.category-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;padding:22px;background:linear-gradient(transparent,#000b);color:#fff}
.category-overlay h3{font-size:23px}

.shop-header{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:30px;flex-wrap:wrap}
.search-box{display:flex;border:1px solid #ead5df;background:#fff;border-radius:8px;overflow:hidden;min-width:280px}
.search-box input{border:0;outline:0;padding:13px;width:240px}
.search-box button{border:0;background:#fff0f6;padding:0 15px}
.filters{display:flex;gap:10px;flex-wrap:wrap}
.filter-btn{border:1px solid #e7d1dc;background:#fff;padding:10px 16px;border-radius:20px;color:#573d49}
.filter-btn.active,.filter-btn:hover{background:#b7356d;color:#fff;border-color:#b7356d}
.sort-select{padding:11px 15px;border:1px solid #ead5df;border-radius:8px;background:#fff;outline:0}

.products{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.product-card{background:#fff;border-radius:13px;overflow:hidden;border:1px solid #f0dce6;transition:.3s}
.product-card:hover{transform:translateY(-5px);box-shadow:0 12px 30px #53253b1a}
.product-image{height:300px;position:relative;overflow:hidden;background:#f7eaf0}
.product-image img{width:100%;height:100%;object-fit:cover;transition:.4s}
.product-card:hover .product-image img{transform:scale(1.04)}
.badge{position:absolute;left:12px;top:12px;background:#2b1b25;color:#fff;padding:6px 9px;border-radius:5px;font-size:11px;font-weight:700}
.heart{position:absolute;right:12px;top:12px;width:38px;height:38px;border-radius:50%;border:0;background:#fff;font-size:18px}
.heart.liked{color:#b7356d}
.product-info{padding:18px}
.product-category{color:#a6788e;font-size:11px;text-transform:uppercase;font-weight:700}
.product-info h3{margin:7px 0;font-size:17px}
.rating{color:#d69b20;font-size:13px}
.reviews{color:#99818d;font-size:12px}
.product-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:15px}
.price{font-size:20px;font-weight:800;color:#b7356d}
.add-cart{border:0;background:#2b1b25;color:#fff;padding:10px 13px;border-radius:7px;font-size:12px;font-weight:700}
.add-cart:hover{background:#b7356d}

.about{background:#f8eaf1}
.about-container{max-width:1250px;margin:auto;padding:80px 20px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.about-image img{width:100%;height:500px;object-fit:cover;border-radius:18px}
.about-text small{color:#b7356d;font-weight:800;letter-spacing:2px}
.about-text h2{font-size:42px;margin:15px 0}
.about-text p{color:#68545f;line-height:1.8;margin-bottom:20px}
.check{margin:12px 0;font-weight:600}

.newsletter{background:#2b1b25;color:#fff;text-align:center;padding:70px 20px}
.newsletter h2{font-size:35px;margin-bottom:10px}
.newsletter p{color:#dbcbd3;margin-bottom:25px}
.newsletter-form{display:flex;justify-content:center;max-width:520px;margin:auto}
.newsletter-form input{flex:1;border:0;padding:15px;outline:0;border-radius:7px 0 0 7px}
.newsletter-form button{border:0;background:#b7356d;color:#fff;padding:0 22px;border-radius:0 7px 7px 0;font-weight:700}

footer{background:#20151c;color:#fff;padding:60px 20px 25px}
.footer-container{max-width:1250px;margin:auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px}
.footer-logo{color:#ef78a9;font-size:25px;font-weight:800}
footer p{color:#bbaab3;line-height:1.7;margin-top:12px;font-size:14px}
footer h3{margin-bottom:15px}
footer a{display:block;color:#bbaab3;text-decoration:none;margin:10px 0;font-size:14px}
footer a:hover{color:#fff}
.copyright{max-width:1250px;margin:45px auto 0;padding-top:20px;border-top:1px solid #3c2d35;color:#9b8b94;font-size:13px}

.modal{position:fixed;inset:0;background:#0000008c;z-index:2000;display:none;align-items:center;justify-content:center;padding:20px}
.modal.show{display:flex}
.modal-content{background:#fff;width:100%;max-width:650px;max-height:90vh;overflow-y:auto;border-radius:15px;padding:30px;position:relative}
.close{position:absolute;top:15px;right:18px;border:0;background:0;font-size:25px}
.modal h2{margin-bottom:25px}

.cart-item{display:flex;gap:15px;border-bottom:1px solid #eee;padding:15px 0}
.cart-item img{width:80px;height:80px;border-radius:8px;object-fit:cover}
.cart-details{flex:1}
.cart-details h4{margin-bottom:5px}
.cart-price{color:#b7356d;font-weight:700}
.quantity{display:flex;align-items:center;gap:8px;margin-top:8px}
.quantity button{width:27px;height:27px;border:1px solid #ddd;background:#fff;border-radius:5px}
.remove-btn{border:0;background:0;color:#b7356d;font-size:12px;margin-top:5px}
.cart-total{display:flex;justify-content:space-between;font-size:20px;font-weight:800;padding:20px 0}
.empty-cart{text-align:center;padding:35px 10px;color:#806b76}

.checkout-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.form-group{margin-bottom:15px}
.form-group label{display:block;margin-bottom:7px;font-size:13px;font-weight:700}
.form-group input,.form-group select,.form-group textarea{width:100%;border:1px solid #e2d3da;border-radius:7px;padding:12px;outline:0}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#b7356d}
.payment-options{display:grid;gap:10px}
.payment-option{border:1px solid #e3d4db;padding:14px;border-radius:8px}
.payment-option label{cursor:pointer;font-weight:600}
.checkout-summary{background:#fff4f8;padding:18px;border-radius:10px;margin:20px 0}
.summary-row{display:flex;justify-content:space-between;padding:7px 0}

.auth-form input{width:100%;padding:13px;border:1px solid #e3d4db;border-radius:7px;margin-bottom:13px;outline:0}
.auth-form button{width:100%}
.switch-auth{text-align:center;margin-top:15px;font-size:13px}
.switch-auth span{color:#b7356d;font-weight:700;cursor:pointer}

.toast{position:fixed;bottom:25px;right:25px;background:#2b1b25;color:#fff;padding:15px 20px;border-radius:8px;transform:translateY(100px);opacity:0;transition:.3s;z-index:5000}
.toast.show{transform:translateY(0);opacity:1}

@media(max-width:1000px){
.products{grid-template-columns:repeat(3,1fr)}
.categories{grid-template-columns:repeat(2,1fr)}
.features{grid-template-columns:repeat(2,1fr)}
.footer-container{grid-template-columns:1fr 1fr}
}
@media(max-width:750px){
nav{display:none}
.hero{min-height:500px}
.products{grid-template-columns:repeat(2,1fr)}
.about-container{grid-template-columns:1fr}
.about-image img{height:350px}
.checkout-grid{grid-template-columns:1fr}
}
@media(max-width:520px){
.navbar{padding:0 12px}
.logo{font-size:21px}
.nav-actions{gap:5px}
.icon-btn{width:36px;height:36px}
.products,.categories,.features,.footer-container{grid-template-columns:1fr}
.feature{border-right:0;border-bottom:1px solid #f0dce6}
.newsletter-form{flex-direction:column;gap:10px}
.newsletter-form input,.newsletter-form button{border-radius:7px;padding:14px}
.shop-header{align-items:stretch}
.search-box{width:100%}
.search-box input{width:100%}
}
</style>
</head>

<body>
<header>
<div class="top-bar">✨ Free shipping on orders over ₱2,500</div>
<div class="navbar">
<a href="#" class="logo">ROJE<span>Wig</span></a>
<nav>
<a href="#home">Home</a><a href="#shop">Shop</a><a href="#categories">Collections</a><a href="#about">About</a><a href="#contact">Contact</a>
</nav>
<div class="nav-actions">
<button class="icon-btn" onclick="openAuth()" title="Account">👤</button>
<button class="icon-btn" onclick="openWishlist()" title="Wishlist">♡</button>
<button class="icon-btn" onclick="openCart()" title="Cart">🛒<span class="cart-count" id="cartCount">0</span></button>
</div>
</div>
</header>

<section class="hero" id="home">
<div class="hero-content">
<small>Premium Hair Collection</small>
<h1>Your Hair.<br>Your Confidence.</h1>
<p>Discover premium-quality wigs designed to help you express your beauty, personality, and confidence every day.</p>
<button class="primary-btn" onclick="scrollToShop()">Shop Collection</button>
<button class="secondary-btn" onclick="document.getElementById('categories').scrollIntoView()">Explore Styles</button>
</div>
</section>

<section class="features">
<div class="feature"><div class="feature-icon">🚚</div><h3>Fast Delivery</h3><p>Reliable nationwide shipping</p></div>
<div class="feature"><div class="feature-icon">✨</div><h3>Premium Quality</h3><p>Beautiful and comfortable wigs</p></div>
<div class="feature"><div class="feature-icon">🔒</div><h3>Secure Payment</h3><p>Safe and protected checkout</p></div>
<div class="feature"><div class="feature-icon">💬</div><h3>Customer Support</h3><p>We're here when you need us</p></div>
</section>

<section class="section" id="categories">
<div class="section-heading"><small>Shop by Style</small><h2>Find Your Perfect Look</h2><p>Explore our most-loved wig collections.</p></div>
<div class="categories">
<div class="category-card" onclick="filterCategory('Straight')"><img src="https://images.unsplash.com/photo-1595475884562-073c30d45670?auto=format&fit=crop&w=800&q=80"><div class="category-overlay"><h3>Straight Wigs</h3></div></div>
<div class="category-card" onclick="filterCategory('Curly')"><img src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80"><div class="category-overlay"><h3>Curly Wigs</h3></div></div>
<div class="category-card" onclick="filterCategory('Bob')"><img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80"><div class="category-overlay"><h3>Bob Wigs</h3></div></div>
<div class="category-card" onclick="filterCategory('Lace')"><img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80"><div class="category-overlay"><h3>Lace Front</h3></div></div>
</div>
</section>

<section class="section" id="shop">
<div class="section-heading"><small>Our Collection</small><h2>Shop Wigs</h2><p>Premium styles for every occasion.</p></div>
<div class="shop-header">
<div class="search-box"><input id="searchInput" placeholder="Search wigs..." oninput="searchProducts()"><button>🔎</button></div>
<select class="sort-select" id="sortSelect" onchange="sortProducts()">
<option value="default">Sort: Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Highest Rated</option>
</select>
</div>
<div class="filters">
<button class="filter-btn active" onclick="filterCategory('All',this)">All</button>
<button class="filter-btn" onclick="filterCategory('Straight',this)">Straight</button>
<button class="filter-btn" onclick="filterCategory('Curly',this)">Curly</button>
<button class="filter-btn" onclick="filterCategory('Bob',this)">Bob</button>
<button class="filter-btn" onclick="filterCategory('Lace',this)">Lace Front</button>
</div><br>
<div class="products" id="productGrid"></div>
</section>

<section class="about" id="about">
<div class="about-container">
<div class="about-image"><img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=85"></div>
<div class="about-text">
<small>Why LuxeWig?</small><h2>Made for your confidence.</h2>
<p>At LuxeWig, we believe hair is more than an accessory. It's a way to express your identity, creativity, and confidence.</p>
<p>We carefully select beautiful wig styles that combine comfort, quality, and modern fashion.</p>
<div class="check">✓ Premium-looking styles</div><div class="check">✓ Comfortable everyday wear</div><div class="check">✓ Affordable prices</div><div class="check">✓ Customer-first service</div><br>
<button class="primary-btn" onclick="scrollToShop()">Shop Now</button>
</div>
</div>
</section>

<section class="newsletter">
<h2>Get 10% Off Your First Order</h2>
<p>Subscribe to our newsletter for new arrivals, promotions, and exclusive offers.</p>
<form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
<input type="email" placeholder="Enter your email address" required><button>Subscribe</button>
</form>
</section>

<footer id="contact">
<div class="footer-container">
<div><div class="footer-logo">ROJEWig</div><p>Premium wigs for every style, occasion, and personality.</p><p>📍 Philippines<br>📧 support@luxewig.com<br>📞 +63 900 000 0000</p></div>
<div><h3>Shop</h3><a href="#shop">All Wigs</a><a href="#shop">Straight Wigs</a><a href="#shop">Curly Wigs</a><a href="#shop">Bob Wigs</a></div>
<div><h3>Customer Care</h3><a href="#">Shipping & Delivery</a><a href="#">Returns & Exchanges</a><a href="#">Size Guide</a><a href="#">FAQs</a></div>
<div><h3>Follow Us</h3><a href="#">Facebook</a><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Messenger</a></div>
</div>
<div class="copyright">© 2026 LuxeWig. All Rights Reserved.</div>
</footer>

<div class="modal" id="cartModal">
<div class="modal-content"><button class="close" onclick="closeModal('cartModal')">×</button><h2>Shopping Cart</h2><div id="cartItems"></div><div class="cart-total"><span>Total</span><span id="cartTotal">₱0.00</span></div><button class="primary-btn" style="width:100%" onclick="openCheckout()">Proceed to Checkout</button></div>
</div>

<div class="modal" id="checkoutModal">
<div class="modal-content"><button class="close" onclick="closeModal('checkoutModal')">×</button><h2>Checkout</h2>
<form onsubmit="placeOrder(event)">
<div class="checkout-grid">
<div>
<div class="form-group"><label>First Name</label><input required></div>
<div class="form-group"><label>Last Name</label><input required></div>
<div class="form-group"><label>Email</label><input type="email" required></div>
<div class="form-group"><label>Phone Number</label><input type="tel" required></div>
</div>
<div>
<div class="form-group"><label>Complete Address</label><textarea rows="4" required></textarea></div>
<div class="form-group"><label>City</label><input required></div>
<div class="form-group"><label>Postal Code</label><input required></div>
</div>
</div>
<h3>Payment Method</h3>
<div class="payment-options">
<div class="payment-option"><label><input type="radio" name="payment" value="COD" checked> Cash on Delivery</label></div>
<div class="payment-option"><label><input type="radio" name="payment" value="GCash"> GCash</label></div>
<div class="payment-option"><label><input type="radio" name="payment" value="Card"> Credit / Debit Card</label></div>
</div>
<div class="checkout-summary">
<div class="summary-row"><span>Subtotal</span><strong id="checkoutSubtotal">₱0.00</strong></div>
<div class="summary-row"><span>Shipping</span><strong id="checkoutShipping">₱150.00</strong></div><hr>
<div class="summary-row"><strong>Total</strong><strong id="checkoutTotal">₱0.00</strong></div>
</div>
<button class="primary-btn" style="width:100%">Place Order</button>
</form></div>
</div>

<div class="modal" id="authModal">
<div class="modal-content"><button class="close" onclick="closeModal('authModal')">×</button><h2 id="authTitle">Login</h2>
<form class="auth-form" onsubmit="handleAuth(event)">
<input type="email" placeholder="Email address" required><input type="password" placeholder="Password" required>
<button class="primary-btn">Login</button>
</form>
<div class="switch-auth">Don't have an account? <span onclick="toggleAuth()">Create one</span></div>
</div>
</div>

<div class="modal" id="wishlistModal">
<div class="modal-content"><button class="close" onclick="closeModal('wishlistModal')">×</button><h2>My Wishlist ❤️</h2><div id="wishlistItems"></div></div>
</div>

<div class="toast" id="toast"></div>

<script>
const products=[
{id:1,name:"Silky Straight 24”",category:"Straight",price:3299,rating:4.9,reviews:128,image:"https://images.unsplash.com/photo-1595959183082-7bce5a6f5c54?auto=format&fit=crop&w=700&q=80",badge:"BEST SELLER"},
{id:2,name:"Natural Curly 20”",category:"Curly",price:2899,rating:4.8,reviews:94,image:"https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80",badge:"POPULAR"},
{id:3,name:"Classic Bob 12”",category:"Bob",price:2199,rating:4.7,reviews:76,image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80",badge:"NEW"},
{id:4,name:"HD Lace Front 26”",category:"Lace",price:4499,rating:5,reviews:51,image:"https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=80",badge:"PREMIUM"},
{id:5,name:"Honey Straight 18”",category:"Straight",price:2499,rating:4.6,reviews:65,image:"https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=80",badge:""},
{id:6,name:"Soft Wave 22”",category:"Curly",price:3199,rating:4.9,reviews:88,image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",badge:"TRENDING"},
{id:7,name:"Luxury Bob 14”",category:"Bob",price:2599,rating:4.8,reviews:43,image:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",badge:""},
{id:8,name:"Transparent Lace 24”",category:"Lace",price:4999,rating:4.9,reviews:39,image:"https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=700&q=80",badge:"PREMIUM"}
];

let cart=JSON.parse(localStorage.getItem("ROJEWigCart"))||[],wishlist=JSON.parse(localStorage.getItem("ROJEWigWishlist"))||[],currentCategory="All";

const money=v=>"₱"+v.toLocaleString("en-PH",{minimumFractionDigits:2});

function displayProducts(list=products){
const grid=document.getElementById("productGrid");
if(!list.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px"><h3>No products found.</h3><p style="color:#806b76;margin-top:8px">Try another search or category.</p></div>';return}
grid.innerHTML=list.map(p=>`
<div class="product-card"><div class="product-image">
<img src="${p.image}" alt="${p.name}">${p.badge?`<span class="badge">${p.badge}</span>`:""}
<button class="heart ${wishlist.includes(p.id)?"liked":""}" onclick="toggleWishlist(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
</div><div class="product-info"><span class="product-category">${p.category} Wig</span>
<h3>${p.name}</h3><div><span class="rating">${"★".repeat(Math.round(p.rating))}</span><span class="reviews">(${p.reviews})</span></div>
<div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-cart" onclick="addToCart(${p.id})">Add to Cart</button></div>
</div></div>`).join("");
}

function filterCategory(c,btn){
currentCategory=c;
document.querySelectorAll(".filter-btn").forEach(x=>x.classList.remove("active"));
if(btn)btn.classList.add("active");
else document.querySelectorAll(".filter-btn").forEach(x=>x.textContent.trim().toLowerCase().includes(c.toLowerCase())&&x.classList.add("active"));
applyFilters();
document.getElementById("shop").scrollIntoView({behavior:"smooth"});
}

function searchProducts(){applyFilters()}

function applyFilters(){
const s=document.getElementById("searchInput").value.toLowerCase();
let r=products.filter(p=>(currentCategory==="All"||p.category===currentCategory)&&(p.name.toLowerCase().includes(s)||p.category.toLowerCase().includes(s)));
sortList(r);displayProducts(r);
}

function sortProducts(){applyFilters()}

function sortList(l){
const s=document.getElementById("sortSelect").value;
if(s==="low")l.sort((a,b)=>a.price-b.price);
if(s==="high")l.sort((a,b)=>b.price-a.price);
if(s==="rating")l.sort((a,b)=>b.rating-a.rating);
}

function addToCart(id){
const x=cart.find(i=>i.id===id);
x?x.quantity++:cart.push({id,quantity:1});
saveCart();showToast("Added to your cart 🛒");
}

function saveCart(){
localStorage.setItem("luxewigCart",JSON.stringify(cart));updateCartCount();
}

function updateCartCount(){
document.getElementById("cartCount").textContent=cart.reduce((t,i)=>t+i.quantity,0);
}

function getCartTotal(){
return cart.reduce((t,i)=>{const p=products.find(x=>x.id===i.id);return t+p.price*i.quantity},0);
}

function openCart(){renderCart();document.getElementById("cartModal").classList.add("show")}

function renderCart(){
const c=document.getElementById("cartItems");
if(!cart.length){
c.innerHTML='<div class="empty-cart"><div style="font-size:45px">🛒</div><h3>Your cart is empty</h3><p>Add a beautiful wig to get started.</p></div>';
document.getElementById("cartTotal").textContent=money(0);return;
}
c.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return`
<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div class="cart-details"><h4>${p.name}</h4><div class="cart-price">${money(p.price)}</div>
<div class="quantity"><button onclick="changeQuantity(${p.id},-1)">−</button><strong>${i.quantity}</strong><button onclick="changeQuantity(${p.id},1)">+</button></div>
<button class="remove-btn" onclick="removeFromCart(${p.id})">Remove</button></div></div>`}).join("");
document.getElementById("cartTotal").textContent=money(getCartTotal());
}

function changeQuantity(id,n){
const i=cart.find(x=>x.id===id);if(!i)return;
i.quantity+=n;if(i.quantity<=0)cart=cart.filter(x=>x.id!==id);
saveCart();renderCart();
}

function removeFromCart(id){
cart=cart.filter(x=>x.id!==id);saveCart();renderCart();showToast("Item removed from cart");
}

function openCheckout(){
if(!cart.length){showToast("Your cart is empty.");return}
closeModal("cartModal");
const sub=getCartTotal(),ship=sub>=2500?0:150;
document.getElementById("checkoutSubtotal").textContent=money(sub);
document.getElementById("checkoutShipping").textContent=ship?"₱150.00":"FREE";
document.getElementById("checkoutTotal").textContent=money(sub+ship);
document.getElementById("checkoutModal").classList.add("show");
}

function placeOrder(e){
e.preventDefault();
const n="LW-"+Math.floor(100000+Math.random()*900000);
cart=[];saveCart();closeModal("checkoutModal");
showToast("Order "+n+" placed successfully! 🎉");
setTimeout(()=>alert("Thank you for your order!\n\nOrder Number: "+n+"\n\nThis demo checkout does not process real payments."),500);
}

function toggleWishlist(id){
wishlist.includes(id)?(wishlist=wishlist.filter(x=>x!==id),showToast("Removed from wishlist")):(wishlist.push(id),showToast("Added to wishlist ❤️"));
localStorage.setItem("luxewigWishlist",JSON.stringify(wishlist));applyFilters();
}

function openWishlist(){
const c=document.getElementById("wishlistItems"),items=products.filter(p=>wishlist.includes(p.id));
c.innerHTML=items.length?items.map(p=>`
<div class="cart-item"><img src="${p.image}"><div class="cart-details"><h4>${p.name}</h4><div class="cart-price">${money(p.price)}</div>
<button class="add-cart" style="margin-top:10px" onclick="addToCart(${p.id})">Add to Cart</button></div></div>`).join(""):'<div class="empty-cart"><div style="font-size:45px">♡</div><h3>Your wishlist is empty</h3><p>Tap the heart on products you love.</p></div>';
document.getElementById("wishlistModal").classList.add("show");
}

let loginMode=true;

function openAuth(){document.getElementById("authModal").classList.add("show")}

function toggleAuth(){
loginMode=!loginMode;
document.getElementById("authTitle").textContent=loginMode?"Login":"Create Account";
document.querySelector(".auth-form button").textContent=loginMode?"Login":"Create Account";
document.querySelector(".switch-auth").innerHTML=loginMode?`Don't have an account? <span onclick="toggleAuth()">Create one</span>`:`Already have an account? <span onclick="toggleAuth()">Login</span>`;
}

function handleAuth(e){
e.preventDefault();showToast(loginMode?"Login successful! 👋":"Account created successfully! 🎉");closeModal("authModal");
}

function subscribeNewsletter(e){
e.preventDefault();showToast("You're subscribed! Check your inbox 💌");e.target.reset();
}

function closeModal(id){document.getElementById(id).classList.remove("show")}

document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>e.target===m&&m.classList.remove("show")));

function showToast(msg){
const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");
setTimeout(()=>t.classList.remove("show"),2500);
}

function scrollToShop(){document.getElementById("shop").scrollIntoView({behavior:"smooth"})}

displayProducts();updateCartCount();
</script>
</body>
</html>