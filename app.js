const MIN_ORDER_VALUE = 500;
const SHIPPING_FEE = 59;
const FREE_SHIPPING_VALUE = 999;
const TEST_COUPON_CODE = "TEST99";
const PRODUCTS_KEY = "vadi-products-v2";
const CART_KEY = "vadi-cart-v2";
const ORDERS_KEY = "vadi-orders-v2";
const ACCOUNTS_KEY = "vadi-accounts-v1";
const SESSION_KEY = "vadi-session-v1";
const COUPON_KEY = "vadi-coupon-v2";
const AUTH_RETURN_ROUTE_KEY = "vadi-auth-return-route";
const ADMIN_SESSION_ENDPOINT = "/api/admin-session";
const PUBLIC_CONFIG_ENDPOINT = "/api/public-config";
const RAZORPAY_CREATE_ORDER_ENDPOINT = "/api/create-order";
const RAZORPAY_VERIFY_PAYMENT_ENDPOINT = "/api/verify-payment";
const ORDER_SYNC_ENDPOINT = "/api/sync-order";
const MAX_PRODUCT_IMAGE_DIMENSION = 900;
const PRODUCT_IMAGE_QUALITY = 0.78;
const SUPABASE_AUTH_RETURN_KEYS = [
  "code",
  "state",
  "access_token",
  "refresh_token",
  "expires_in",
  "expires_at",
  "token_type",
  "provider_token",
  "provider_refresh_token",
  "error",
  "error_code",
  "error_description",
];
const SUPABASE_PRODUCTS_TABLE = "products";
const SUPABASE_ORDERS_TABLE = "orders";
const SUPABASE_PRODUCT_IMAGES_BUCKET = "product-images";

function variants(...items) {
  return items.map(([id, label, price]) => ({ id, label, price }));
}

const DEFAULT_PRODUCTS = [
  {
    id: "lakadong-turmeric",
    name: "Lakadong Turmeric Powder",
    region: "Meghalaya",
    category: "Powder",
    pack: "100g pouch",
    price: 160,
    stock: 48,
    listed: true,
    badge: "High curcumin",
    image: "assets/lakadong-turmeric.webp",
    description:
      "Golden organic turmeric with natural curcumin richness, warm aroma, and earthy depth for daily cooking.",
    longDescription:
      "Our Lakadong turmeric is stone-ground in small batches to preserve its bright color, natural oils, and clean earthy finish. It brings depth to everyday dal, sabzi, milk, marinades, and spice blends without synthetic color.",
    origin: "Jaintia Hills, Meghalaya",
    ingredients: "100% organic Lakadong turmeric rhizome",
    use: "Use in dals, sabzi, milk, marinades, and immunity blends.",
    flavor: "Earthy, warm, mildly bitter",
    heat: "No heat",
    oil: "High natural curcumin",
    harvest: "Winter cured rhizomes",
    variants: variants(["100g", "100g pouch", 160], ["250g", "250g jar", 360], ["500g", "500g refill", 680]),
  },
  {
    id: "kashmiri-chilli",
    name: "Kashmiri Red Chilli Powder",
    region: "Kashmir",
    category: "Powder",
    pack: "100g pouch",
    price: 145,
    stock: 36,
    listed: true,
    badge: "Color rich",
    image: "assets/kashmiri-chilli.webp",
    description:
      "Mild organic chilli powder prized for deep red color, smooth heat, and a sweet smoky finish.",
    longDescription:
      "This chilli is chosen for color first and harsh heat never. It gives gravies, marinades, tadka, and tandoori rubs a rich red finish while keeping the spice level gentle enough for daily family cooking.",
    origin: "Pampore belt, Kashmir",
    ingredients: "100% organic dried Kashmiri chilli",
    use: "Add to curries, tandoori marinades, tadka, and spice rubs.",
    flavor: "Bright, fruity, lightly smoky",
    heat: "Mild",
    oil: "Naturally vivid red pigment",
    harvest: "Sun-dried whole chillies",
    variants: variants(["100g", "100g pouch", 145], ["250g", "250g jar", 330], ["500g", "500g refill", 620]),
  },
  {
    id: "black-pepper",
    name: "Tellicherry Black Pepper Whole",
    region: "Kerala",
    category: "Whole",
    pack: "100g jar",
    price: 240,
    stock: 42,
    listed: true,
    badge: "Bold aroma",
    image: "assets/black-pepper.webp",
    description:
      "Large-grade peppercorns with bright citrus notes, slow heat, and a clean lingering spice.",
    longDescription:
      "Large Tellicherry peppercorns are sorted for size and aroma, then packed whole so you can crush them fresh. Expect a slow-building heat with citrus lift and deep woody spice.",
    origin: "Wayanad, Kerala",
    ingredients: "100% organic Tellicherry black pepper",
    use: "Crush fresh over soups, rasam, eggs, grilled vegetables, and chaats.",
    flavor: "Citrus, pine, deep spice",
    heat: "Medium",
    oil: "Oil-rich whole peppercorns",
    harvest: "Late-season mature berries",
    variants: variants(["100g", "100g jar", 240], ["250g", "250g jar", 560], ["500g", "500g refill", 1050]),
  },
  {
    id: "roasted-cumin",
    name: "Roasted Cumin Seeds",
    region: "Rajasthan",
    category: "Whole",
    pack: "100g pouch",
    price: 115,
    stock: 64,
    listed: true,
    badge: "Slow roasted",
    image: "assets/roasted-cumin.webp",
    description:
      "Nutty cumin seeds roasted in small batches for raita, jeera rice, chaas, and everyday tadka.",
    longDescription:
      "Our cumin is roasted slowly for a warm, nutty aroma without bitterness. Crush it over chaas and raita, or bloom it in ghee for jeera rice and everyday tadka.",
    origin: "Jalore, Rajasthan",
    ingredients: "100% organic cumin seeds",
    use: "Crush lightly for chaas, sprinkle on curd, or temper in ghee.",
    flavor: "Nutty, warm, savory",
    heat: "No heat",
    oil: "Roasted essential oils",
    harvest: "Dry-season seed crop",
    variants: variants(["100g", "100g pouch", 115], ["250g", "250g jar", 260], ["500g", "500g refill", 490]),
  },
  {
    id: "coriander-powder",
    name: "Coriander Powder",
    region: "Madhya Pradesh",
    category: "Powder",
    pack: "100g pouch",
    price: 125,
    stock: 57,
    listed: true,
    badge: "Citrusy",
    image: "assets/coriander-powder.webp",
    description:
      "Freshly ground coriander with gentle citrus sweetness and a soft body for curries and gravies.",
    longDescription:
      "Fresh coriander seeds are ground for a soft citrus note and rounded body. It is the backbone spice for gravies, sabzi, dals, pickles, and dry masala blends.",
    origin: "Neemuch, Madhya Pradesh",
    ingredients: "100% organic coriander seeds",
    use: "Use in gravies, sabzi, dal, pickles, and dry masala blends.",
    flavor: "Citrus, sweet, mellow",
    heat: "No heat",
    oil: "Freshly ground seed oils",
    harvest: "Spring coriander seed",
    variants: variants(["100g", "100g pouch", 125], ["250g", "250g jar", 285], ["500g", "500g refill", 540]),
  },
  {
    id: "green-cardamom",
    name: "Green Cardamom Pods",
    region: "Kerala",
    category: "Whole",
    pack: "50g jar",
    price: 390,
    stock: 25,
    listed: true,
    badge: "Premium pods",
    image: "assets/green-cardamom.webp",
    description:
      "Fragrant green cardamom pods with sweet floral oils for chai, desserts, biryani, and festive cooking.",
    longDescription:
      "Whole cardamom pods protect the sweet floral seeds inside until you crush them. Use them for chai, kheer, biryani, pulao, festive sweets, and premium house masala blends.",
    origin: "Idukki, Kerala",
    ingredients: "100% organic green cardamom pods",
    use: "Crush before adding to chai, kheer, pulao, or masala blends.",
    flavor: "Sweet, floral, eucalyptus",
    heat: "No heat",
    oil: "High aromatic seed oils",
    harvest: "Hand-picked green pods",
    variants: variants(["50g", "50g jar", 390], ["100g", "100g jar", 740], ["250g", "250g bulk jar", 1750]),
  },
  {
    id: "cinnamon-sticks",
    name: "Cinnamon Sticks",
    region: "South India",
    category: "Whole",
    pack: "75g jar",
    price: 180,
    stock: 31,
    listed: true,
    badge: "Sweet bark",
    image: "assets/cinnamon-sticks.webp",
    description:
      "Naturally sweet cinnamon bark with woody warmth for pulao, chai, baking, and slow simmered gravies.",
    longDescription:
      "These cinnamon sticks release gentle sweetness and woody warmth when simmered or bloomed. They work beautifully in chai, pulao, biryani, baking, and slow-cooked gravies.",
    origin: "Western Ghats",
    ingredients: "100% organic cinnamon bark",
    use: "Bloom in hot oil or simmer in milk, tea, rice, and curries.",
    flavor: "Sweet, woody, warming",
    heat: "Gentle warmth",
    oil: "Naturally sweet bark oils",
    harvest: "Sun-cured bark quills",
    variants: variants(["75g", "75g jar", 180], ["150g", "150g jar", 335], ["300g", "300g bulk jar", 640]),
  },
  {
    id: "clove-whole",
    name: "Clove Whole",
    region: "Tamil Nadu",
    category: "Whole",
    pack: "50g jar",
    price: 260,
    stock: 28,
    listed: true,
    badge: "Oil rich",
    image: "assets/clove-whole.webp",
    description:
      "Dense whole cloves with strong essential oils, perfect for garam masala, chai, rice, and pickles.",
    longDescription:
      "Whole cloves are selected for density and aroma, then packed to protect their sharp sweet oils. A little goes a long way in chai, biryani, garam masala, pickles, and rice dishes.",
    origin: "Nilgiris, Tamil Nadu",
    ingredients: "100% organic whole cloves",
    use: "Use sparingly in tempering, spice blends, tea, and biryani.",
    flavor: "Sharp, sweet, numbing",
    heat: "Strong warmth",
    oil: "High eugenol aroma",
    harvest: "Hand-sorted dried buds",
    variants: variants(["50g", "50g jar", 260], ["100g", "100g jar", 495], ["250g", "250g bulk jar", 1180]),
  },
  {
    id: "garam-masala",
    name: "Signature Garam Masala",
    region: "House blend",
    category: "Blend",
    pack: "100g pouch",
    price: 195,
    stock: 44,
    listed: true,
    badge: "Best seller",
    image: "assets/garam-masala.webp",
    description:
      "A balanced Vadi house blend with roasted whole spices, warm finish, and no fillers or artificial color.",
    longDescription:
      "Our signature garam masala is roasted and blended for a clean finish rather than overpowering heat. It lifts curries, dals, kebabs, biryani, and roasted vegetables at the end of cooking.",
    origin: "Vadi small-batch blend",
    ingredients: "Coriander, cumin, pepper, cinnamon, cardamom, clove, bay leaf",
    use: "Finish curries, dals, kebabs, biryani, or roasted vegetables.",
    flavor: "Warm, balanced, aromatic",
    heat: "Medium warmth",
    oil: "Roasted spice oils",
    harvest: "Small-batch house blend",
    variants: variants(["100g", "100g pouch", 195], ["250g", "250g jar", 450], ["500g", "500g refill", 840]),
  },
  {
    id: "fenugreek-seeds",
    name: "Fenugreek Seeds",
    region: "Gujarat",
    category: "Whole",
    pack: "100g pouch",
    price: 95,
    stock: 70,
    listed: true,
    badge: "Bitter sweet",
    image: "assets/fenugreek-seeds.webp",
    description:
      "Organic methi seeds with nutty bitterness for pickles, tadka, sprouts, and traditional spice blends.",
    longDescription:
      "Methi seeds add a distinctive nutty bitterness to pickles, tadka, sprouts, and traditional masala blends. Light roasting softens the bitterness and brings out maple-like warmth.",
    origin: "Saurashtra, Gujarat",
    ingredients: "100% organic fenugreek seeds",
    use: "Roast lightly for tadka, grind into masala, or soak for sprouts.",
    flavor: "Nutty, bitter-sweet, maple-like",
    heat: "No heat",
    oil: "Whole seed freshness",
    harvest: "Dry-season seed crop",
    variants: variants(["100g", "100g pouch", 95], ["250g", "250g jar", 220], ["500g", "500g refill", 410]),
  },
];

const DEFAULT_ORDERS = [
  {
    id: "VM2601",
    date: "2026-06-14",
    customer: "Priya Sharma",
    phone: "+91 98765 43210",
    address: "A-42, Indiranagar, Bengaluru, Karnataka 560038",
    payment: "UPI",
    status: "New",
    items: [
      { id: "lakadong-turmeric", variantId: "100g", name: "Lakadong Turmeric Powder", pack: "100g pouch", price: 160, qty: 2 },
      { id: "black-pepper", variantId: "100g", name: "Tellicherry Black Pepper Whole", pack: "100g jar", price: 240, qty: 1 },
      { id: "roasted-cumin", variantId: "100g", name: "Roasted Cumin Seeds", pack: "100g pouch", price: 115, qty: 1 },
    ],
    shipping: 59,
  },
  {
    id: "VM2602",
    date: "2026-06-15",
    customer: "Rohan Mehta",
    phone: "+91 99887 77665",
    address: "9, Civil Lines, Jaipur, Rajasthan 302006",
    payment: "Cash on Delivery",
    status: "Packed",
    items: [
      { id: "kashmiri-chilli", variantId: "100g", name: "Kashmiri Red Chilli Powder", pack: "100g pouch", price: 145, qty: 2 },
      { id: "coriander-powder", variantId: "100g", name: "Coriander Powder", pack: "100g pouch", price: 125, qty: 2 },
      { id: "garam-masala", variantId: "100g", name: "Signature Garam Masala", pack: "100g pouch", price: 195, qty: 1 },
    ],
    shipping: 59,
  },
  {
    id: "VM2603",
    date: "2026-06-16",
    customer: "Ananya Iyer",
    phone: "+91 91234 56780",
    address: "22, Mylapore, Chennai, Tamil Nadu 600004",
    payment: "Card",
    status: "Shipped",
    items: [
      { id: "green-cardamom", variantId: "50g", name: "Green Cardamom Pods", pack: "50g jar", price: 390, qty: 1 },
      { id: "clove-whole", variantId: "50g", name: "Clove Whole", pack: "50g jar", price: 260, qty: 1 },
    ],
    shipping: 0,
  },
];

let products = normalizeProducts(loadState(PRODUCTS_KEY, DEFAULT_PRODUCTS));
let accounts = loadState(ACCOUNTS_KEY, []);
let currentUserId = loadState(SESSION_KEY, null);
let cart = loadState(getCartStorageKey(), []);
let orders = loadState(ORDERS_KEY, DEFAULT_ORDERS);
let appliedCouponCode = loadState(COUPON_KEY, "");
if (currentUserId && !accounts.some((account) => account.id === currentUserId)) {
  currentUserId = null;
  localStorage.removeItem(SESSION_KEY);
  cart = loadState(getCartStorageKey(), []);
}
let selectedOrderId = orders[0]?.id ?? null;
let toastTimer = null;
let currentProductId = products.find((product) => product.listed)?.id ?? products[0]?.id;
let detailQty = 1;
let detailVariantId = null;
let detailGalleryIndex = 0;
let isGoogleLoginStarting = false;
let isGoogleIdentityInitialized = false;
let googleIdentityInitializationPromise = null;
let googleSignInNonce = "";
let isPlacingOrder = false;
let supabaseConfig = null;
let productCatalogSource = "local";
let productCatalogRemoteError = "";
let localOnlyProductImageQueue = new Map();
let adminAccess = {
  status: "unknown",
  checkedUserId: null,
  email: "",
};
let filters = {
  category: "All",
  query: "",
  sort: "featured",
};

const productGrid = document.querySelector("#productGrid");
const collectionMeta = document.querySelector("#collectionMeta");
const categoryFilters = document.querySelector("#categoryFilters");
const navProductSearch = document.querySelector("#navProductSearch");
const productSearch = document.querySelector("#productSearch");
const sortProducts = document.querySelector("#sortProducts");
const productDetail = document.querySelector("#productDetail");
const relatedProducts = document.querySelector("#relatedProducts");
const cartButton = document.querySelector("#cartButton");
const accountButton = document.querySelector("#accountButton");
const closeCartButton = document.querySelector("#closeCartButton");
const cartDrawer = document.querySelector("#cartDrawer");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
const accountDrawer = document.querySelector("#accountDrawer");
const accountBackdrop = document.querySelector("#accountBackdrop");
const closeAccountButton = document.querySelector("#closeAccountButton");
const accountBody = document.querySelector("#accountBody");
const accountTitle = document.querySelector("#accountTitle");
const cartBody = document.querySelector("#cartBody");
const cartCount = document.querySelector("#cartCount");
const adminSummary = document.querySelector("#adminSummary");
const adminProductList = document.querySelector("#adminProductList");
const adminGate = document.querySelector("#adminGate");
const adminConsole = document.querySelector("#adminConsole");
const adminIdentity = document.querySelector("#adminIdentity");
const orderList = document.querySelector("#orderList");
const orderDetails = document.querySelector("#orderDetails");
const orderFilter = document.querySelector("#orderFilter");
const toast = document.querySelector("#toast");
const brandContext = document.querySelector("#brandContext");
const successBackdrop = document.querySelector("#successBackdrop");
const successModal = document.querySelector("#successModal");
const successOrderId = document.querySelector("#successOrderId");

document.addEventListener("DOMContentLoaded", async () => {
  wireGlobalEvents();
  await initializeSupabaseConfig();
  await initializeSupabaseSession();
  await initializeProductCatalog();
  await loadOrdersFromSupabase();
  renderAll();
  handleHashRoute();
});

window.addEventListener("hashchange", handleHashRoute);

function loadState(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function clone(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not save ${key}.`, error);
    return false;
  }
}

function normalizeProducts(sourceProducts) {
  const safeProducts = Array.isArray(sourceProducts) && sourceProducts.length ? sourceProducts : DEFAULT_PRODUCTS;
  const defaultsById = new Map(DEFAULT_PRODUCTS.map((product) => [product.id, product]));
  return safeProducts.map((product) => {
    const fallback = defaultsById.get(product.id) ?? product;
    const normalized = { ...fallback, ...product };
    normalized.image = normalizeLocalAssetImage(normalized.image || fallback.image);
    normalized.variants = product.variants?.length ? product.variants : fallback.variants;
    normalized.longDescription = product.longDescription || fallback.longDescription || product.description;
    normalized.flavor = product.flavor || fallback.flavor || "Clean spice aroma";
    normalized.heat = product.heat || fallback.heat || "Balanced";
    normalized.oil = product.oil || fallback.oil || "Naturally aromatic";
    normalized.harvest = product.harvest || fallback.harvest || "Small-batch selected";
    normalized.gallery = Array.isArray(product.gallery) ? product.gallery.filter(Boolean).map(normalizeLocalAssetImage) : [];
    return normalized;
  });
}

function normalizeLocalAssetImage(source) {
  if (typeof source !== "string") return "";
  if (/^assets\/.+\.(png|jpg|jpeg)$/i.test(source)) return source.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  return source;
}

function mergeProductsWithDefaults(sourceProducts) {
  const safeProducts = Array.isArray(sourceProducts) ? sourceProducts.filter((product) => product?.id) : [];
  const productsById = new Map(safeProducts.map((product) => [product.id, product]));
  const defaultIds = new Set(DEFAULT_PRODUCTS.map((product) => product.id));
  const mergedProducts = DEFAULT_PRODUCTS.map((product) => productsById.get(product.id) ?? product);
  safeProducts.forEach((product) => {
    if (!defaultIds.has(product.id)) mergedProducts.push(product);
  });
  return mergedProducts;
}

function renderAll() {
  renderCategoryFilters();
  renderProducts();
  renderCart();
  renderProductDetail();
  renderRelatedProducts();
  renderAccount();
  renderAdminAccess();
  if (isAdminAuthorized()) {
    renderAdminSummary();
    renderAdminProducts();
    renderOrders();
  } else {
    clearAdminData();
  }
}

function wireGlobalEvents() {
  document.body.addEventListener("click", (event) => {
    const viewLink = event.target.closest("[data-view-link]");
    if (viewLink) {
      event.preventDefault();
      if (viewLink.dataset.categoryFilter) {
        filters.category = viewLink.dataset.categoryFilter;
        renderCategoryFilters();
        renderProducts();
      }
      setView(viewLink.dataset.viewLink);
      return;
    }

    const accountOpen = event.target.closest("[data-account-open]");
    if (accountOpen) {
      event.preventDefault();
      openAccountDrawer();
      return;
    }

    const accountAction = event.target.closest("[data-account-action]");
    if (accountAction) {
      handleAccountAction(accountAction.dataset.accountAction);
      return;
    }

    const googleLoginButton = event.target.closest("[data-google-login]");
    if (googleLoginButton) {
      void renderGoogleSignInButtons();
      return;
    }

    const scrollTarget = event.target.closest("[data-scroll-target]");
    if (scrollTarget) {
      setView("shop");
      document.querySelector(`#${scrollTarget.dataset.scrollTarget}`)?.scrollIntoView({ block: "start" });
      return;
    }

    const categoryButton = event.target.closest("[data-category-filter]");
    if (categoryButton) {
      filters.category = categoryButton.dataset.categoryFilter;
      renderCategoryFilters();
      renderProducts();
      return;
    }

    const detailButton = event.target.closest("[data-product-detail]");
    if (detailButton) {
      showProductPage(detailButton.dataset.productDetail);
      return;
    }

    const addButton = event.target.closest("[data-add-product]");
    if (addButton) {
      addToCart(addButton.dataset.addProduct, addButton.dataset.variantId);
      return;
    }

    const detailAddButton = event.target.closest("[data-detail-add]");
    if (detailAddButton) {
      addToCart(currentProductId, detailVariantId, detailQty);
      return;
    }

    const detailQtyButton = event.target.closest("[data-detail-qty]");
    if (detailQtyButton) {
      const product = getProduct(currentProductId);
      const maxQty = Math.max(1, product?.stock ?? 1);
      detailQty = Math.max(1, Math.min(maxQty, detailQty + Number(detailQtyButton.dataset.detailQty)));
      renderProductDetail();
      return;
    }

    const variantButton = event.target.closest("[data-detail-variant]");
    if (variantButton) {
      detailVariantId = variantButton.dataset.detailVariant;
      renderProductDetail();
      return;
    }

    const galleryButton = event.target.closest("[data-gallery-image]");
    if (galleryButton) {
      detailGalleryIndex = Number(galleryButton.dataset.galleryImage) || 0;
      renderProductDetail();
      return;
    }

    const cartAction = event.target.closest("[data-cart-action]");
    if (cartAction) {
      updateCartItem(cartAction.dataset.cartAction, cartAction.dataset.productId, cartAction.dataset.variantId);
      return;
    }

    const couponApply = event.target.closest("[data-apply-coupon]");
    if (couponApply) {
      applyCouponFromCart();
      return;
    }

    const couponRemove = event.target.closest("[data-remove-coupon]");
    if (couponRemove) {
      clearAppliedCoupon();
      return;
    }

    const orderButton = event.target.closest("[data-order-id]");
    if (orderButton) {
      if (!isAdminAuthorized()) {
        showToast("Admin access required.");
        return;
      }
      selectedOrderId = orderButton.dataset.orderId;
      renderOrders();
      return;
    }

    const adminSave = event.target.closest("[data-save-product]");
    if (adminSave) {
      if (!isAdminAuthorized()) {
        showToast("Admin access required.");
        return;
      }
      void saveProductFromAdmin(adminSave.dataset.saveProduct);
      return;
    }

    const removeGalleryImage = event.target.closest("[data-remove-gallery-image]");
    if (removeGalleryImage) {
      if (!isAdminAuthorized()) {
        showToast("Admin access required.");
        return;
      }
      void removeProductGalleryImage(removeGalleryImage.dataset.removeGalleryImage, Number(removeGalleryImage.dataset.galleryIndex));
      return;
    }

    const successAction = event.target.closest("[data-success-action]");
    if (successAction) {
      handleSuccessAction(successAction.dataset.successAction);
    }
  });

  document.body.addEventListener("keydown", (event) => {
    const input = event.target.closest?.("[data-digits-only]");
    if (!input || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length === 1 && !/^[0-9]$/.test(event.key)) event.preventDefault();
  });

  document.body.addEventListener("input", (event) => {
    const input = event.target.closest?.("[data-digits-only]");
    if (!input) return;
    const maxLength = Number(input.dataset.maxDigits || input.getAttribute("maxlength")) || Number.POSITIVE_INFINITY;
    const digits = input.dataset.digitsOnly === "phone" ? normalizeIndianPhone(input.value) : String(input.value || "").replace(/\D/g, "");
    input.value = digits.slice(0, maxLength);
  });

  navProductSearch.addEventListener("input", () => {
    applySearchQuery(navProductSearch.value);
  });

  navProductSearch.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    setView("shop", { updateHash: false, scroll: false });
    document.querySelector("#products")?.scrollIntoView({ block: "start" });
    history.replaceState(null, "", "#products");
  });

  productSearch.addEventListener("input", () => {
    applySearchQuery(productSearch.value);
  });

  sortProducts.addEventListener("change", () => {
    filters.sort = sortProducts.value;
    renderProducts();
  });

  cartButton.addEventListener("click", openCart);
  closeCartButton.addEventListener("click", closeCart);
  drawerBackdrop.addEventListener("click", closeCart);
  closeAccountButton.addEventListener("click", closeAccountDrawer);
  accountBackdrop.addEventListener("click", closeAccountDrawer);
  successBackdrop.addEventListener("click", closeSuccessModal);

  document.querySelector("#resetProductsButton").addEventListener("click", async () => {
    if (!isAdminAuthorized()) {
      showToast("Admin access required.");
      return;
    }
    const previousProducts = clone(products);
    const previousOrders = clone(orders);
    const previousCart = clone(cart);
    const previousSelectedOrderId = selectedOrderId;
    const previousProductId = currentProductId;
    const previousDetailQty = detailQty;
    const previousDetailVariantId = detailVariantId;
    products = clone(DEFAULT_PRODUCTS);
    orders = clone(DEFAULT_ORDERS);
    cart = [];
    selectedOrderId = orders[0]?.id ?? null;
    currentProductId = products.find((product) => product.listed)?.id ?? products[0]?.id;
    detailQty = 1;
    detailVariantId = null;
    const productSave = await saveProductCatalog({ allProducts: true });
    if (!productSave.remoteSaved) {
      products = previousProducts;
      orders = previousOrders;
      cart = previousCart;
      selectedOrderId = previousSelectedOrderId;
      currentProductId = previousProductId;
      detailQty = previousDetailQty;
      detailVariantId = previousDetailVariantId;
      renderAll();
      showToast("Could not reset globally. Set up Supabase products first.");
      return;
    }
    saveState(ORDERS_KEY, orders);
    saveActiveCart();
    renderAll();
    showToast("Product demo data reset for everyone.");
  });

  document.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.addEventListener("click", () => setAdminTab(tab.dataset.adminTab));
  });

  adminProductList.addEventListener("change", async (event) => {
    if (!isAdminAuthorized()) {
      showToast("Admin access required.");
      event.preventDefault();
      return;
    }

    const listedToggle = event.target.closest("[data-listed-toggle]");
    if (listedToggle) {
      const product = getProduct(listedToggle.dataset.listedToggle);
      if (!product) return;
      const previousListed = product.listed;
      product.listed = listedToggle.checked;
      const result = await saveProductCatalog({ product });
      if (!result.remoteSaved) {
        product.listed = previousListed;
        renderAll();
        showToast("Could not save globally. Set up Supabase products first.");
        return;
      }
      renderAll();
      showToast(`${product.name} is now ${product.listed ? "listed" : "unlisted"} for everyone.`);
      return;
    }

    const fileInput = event.target.closest("[data-image-upload]");
    if (fileInput && fileInput.files?.[0]) {
      void uploadProductImage(fileInput.dataset.imageUpload, fileInput.files[0]);
    }

    const galleryInput = event.target.closest("[data-gallery-upload]");
    if (galleryInput && galleryInput.files?.length) {
      void uploadProductGalleryImages(galleryInput.dataset.galleryUpload, Array.from(galleryInput.files));
    }
  });

  orderFilter.addEventListener("change", () => {
    if (!isAdminAuthorized()) {
      showToast("Admin access required.");
      return;
    }
    renderOrders();
  });

  orderDetails.addEventListener("change", async (event) => {
    if (!isAdminAuthorized()) {
      showToast("Admin access required.");
      event.preventDefault();
      return;
    }

    const statusSelect = event.target.closest("[data-order-status]");
    if (!statusSelect) return;
    const order = orders.find((item) => item.id === statusSelect.dataset.orderStatus);
    if (!order) return;
    const previousStatus = order.status;
    order.status = statusSelect.value;
    const saved = await saveOrderToSupabase(order);
    if (!saved) {
      order.status = previousStatus;
      renderOrders();
      showToast("Could not update order status globally.");
      return;
    }
    saveState(ORDERS_KEY, orders);
    renderOrders();
    void syncOrderToGoogleSheets(order);
    showToast(`Order ${order.id} marked ${order.status}.`);
  });

  cartBody.addEventListener("submit", (event) => {
    if (event.target.matches("#couponForm")) {
      event.preventDefault();
      applyCouponFromCart();
      return;
    }

    if (event.target.matches("#checkoutForm")) {
      event.preventDefault();
      void placeOrder(new FormData(event.target));
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (successModal.classList.contains("is-open")) {
      closeSuccessModal();
      return;
    }
    closeAccountDrawer();
    closeCart();
  });
}

function handleHashRoute() {
  if (location.hash.startsWith("#product-")) {
    showProductPage(location.hash.replace("#product-", ""), false);
  } else if (location.hash === "#admin") {
    setView("admin", { updateHash: false });
  } else if (["#products", "#promise"].includes(location.hash)) {
    setView("shop", { updateHash: false, scroll: false });
    document.querySelector(location.hash)?.scrollIntoView({ block: "start" });
  } else {
    setView("shop", { updateHash: false });
  }
}

function setView(view, options = {}) {
  const { updateHash = true, scroll = true } = options;
  const selectedView = ["admin", "product"].includes(view) ? view : "shop";
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${selectedView}View`);
  });
  document.querySelectorAll("[data-view-link]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.viewLink === selectedView || (selectedView === "product" && link.dataset.viewLink === "shop"));
  });
  document.body.classList.toggle("is-admin-site", selectedView === "admin");
  document.body.classList.toggle("is-customer-site", selectedView !== "admin");
  document.querySelectorAll("[data-customer-nav], #cartButton, .site-footer").forEach((element) => {
    element.hidden = selectedView === "admin";
  });
  if (brandContext) {
    brandContext.textContent = selectedView === "admin" ? "Operations Console" : "Organic Store";
  }
  if (selectedView === "admin") {
    closeCart();
    closeAccountDrawer();
    renderAdminAccess();
    void verifyAdminAccess();
  }

  if (!updateHash) {
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (selectedView === "admin") {
    location.hash = "admin";
  } else if (selectedView === "shop") {
    location.hash = "shop";
  }
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function setAdminTab(tabName) {
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.adminTab === tabName);
  });
  document.querySelectorAll(".admin-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `${tabName}Panel`);
  });
}

function showProductPage(productId, updateHash = true) {
  const product = getProduct(productId);
  if (!product || !product.listed) return;
  currentProductId = product.id;
  detailVariantId = getDefaultVariant(product).id;
  detailQty = 1;
  detailGalleryIndex = 0;
  renderProductDetail();
  renderRelatedProducts();
  setView("product", { updateHash: false });
  if (updateHash) {
    location.hash = `product-${product.id}`;
  }
}

function renderCategoryFilters() {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-chip ${filters.category === category ? "is-active" : ""}" type="button" data-category-filter="${escapeAttribute(category)}">
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join("");
}

function renderProducts() {
  const listedProducts = getFilteredProducts();
  const totalListed = products.filter((product) => product.listed).length;

  collectionMeta.textContent = `${listedProducts.length} of ${totalListed} spices shown`;
  productGrid.innerHTML =
    listedProducts.length === 0
      ? `<div class="empty-state collection-empty"><p>No spices match this search.</p></div>`
      : listedProducts.map(renderProductCard).join("");
}

function applySearchQuery(value) {
  const query = value.trim().toLowerCase();
  filters.query = query;
  if (productSearch.value !== value) {
    productSearch.value = value;
  }
  if (navProductSearch.value !== value) {
    navProductSearch.value = value;
  }
  renderProducts();
}

function renderProductCard(product) {
  const variant = getDefaultVariant(product);
  const isOut = product.stock <= 0;
  const cardName = getCardProductName(product);
  return `
    <article class="product-card">
      <button class="product-media-button" type="button" data-product-detail="${product.id}" aria-label="View ${escapeHtml(product.name)}">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" />
        <span class="product-card-favorite" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6a5 5 0 0 1 7.5 6.6Z" /></svg>
        </span>
      </button>
      <div class="product-body">
        <div class="product-title-row">
          <h3 class="product-title">
            <button type="button" data-product-detail="${product.id}">${escapeHtml(cardName)}</button>
          </h3>
          <span class="badge">${escapeHtml(product.badge)}</span>
        </div>
        <p class="product-desc">Pack: ${escapeHtml(variant.label)}</p>
        <div class="product-meta">
          <div>
            <div class="price">${formatCardPrice(variant.price)}</div>
            <div class="pack">/ ${escapeHtml(variant.label)}</div>
          </div>
          <span class="stock ${isOut ? "warning-text" : ""}">${isOut ? "Out of stock" : `${product.stock} in stock`}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="secondary-link" type="button" data-product-detail="${product.id}">Details</button>
        <button class="add-button" type="button" data-add-product="${product.id}" data-variant-id="${variant.id}" aria-label="Add ${escapeHtml(product.name)}" ${isOut ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
    </article>
  `;
}

function getFilteredProducts() {
  let listedProducts = products.filter((product) => product.listed);

  if (filters.category !== "All") {
    listedProducts = listedProducts.filter((product) => product.category === filters.category);
  }

  if (filters.query) {
    listedProducts = listedProducts.filter((product) => {
      const haystack = `${product.name} ${product.region} ${product.category} ${product.description} ${product.ingredients}`.toLowerCase();
      return haystack.includes(filters.query);
    });
  }

  return [...listedProducts].sort((a, b) => {
    if (filters.sort === "price-asc") return getDefaultVariant(a).price - getDefaultVariant(b).price;
    if (filters.sort === "price-desc") return getDefaultVariant(b).price - getDefaultVariant(a).price;
    if (filters.sort === "stock") return b.stock - a.stock;
    return DEFAULT_PRODUCTS.findIndex((product) => product.id === a.id) - DEFAULT_PRODUCTS.findIndex((product) => product.id === b.id);
  });
}

function renderProductDetail() {
  const product = getProduct(currentProductId) ?? products.find((item) => item.listed) ?? products[0];
  if (!product || !productDetail) return;

  currentProductId = product.id;
  const selectedVariant = getVariant(product, detailVariantId) ?? getDefaultVariant(product);
  detailVariantId = selectedVariant.id;
  detailQty = Math.max(1, Math.min(detailQty, Math.max(product.stock, 1)));
  const gallery = getProductGallery(product);
  detailGalleryIndex = Math.min(detailGalleryIndex, Math.max(gallery.length - 1, 0));
  const activeImage = gallery[detailGalleryIndex] ?? gallery[0];
  const subtotal = selectedVariant.price * detailQty;
  const remaining = Math.max(MIN_ORDER_VALUE - subtotal, 0);
  const isOut = product.stock <= 0;

  productDetail.innerHTML = `
    <div class="breadcrumb">
      <button type="button" data-view-link="shop">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        Back to Spices
      </button>
      <span>${escapeHtml(product.category)}</span>
    </div>

    <div class="product-detail-layout">
      <div class="product-gallery">
        <div class="detail-image-wrap">
          <img src="${activeImage}" alt="${escapeHtml(product.name)}" />
          <span class="badge detail-organic-pill">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4C10.6 4.4 4.9 8.7 4 19c10.2-.9 14.5-6.6 16-15Z" /><path d="M4 19c3.7-4.3 7.5-7.4 12.4-9.7" /></svg>
            ${escapeHtml(product.badge)}
          </span>
        </div>
        ${
          gallery.length > 1
            ? `<div class="gallery-thumbs" aria-label="Product image gallery">
          ${gallery
            .map(
              (image, index) => `
                <button class="${index === detailGalleryIndex ? "is-active" : ""}" type="button" data-gallery-image="${index}" aria-label="View image ${index + 1}">
                  <img src="${image}" alt="" />
                </button>
              `,
            )
            .join("")}
        </div>`
            : ""
        }
      </div>

      <div class="product-buybox">
        <div class="detail-title-block">
          <span class="kicker">${escapeHtml(product.region)} · ${escapeHtml(product.category)}</span>
          <h1 id="productPageTitle">${escapeHtml(product.name)}</h1>
          <p>${escapeHtml(product.origin)}</p>
        </div>
        <div class="detail-price">
          <strong>${formatMoney(selectedVariant.price)}</strong>
          <span>/ ${escapeHtml(selectedVariant.label)}</span>
        </div>
        <p class="detail-copy">${escapeHtml(product.longDescription)}</p>

        <div class="purchase-panel">
          <div class="variant-picker" aria-label="Choose pack size">
            <span>Size</span>
            <div>
              ${product.variants
                .map(
                  (variant) => `
                    <button class="${variant.id === selectedVariant.id ? "is-active" : ""}" type="button" data-detail-variant="${variant.id}">
                      <strong>${escapeHtml(variant.label)}</strong>
                      <span>${formatMoney(variant.price)}</span>
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
          <div class="quantity-stepper detail-stepper" aria-label="Quantity">
            <button type="button" data-detail-qty="-1" aria-label="Decrease quantity">−</button>
            <span>${detailQty}</span>
            <button type="button" data-detail-qty="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="primary-button" type="button" data-detail-add ${isOut ? "disabled" : ""}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h15l-2 8H8L6 3H3" /><path d="M9 20h.01M18 20h.01" /></svg>
            Add ${formatMoney(subtotal)}
          </button>
        </div>

        <div class="order-promises">
          <span>${isOut ? "Currently out of stock" : `${product.stock} packs available`}</span>
          <span>${remaining > 0 ? `${formatMoney(remaining)} more for minimum order` : "Minimum order reached"}</span>
          <span>Free shipping above ${formatMoney(FREE_SHIPPING_VALUE)}</span>
        </div>

        <div class="detail-facts">
          <div><span>Origin</span><strong>${escapeHtml(product.origin)}</strong></div>
          <div><span>Flavor</span><strong>${escapeHtml(product.flavor)}</strong></div>
          <div><span>Heat</span><strong>${escapeHtml(product.heat)}</strong></div>
          <div><span>Harvest</span><strong>${escapeHtml(product.harvest)}</strong></div>
        </div>

        <div class="product-accordions">
          <details open>
            <summary>Nutrition & Origin Facts</summary>
            <p><strong>Ingredients:</strong> ${escapeHtml(product.ingredients)}</p>
            <p><strong>Aroma:</strong> ${escapeHtml(product.oil)}</p>
          </details>
          <details>
            <summary>How to Use</summary>
            <p>${escapeHtml(product.use)}</p>
          </details>
          <details>
            <summary>Shipping & Returns</summary>
            <p>Ships across India in 3-5 business days. Organic spices are returnable only if the product arrives damaged or incorrect.</p>
          </details>
        </div>
      </div>
    </div>
  `;
}

function renderRelatedProducts() {
  const currentProduct = getProduct(currentProductId);
  if (!currentProduct || !relatedProducts) return;
  const related = products
    .filter((product) => product.listed && product.id !== currentProduct.id)
    .sort((a, b) => Number(b.category === currentProduct.category) - Number(a.category === currentProduct.category))
    .slice(0, 4);

  relatedProducts.innerHTML = related
    .map((product) => {
      const variant = getDefaultVariant(product);
      return `
        <article class="related-card">
          <button type="button" data-product-detail="${product.id}">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" />
            <span>${escapeHtml(product.badge)}</span>
          </button>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${formatMoney(variant.price)} · ${escapeHtml(variant.label)}</p>
        </article>
      `;
    })
    .join("");
}

function renderCart() {
  const enrichedCart = getCartItems();
  const currentUser = getCurrentUser();
  const pricing = getCartPricing(enrichedCart, appliedCouponCode);
  const remaining = Math.max(MIN_ORDER_VALUE - pricing.subtotal, 0);
  const meter = Math.min((pricing.subtotal / MIN_ORDER_VALUE) * 100, 100);
  const coupon = getCoupon(appliedCouponCode);
  const couponValue = coupon?.code || "";

  cartCount.textContent = String(enrichedCart.reduce((sum, item) => sum + item.qty, 0));

  if (enrichedCart.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-state">
        <div>
          <span class="mini-icon amber" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 7h15l-2 8H8L6 3H3" /><path d="M9 20h.01M18 20h.01" /></svg>
          </span>
          <h3>Your cart is empty</h3>
          <p>Choose from the Vadi Masala collection to begin.</p>
        </div>
      </div>
    `;
    return;
  }

  cartBody.innerHTML = `
    <div class="cart-items">
      ${enrichedCart
        .map(
          (item) => `
          <article class="cart-item">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" />
            <div>
              <h3>${escapeHtml(item.name)}</h3>
              <p class="cart-line-meta">
                <span class="pack-chip">${escapeHtml(item.pack)}</span>
                <span>${formatMoney(item.price)} each</span>
                <strong>${formatMoney(item.price * item.qty)}</strong>
              </p>
            </div>
            <div class="quantity-stepper" aria-label="Quantity for ${escapeHtml(item.name)}">
              <button type="button" data-cart-action="decrease" data-product-id="${item.id}" data-variant-id="${item.variantId}" aria-label="Decrease ${escapeHtml(item.name)} ${escapeHtml(item.pack)}">−</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-action="increase" data-product-id="${item.id}" data-variant-id="${item.variantId}" aria-label="Increase ${escapeHtml(item.name)} ${escapeHtml(item.pack)}">+</button>
            </div>
          </article>
        `,
        )
        .join("")}
    </div>

    <div class="cart-summary">
      <div class="summary-line"><span>Subtotal</span><strong>${formatMoney(pricing.subtotal)}</strong></div>
      ${
        pricing.discount > 0
          ? `<div class="summary-line discount-line"><span>${escapeHtml(pricing.couponLabel)}</span><strong>-${formatMoney(pricing.discount)}</strong></div>`
          : ""
      }
      <div class="summary-line"><span>Shipping</span><strong>${pricing.shipping === 0 ? "Free" : formatMoney(pricing.shipping)}</strong></div>
      <div class="summary-line total"><span>Total</span><strong>${formatMoney(pricing.total)}</strong></div>

      <form class="coupon-form" id="couponForm">
        <label for="couponCode">Coupon</label>
        <div>
          <input id="couponCode" name="coupon" value="${escapeAttribute(couponValue)}" placeholder="Enter code" autocomplete="off" />
          <button class="secondary-button" type="submit" data-apply-coupon>Apply</button>
          ${coupon ? `<button class="text-link" type="button" data-remove-coupon>Remove</button>` : ""}
        </div>
        ${coupon ? `<p>${escapeHtml(coupon.label)} applied.</p>` : ""}
      </form>

      <div class="minimum-meter" style="--meter: ${meter}%">
        <div class="meter-track"><div class="meter-fill"></div></div>
        <p>${remaining > 0 ? `Add ${formatMoney(remaining)} more to place an order.` : "Minimum order value reached."}</p>
      </div>

      ${
        currentUser
          ? `<form class="checkout-form" id="checkoutForm">
        <h3>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v.01" /><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          Secure Checkout
        </h3>
        <p class="checkout-account-note">Ordering as <strong>${escapeHtml(currentUser.name)}</strong>. This order will appear in your account history.</p>
        <div class="form-grid">
          <div class="field">
            <label for="customerName">Name</label>
            <input id="customerName" name="customer" autocomplete="name" value="${escapeAttribute(currentUser.name)}" minlength="2" maxlength="80" pattern="[A-Za-z][A-Za-z .'-]{1,79}" title="Enter a valid name using letters" required />
          </div>
          <div class="field">
            <label for="customerPhone">Phone</label>
            <input id="customerPhone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" value="${escapeAttribute(normalizeIndianPhone(currentUser.phone))}" minlength="10" maxlength="14" pattern="[6-9][0-9]{9}" data-digits-only="phone" data-max-digits="10" title="Enter a valid 10-digit Indian mobile number" required />
          </div>
          <div class="field full">
            <label for="customerAddress">Address</label>
            <textarea id="customerAddress" name="address" autocomplete="street-address" minlength="10" maxlength="300" required>${escapeHtml(currentUser.address || "")}</textarea>
          </div>
          <div class="field">
            <label for="paymentMethod">Payment</label>
            <select id="paymentMethod" name="payment">
              <option value="Razorpay">Razorpay Online</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>
          <div class="field">
            <label for="customerState">State</label>
            <input id="customerState" name="state" autocomplete="address-level1" value="${escapeAttribute(currentUser.state || "")}" minlength="2" maxlength="50" pattern="[A-Za-z][A-Za-z .'-]{1,49}" title="Enter a valid state using letters" required />
          </div>
        </div>
        <button class="primary-button" type="submit" ${pricing.subtotal < MIN_ORDER_VALUE || isPlacingOrder ? "disabled" : ""}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v.01" /><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          ${isPlacingOrder ? "Checking Stock..." : "Place Order"}
        </button>
        <span class="form-note">Shipping available across India. Free shipping above ₹999.</span>
      </form>`
          : `<div class="checkout-form account-required">
        <h3>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17v.01" /><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          Login to Checkout
        </h3>
        <p>Continue with Google to keep your cart and orders attached to your account.</p>
        <button class="primary-button" type="button" data-account-open>Continue with Google</button>
      </div>`
      }
    </div>
  `;
}

function renderAccount() {
  const currentUser = getCurrentUser();
  const userOrders = getCurrentUserOrders();
  const cartItems = getCartItems();

  accountButton?.classList.toggle("is-signed-in", Boolean(currentUser));
  accountButton?.setAttribute("aria-label", currentUser ? `Open account for ${currentUser.name}` : "Login or continue with Google");

  if (!accountBody) return;

  if (!currentUser) {
    accountTitle.textContent = "Login";
    accountBody.innerHTML = `
      <div class="auth-card">
        <p class="auth-note google-first-note">Sign in or create an account with Google.</p>
        <div class="google-signin-slot" data-google-signin aria-label="Continue with Google">
          <button class="google-login-button" type="button" data-google-login disabled>Loading Google...</button>
        </div>
        <p class="auth-note">Google opens a secure account chooser without leaving Vadi Masala.</p>
      </div>
    `;
    void renderGoogleSignInButtons();
    return;
  }

  accountTitle.textContent = "Your Account";
  accountBody.innerHTML = `
    <section class="account-profile-card">
      <span class="account-avatar" aria-hidden="true">${escapeHtml(getInitials(currentUser.name))}</span>
      <div>
        <span class="kicker">Signed in</span>
        <h3>${escapeHtml(currentUser.name)}</h3>
        <p>${escapeHtml(currentUser.email)}</p>
      </div>
    </section>

    <div class="account-actions">
      <button class="primary-button" type="button" data-account-action="checkout" ${cartItems.length ? "" : "disabled"}>Continue Checkout</button>
      <button class="ghost-button" type="button" data-account-action="shop">Shop Spices</button>
      <button class="text-link" type="button" data-account-action="logout">Sign out</button>
    </div>

    <section class="account-orders" aria-labelledby="accountOrdersTitle">
      <div class="account-section-heading">
        <span class="kicker">Order history</span>
        <h3 id="accountOrdersTitle">${userOrders.length} order${userOrders.length === 1 ? "" : "s"}</h3>
      </div>
      ${
        userOrders.length
          ? userOrders.map(renderAccountOrder).join("")
          : `<div class="empty-state account-empty">
        <div>
          <span class="mini-icon amber" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 7h15l-2 8H8L6 3H3" /><path d="M9 20h.01M18 20h.01" /></svg>
          </span>
          <h3>No orders yet</h3>
          <p>Place your first spice order and it will show up here.</p>
        </div>
      </div>`
      }
    </section>
  `;
}

function renderAccountOrder(order) {
  return `
    <article class="account-order-card">
      <div class="account-order-top">
        <div>
          <strong>${escapeHtml(order.id)}</strong>
          <span>${formatDate(order.date)} · ${order.items.length} item${order.items.length === 1 ? "" : "s"}</span>
        </div>
        <span class="status-pill ${order.status}">${escapeHtml(order.status)}</span>
      </div>
      <div class="account-order-items">
        ${order.items
          .map(
            (item) => `
            <div>
              <span>
                ${escapeHtml(item.name)}
                <em>${escapeHtml(item.pack)}</em>
              </span>
              <strong>${item.qty} × ${formatMoney(item.price)}</strong>
            </div>
          `,
          )
          .join("")}
      </div>
      ${
        Number(order.discount) > 0
          ? `<div class="summary-line"><span>${escapeHtml(order.couponCode || "Discount")}</span><strong>-${formatMoney(order.discount)}</strong></div>`
          : ""
      }
      <div class="summary-line"><span>Payment</span><strong>${escapeHtml(order.payment || "Razorpay")}</strong></div>
      <div class="summary-line total"><span>Total</span><strong>${formatMoney(getOrderTotal(order))}</strong></div>
    </article>
  `;
}

function getSupabaseClient() {
  if (!window.supabase?.createClient) return null;
  if (!supabaseConfig?.supabaseUrl || !supabaseConfig?.supabaseAnonKey) return null;
  if (!window.vadiSupabaseClient) {
    window.vadiSupabaseClient = window.supabase.createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: "pkce",
        persistSession: true,
      },
    });
  }
  return window.vadiSupabaseClient;
}

async function initializeSupabaseConfig() {
  if (supabaseConfig) return supabaseConfig;

  try {
    const response = await fetch(PUBLIC_CONFIG_ENDPOINT, { cache: "no-store" });
    if (!response.ok) throw new Error("Public config endpoint failed.");
    const config = await response.json();
    if (!config.supabaseUrl || !config.supabaseAnonKey) throw new Error("Supabase public config is incomplete.");
    supabaseConfig = {
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
      razorpayKeyId: config.razorpayKeyId || "",
      googleClientId: config.googleClientId || "",
    };
    return supabaseConfig;
  } catch (error) {
    console.warn("Supabase public config could not be loaded.", error);
    return null;
  }
}

async function waitForSupabaseClient() {
  if (!supabaseConfig) await initializeSupabaseConfig();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const client = getSupabaseClient();
    if (client) return client;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

async function initializeProductCatalog() {
  stageLocalOnlyProductImages();
  const remoteLoaded = await loadProductsFromSupabase();
  const removedLocalImages = removeLocalOnlyProductImages();
  clampCartToStock();
  if (!remoteLoaded) saveState(PRODUCTS_KEY, products);
  if (removedLocalImages && window.location.hash === "#admin") {
    showToast("Preparing local images for Supabase sync.");
  }
}

async function loadProductsFromSupabase() {
  const client = await waitForSupabaseClient();
  if (!client) return false;

  try {
    const { data, error } = await client
      .from(SUPABASE_PRODUCTS_TABLE)
      .select("id,data,updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw error;

    const remoteProducts = (data || []).map(productFromSupabaseRow).filter(Boolean);
    if (!remoteProducts.length) {
      productCatalogSource = "supabase-empty";
      productCatalogRemoteError = "";
      return false;
    }

    products = normalizeProducts(mergeProductsWithDefaults(remoteProducts));
    currentProductId =
      products.find((product) => product.id === currentProductId)?.id ??
      products.find((product) => product.listed)?.id ??
      products[0]?.id;
    productCatalogSource = "supabase";
    productCatalogRemoteError = "";
    saveState(PRODUCTS_KEY, products);
    return true;
  } catch (error) {
    productCatalogSource = "local";
    productCatalogRemoteError = getSupabaseErrorMessage(error);
    console.warn("Shared product catalog could not be loaded.", error);
    return false;
  }
}

async function loadOrdersFromSupabase() {
  const client = await waitForSupabaseClient();
  if (!client) return false;

  try {
    const { data, error } = await client
      .from(SUPABASE_ORDERS_TABLE)
      .select("id,data,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const remoteOrders = (data || []).map(orderFromSupabaseRow).filter(Boolean);
    orders = remoteOrders;
    selectedOrderId = orders[0]?.id ?? null;
    saveState(ORDERS_KEY, orders);
    return true;
  } catch (error) {
    console.warn("Shared orders could not be loaded.", error);
    return false;
  }
}

function orderFromSupabaseRow(row) {
  const data = row?.data && typeof row.data === "object" ? row.data : row;
  const id = row?.id || data?.id;
  return id ? { ...data, id } : null;
}

async function saveOrderToSupabase(order) {
  const client = await waitForSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(SUPABASE_ORDERS_TABLE).upsert(
      {
        id: order.id,
        account_id: order.accountId || "",
        email: normalizeEmail(order.email),
        data: order,
      },
      { onConflict: "id" },
    );
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn("Shared order could not be saved.", error);
    return false;
  }
}

function productFromSupabaseRow(row) {
  const data = row?.data && typeof row.data === "object" ? row.data : row;
  const id = row?.id || data?.id;
  return id ? { ...data, id } : null;
}

async function seedRemoteProductCatalogIfEmpty() {
  if (productCatalogSource !== "supabase-empty") return false;

  const result = await saveProductCatalog({ allProducts: true });
  if (result.remoteSaved) {
    showToast("Product catalog is now shared for everyone.");
    return true;
  }

  showToast("Set up Supabase products and storage to save globally.");
  return false;
}

async function saveProductCatalog({ product = null, allProducts = false } = {}) {
  const targetProducts = allProducts || !product ? products : [product];

  try {
    await upsertProductsToSupabase(targetProducts);
    productCatalogSource = "supabase";
    productCatalogRemoteError = "";
    const localSaved = saveState(PRODUCTS_KEY, products);
    return { localSaved, remoteSaved: true, error: null };
  } catch (error) {
    productCatalogSource = productCatalogSource === "supabase" ? "supabase" : "local";
    productCatalogRemoteError = getSupabaseErrorMessage(error);
    console.warn("Shared product catalog could not be saved.", error);
    return { localSaved: false, remoteSaved: false, error };
  }
}

async function upsertProductsToSupabase(productList) {
  const client = await waitForSupabaseClient();
  if (!client) throw new Error("Supabase client did not load.");

  const updatedAt = new Date().toISOString();
  const rows = [];
  for (const product of productList) {
    const remoteProduct = await prepareProductForRemote(product);
    rows.push({
      id: remoteProduct.id,
      data: remoteProduct,
      updated_at: updatedAt,
    });
  }

  const { error } = await client.from(SUPABASE_PRODUCTS_TABLE).upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

async function prepareProductForRemote(product) {
  const remoteProduct = clone(product);
  if (isDataImage(remoteProduct.image)) {
    remoteProduct.image = await uploadDataUrlToSupabase(remoteProduct.id, remoteProduct.image);
    product.image = remoteProduct.image;
  }
  if (Array.isArray(remoteProduct.gallery)) {
    const gallery = [];
    for (const image of remoteProduct.gallery) {
      if (!image) continue;
      gallery.push(isDataImage(image) ? await uploadDataUrlToSupabase(remoteProduct.id, image) : image);
    }
    remoteProduct.gallery = gallery;
    product.gallery = gallery;
  }
  return remoteProduct;
}

async function uploadDataUrlToSupabase(productId, dataUrl) {
  const client = await waitForSupabaseClient();
  if (!client) throw new Error("Supabase client did not load.");

  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error("Could not prepare image for upload.");
  const blob = await response.blob();
  const contentType = blob.type || dataUrl.match(/^data:([^;]+)/)?.[1] || "image/jpeg";
  const extension = getImageExtension(contentType);
  const path = `products/${productId}-${Date.now()}.${extension}`;

  const { error } = await client.storage.from(SUPABASE_PRODUCT_IMAGES_BUCKET).upload(path, blob, {
    cacheControl: "31536000",
    contentType,
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from(SUPABASE_PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("Supabase did not return a public image URL.");
  return data.publicUrl;
}

function getImageExtension(contentType) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  return "jpg";
}

function isDataImage(source) {
  return typeof source === "string" && source.startsWith("data:image/");
}

function stageLocalOnlyProductImages() {
  localOnlyProductImageQueue = new Map();

  products.forEach((product) => {
    if (product?.id && isDataImage(product.image)) {
      localOnlyProductImageQueue.set(product.id, product.image);
    }
  });
}

async function migrateLocalOnlyProductImages() {
  if (!localOnlyProductImageQueue.size) return false;

  try {
    showToast("Moving local images to Supabase...");
    for (const [productId, dataUrl] of localOnlyProductImageQueue.entries()) {
      const product = getProduct(productId);
      if (!product) continue;
      product.image = await uploadDataUrlToSupabase(product.id, dataUrl);
    }

    const result = await saveProductCatalog({ allProducts: true });
    if (!result.remoteSaved) throw result.error || new Error("Supabase catalog save failed.");
    localOnlyProductImageQueue.clear();
    renderAll();
    showToast("Local product images moved to Supabase.");
    return true;
  } catch (error) {
    console.warn("Local product image migration failed.", error);
    showToast("Could not move old local images. Upload again from admin.");
    return false;
  }
}

function removeLocalOnlyProductImages() {
  let changed = false;

  products.forEach((product) => {
    if (isDataImage(product.image)) {
      product.image = getDefaultProductImage(product.id);
      changed = true;
    }

    if (Array.isArray(product.gallery)) {
      const remoteGallery = product.gallery.filter((image) => image && !isDataImage(image));
      if (remoteGallery.length !== product.gallery.length) {
        product.gallery = remoteGallery;
        changed = true;
      }
    }
  });

  if (changed) saveState(PRODUCTS_KEY, products);
  return changed;
}

function getDefaultProductImage(productId) {
  return DEFAULT_PRODUCTS.find((product) => product.id === productId)?.image || "";
}

function getSupabaseErrorMessage(error) {
  return error?.message || error?.error_description || "Supabase catalog is not configured.";
}

async function initializeSupabaseSession() {
  const client = await waitForSupabaseClient();
  if (!client) return;

  try {
    const authReturn = getSupabaseAuthReturn();
    if (authReturn.error) {
      showToast(authReturn.error);
      cleanAuthUrl();
    } else if (authReturn.code) {
      const { error } = await client.auth.exchangeCodeForSession(authReturn.code);
      if (error) {
        console.warn("Supabase auth code exchange failed.", error);
        showToast("Login returned, but Supabase could not finish the session.");
      }
      cleanAuthUrl();
    } else if (authReturn.accessToken && authReturn.refreshToken) {
      const { error } = await client.auth.setSession({
        access_token: authReturn.accessToken,
        refresh_token: authReturn.refreshToken,
      });
      if (error) {
        console.warn("Supabase auth token session failed.", error);
        showToast("Login returned, but Supabase could not save the session.");
      }
      cleanAuthUrl();
    }

    const { data: sessionData } = await client.auth.getSession();
    let syncedAccount = null;
    if (sessionData.session?.user) {
      syncedAccount = syncSupabaseAccount(sessionData.session.user, { mergeGuestCart: false });
    } else {
      const { data: userData } = await client.auth.getUser();
      if (userData.user) {
        syncedAccount = syncSupabaseAccount(userData.user, { mergeGuestCart: false });
      }
    }

    if (authReturn.hasAuthParams && syncedAccount) {
      showToast(`Welcome, ${syncedAccount.name}.`);
    } else if (authReturn.hasAuthParams && !authReturn.error) {
      showToast("Login returned, but no Supabase user session was found.");
    }

    client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        resetAdminAccess();
        syncSupabaseAccount(session.user, { mergeGuestCart: true });
        void loadOrdersFromSupabase().then(() => renderAll());
        return;
      }
      if (currentUserId?.startsWith("supabase-")) {
        currentUserId = null;
        localStorage.removeItem(SESSION_KEY);
        resetAdminAccess();
        cart = loadState(getCartStorageKey(), []);
        renderAll();
      }
    });
  } catch (error) {
    console.warn("Supabase auth session could not be initialized.", error);
  }
}

function getSupabaseAuthReturn() {
  const params = new URLSearchParams(window.location.search);
  const hashValue = window.location.hash.replace(/^#/, "");

  if (hashValue) {
    const hashParamSource = hashValue.includes("?") ? hashValue.split("?").slice(1).join("?") : hashValue;
    new URLSearchParams(hashParamSource).forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }

  return {
    accessToken: params.get("access_token"),
    code: params.get("code"),
    error: params.get("error_description") || params.get("error"),
    hasAuthParams: SUPABASE_AUTH_RETURN_KEYS.some((key) => params.has(key)),
    refreshToken: params.get("refresh_token"),
  };
}

function cleanAuthUrl() {
  const url = new URL(window.location.href);
  SUPABASE_AUTH_RETURN_KEYS.forEach((param) => url.searchParams.delete(param));

  const hashValue = url.hash.replace(/^#/, "");
  const hashParamSource = hashValue.includes("?") ? hashValue.split("?").slice(1).join("?") : hashValue;
  const hashParams = new URLSearchParams(hashParamSource);
  const hashHasAuthParams = SUPABASE_AUTH_RETURN_KEYS.some((key) => hashParams.has(key));

  const returnRoute = sessionStorage.getItem(AUTH_RETURN_ROUTE_KEY) || "#shop";
  sessionStorage.removeItem(AUTH_RETURN_ROUTE_KEY);
  if (!url.hash || hashHasAuthParams) url.hash = returnRoute;
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function syncSupabaseAccount(user, options = {}) {
  const accountId = `supabase-${user.id}`;
  const metadata = user.user_metadata || {};
  const name =
    metadata.full_name ||
    metadata.name ||
    user.email?.split("@")[0]?.replace(/[._-]+/g, " ") ||
    "Vadi Customer";
  let account = accounts.find((item) => item.id === accountId || item.email === user.email);

  if (account) {
    account.id = accountId;
    account.name = account.name || name;
    account.email = user.email || account.email;
    account.provider = "supabase";
    account.supabaseUserId = user.id;
    account.avatar = metadata.avatar_url || account.avatar || "";
  } else {
    account = {
      id: accountId,
      name,
      email: user.email || "",
      phone: metadata.phone || "",
      address: "",
      state: "",
      provider: "supabase",
      supabaseUserId: user.id,
      avatar: metadata.avatar_url || "",
      createdAt: new Date().toISOString(),
    };
    accounts.push(account);
  }

  saveState(ACCOUNTS_KEY, accounts);
  signInAccount(account, options);
  return account;
}

async function waitForGoogleIdentity() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (window.google?.accounts?.id) return window.google.accounts.id;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

async function createGoogleSignInNonce() {
  const nonceBytes = crypto.getRandomValues(new Uint8Array(32));
  const nonce = btoa(String.fromCharCode(...nonceBytes));
  const encodedNonce = new TextEncoder().encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
  const hashedNonce = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return { nonce, hashedNonce };
}

async function initializeGoogleIdentity(identity) {
  if (isGoogleIdentityInitialized) return;
  if (!googleIdentityInitializationPromise) {
    googleIdentityInitializationPromise = (async () => {
      const noncePair = await createGoogleSignInNonce();
      googleSignInNonce = noncePair.nonce;
      identity.initialize({
        client_id: supabaseConfig.googleClientId,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: "signin",
        nonce: noncePair.hashedNonce,
        ux_mode: "popup",
      });
      isGoogleIdentityInitialized = true;
    })().catch((error) => {
      googleIdentityInitializationPromise = null;
      throw error;
    });
  }
  await googleIdentityInitializationPromise;
}

async function renderGoogleSignInButtons() {
  if (getCurrentUser() || !supabaseConfig?.googleClientId) return;
  const identity = await waitForGoogleIdentity();
  if (!identity) {
    document.querySelectorAll("[data-google-signin]").forEach((slot) => {
      slot.innerHTML = '<button class="google-login-button" type="button" disabled>Google sign-in unavailable</button>';
    });
    return;
  }

  try {
    await initializeGoogleIdentity(identity);
  } catch (error) {
    console.warn("Google sign-in initialization failed.", error);
    document.querySelectorAll("[data-google-signin]").forEach((slot) => {
      slot.innerHTML = '<button class="google-login-button" type="button" disabled>Google sign-in unavailable</button>';
    });
    return;
  }

  document.querySelectorAll("[data-google-signin]").forEach((slot) => {
    if (slot.dataset.googleRendered === "true") return;
    slot.innerHTML = "";
    identity.renderButton(slot, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: Math.min(320, Math.max(220, slot.clientWidth || 320)),
    });
    slot.dataset.googleRendered = "true";
  });
}

async function handleGoogleCredential(response) {
  if (isGoogleLoginStarting) return;
  setGoogleLoginStarting(true);
  showToast("Signing in with Google...");

  const client = await waitForSupabaseClient();
  if (!client) {
    setGoogleLoginStarting(false);
    showToast("Google login could not load. Please try again.");
    return;
  }

  try {
    if (!response?.credential) throw new Error("Google did not return a sign-in credential.");
    if (!googleSignInNonce) throw new Error("Google sign-in security check could not be completed.");
    const { data, error } = await client.auth.signInWithIdToken({
      provider: "google",
      token: response.credential,
      nonce: googleSignInNonce,
    });
    if (error) throw error;

    const account = data?.user ? syncSupabaseAccount(data.user, { mergeGuestCart: true }) : null;
    await loadOrdersFromSupabase();
    renderAll();
    if (account) showToast(`Welcome, ${account.name}.`);
  } catch (error) {
    console.warn("Google ID token sign-in failed.", error);
    showToast(error?.message || "Google login could not complete. Please try again.");
  } finally {
    setGoogleLoginStarting(false);
  }
}

function setGoogleLoginStarting(value) {
  isGoogleLoginStarting = value;
  document.querySelectorAll("[data-google-signin]").forEach((slot) => {
    slot.classList.toggle("is-loading", value);
    slot.setAttribute("aria-busy", String(value));
  });
}

function isAdminAuthorized() {
  return adminAccess.status === "allowed";
}

function resetAdminAccess() {
  adminAccess = {
    status: "unknown",
    checkedUserId: null,
    email: "",
  };
}

function clearAdminData() {
  if (adminSummary) adminSummary.innerHTML = "";
  if (adminProductList) adminProductList.innerHTML = "";
  if (orderList) orderList.innerHTML = "";
  if (orderDetails) orderDetails.innerHTML = "";
}

function renderAdminAccess() {
  if (!adminGate || !adminConsole) return;

  const currentUser = getCurrentUser();
  const allowed = isAdminAuthorized();
  adminGate.hidden = allowed;
  adminConsole.hidden = !allowed;
  if (allowed) {
    adminIdentity.textContent = adminAccess.email ? `Signed in as ${adminAccess.email}` : "Admin verified";
    adminGate.innerHTML = "";
    return;
  }

  if (!currentUser) {
    adminGate.innerHTML = `
      <div class="admin-auth-card">
        <span class="kicker">Admin only</span>
        <h1>Sign in to continue</h1>
        <p>This workspace is protected. Use the Vadi Masala admin Google account to access products and orders.</p>
        <div class="google-signin-slot" data-google-signin aria-label="Continue with Google">
          <button class="google-login-button" type="button" data-google-login disabled>Loading Google...</button>
        </div>
        <button class="text-link" type="button" data-view-link="shop">Back to Store</button>
      </div>
    `;
    void renderGoogleSignInButtons();
    return;
  }

  if (adminAccess.status === "checking") {
    adminGate.innerHTML = `
      <div class="admin-auth-card">
        <span class="kicker">Checking access</span>
        <h1>Verifying admin session</h1>
        <p>Please wait while Vadi Masala confirms this Google account.</p>
      </div>
    `;
    return;
  }

  if (adminAccess.status === "denied") {
    adminGate.innerHTML = `
      <div class="admin-auth-card">
        <span class="kicker">Access denied</span>
        <h1>This account is not an admin</h1>
        <p>${escapeHtml(currentUser.email || "This Google account")} is signed in, but it is not allowed to open the Vadi Masala admin workspace.</p>
        <div class="admin-gate-actions">
          <button class="primary-button" type="button" data-account-action="logout">Sign Out</button>
          <button class="text-link" type="button" data-view-link="shop">Back to Store</button>
        </div>
      </div>
    `;
    return;
  }

  adminGate.innerHTML = `
    <div class="admin-auth-card">
      <span class="kicker">Admin only</span>
      <h1>Admin verification needed</h1>
      <p>Use the Vadi Masala admin Google account to access products and orders.</p>
      <button class="primary-button" type="button" data-account-action="logout">Switch Google Account</button>
    </div>
  `;
}

async function verifyAdminAccess() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    adminAccess = { status: "unauthenticated", checkedUserId: null, email: "" };
    renderAdminAccess();
    clearAdminData();
    return false;
  }

  if (adminAccess.checkedUserId === currentUser.id && ["allowed", "denied"].includes(adminAccess.status)) {
    return isAdminAuthorized();
  }

  adminAccess = { status: "checking", checkedUserId: currentUser.id, email: currentUser.email || "" };
  renderAdminAccess();
  clearAdminData();

  try {
    const accessToken = await getSupabaseAccessToken();
    if (!accessToken) {
      adminAccess = { status: "denied", checkedUserId: currentUser.id, email: currentUser.email || "" };
      renderAdminAccess();
      return false;
    }

    const response = await fetch(ADMIN_SESSION_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.isAdmin) {
      adminAccess = { status: "denied", checkedUserId: currentUser.id, email: result.email || currentUser.email || "" };
      renderAdminAccess();
      clearAdminData();
      return false;
    }

    adminAccess = { status: "allowed", checkedUserId: currentUser.id, email: result.email || currentUser.email || "" };
    const migratedLocalImages = await migrateLocalOnlyProductImages();
    if (!migratedLocalImages) await seedRemoteProductCatalogIfEmpty();
    await loadOrdersFromSupabase();
    void syncAllOrdersToGoogleSheets();
    renderAll();
    return true;
  } catch (error) {
    console.warn("Admin verification failed.", error);
    adminAccess = { status: "denied", checkedUserId: currentUser.id, email: currentUser.email || "" };
    renderAdminAccess();
    clearAdminData();
    return false;
  }
}

async function getSupabaseAccessToken() {
  const client = await waitForSupabaseClient();
  if (!client) return "";
  const { data } = await client.auth.getSession();
  return data.session?.access_token || "";
}

function renderAdminSummary() {
  const listedCount = products.filter((product) => product.listed).length;
  const inventoryValue = products.reduce((sum, product) => sum + getDefaultVariant(product).price * product.stock, 0);
  const openOrders = orders.filter((order) => order.status !== "Delivered").length;
  const revenue = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);
  const catalogStatus = getCatalogStatusLabel();

  adminSummary.innerHTML = `
    <article class="summary-card"><span>Listed products</span><strong>${listedCount}/10</strong></article>
    <article class="summary-card"><span>Shared catalog</span><strong>${catalogStatus}</strong></article>
    <article class="summary-card"><span>Inventory value</span><strong>${formatMoney(inventoryValue)}</strong></article>
    <article class="summary-card"><span>Open orders</span><strong>${openOrders}</strong></article>
    <article class="summary-card"><span>Total sales</span><strong>${formatMoney(revenue)}</strong></article>
  `;
}

function getCatalogStatusLabel() {
  if (productCatalogSource === "supabase") return "Connected";
  if (productCatalogSource === "supabase-empty") return "Empty";
  return productCatalogRemoteError ? "Setup needed" : "Local";
}

function renderAdminGallery(product) {
  const images = getProductGallery(product);
  return `
    <div class="admin-gallery-list">
      ${images
        .map(
          (image, index) => `
            <div class="admin-gallery-item">
              <img src="${image}" alt="" />
              ${
                index === 0
                  ? `<span>Main</span>`
                  : `<button type="button" data-remove-gallery-image="${product.id}" data-gallery-index="${index - 1}" aria-label="Remove image ${index + 1}">Remove</button>`
              }
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAdminProducts() {
  adminProductList.innerHTML = products
    .map((product) => {
      const defaultVariant = getDefaultVariant(product);
      return `
        <article class="admin-product" data-admin-product="${product.id}">
          <div class="admin-product-image">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" />
            <label class="image-upload">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              Main image
              <input type="file" accept="image/*" data-image-upload="${product.id}" />
            </label>
            <label class="image-upload">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              Gallery
              <input type="file" accept="image/*" multiple data-gallery-upload="${product.id}" />
            </label>
          </div>
          <div class="admin-product-main">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.region)} · ${escapeHtml(product.category)}</p>
            <label class="switch-row">
              <input type="checkbox" data-listed-toggle="${product.id}" ${product.listed ? "checked" : ""} />
              <span>${product.listed ? "Listed" : "Unlisted"}</span>
            </label>
          </div>
          <div class="admin-field">
            <label for="${product.id}-name">Name</label>
            <input id="${product.id}-name" data-product-input="name" value="${escapeAttribute(product.name)}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-category">Category</label>
            <input id="${product.id}-category" data-product-input="category" value="${escapeAttribute(product.category)}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-region">Region</label>
            <input id="${product.id}-region" data-product-input="region" value="${escapeAttribute(product.region)}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-price">Base Price</label>
            <input id="${product.id}-price" data-product-input="price" data-digits-only="integer" inputmode="numeric" type="text" pattern="[0-9]+" maxlength="7" value="${defaultVariant.price}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-stock">Quantity</label>
            <input id="${product.id}-stock" data-product-input="stock" data-digits-only="integer" inputmode="numeric" type="text" pattern="[0-9]+" maxlength="6" value="${product.stock}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-badge">Badge</label>
            <input id="${product.id}-badge" data-product-input="badge" value="${escapeAttribute(product.badge)}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-pack">Pack</label>
            <input id="${product.id}-pack" data-product-input="pack" value="${escapeAttribute(defaultVariant.label)}" />
          </div>
          <div class="admin-field wide-field">
            <label for="${product.id}-description">Description</label>
            <input id="${product.id}-description" data-product-input="description" value="${escapeAttribute(product.description)}" />
          </div>
          <div class="admin-field wide-field">
            <label for="${product.id}-longDescription">Detailed Description</label>
            <textarea id="${product.id}-longDescription" data-product-input="longDescription" rows="3">${escapeHtml(product.longDescription)}</textarea>
          </div>
          <div class="admin-field wide-field">
            <label for="${product.id}-origin">Origin</label>
            <input id="${product.id}-origin" data-product-input="origin" value="${escapeAttribute(product.origin)}" />
          </div>
          <div class="admin-field wide-field">
            <label for="${product.id}-ingredients">Ingredients</label>
            <input id="${product.id}-ingredients" data-product-input="ingredients" value="${escapeAttribute(product.ingredients)}" />
          </div>
          <div class="admin-field wide-field">
            <label for="${product.id}-use">How to Use</label>
            <textarea id="${product.id}-use" data-product-input="use" rows="2">${escapeHtml(product.use)}</textarea>
          </div>
          <div class="admin-field">
            <label for="${product.id}-flavor">Flavor</label>
            <input id="${product.id}-flavor" data-product-input="flavor" value="${escapeAttribute(product.flavor)}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-heat">Heat</label>
            <input id="${product.id}-heat" data-product-input="heat" value="${escapeAttribute(product.heat)}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-oil">Aroma / Oil</label>
            <input id="${product.id}-oil" data-product-input="oil" value="${escapeAttribute(product.oil)}" />
          </div>
          <div class="admin-field">
            <label for="${product.id}-harvest">Harvest</label>
            <input id="${product.id}-harvest" data-product-input="harvest" value="${escapeAttribute(product.harvest)}" />
          </div>
          <div class="admin-field wide-field">
            <label>Product Images</label>
            ${renderAdminGallery(product)}
          </div>
          <button class="primary-button" type="button" data-save-product="${product.id}">Save</button>
        </article>
      `;
    })
    .join("");
}

function renderOrders() {
  const filter = orderFilter.value;
  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter);

  if (!filteredOrders.some((order) => order.id === selectedOrderId)) {
    selectedOrderId = filteredOrders[0]?.id ?? orders[0]?.id ?? null;
  }

  orderList.innerHTML =
    filteredOrders.length === 0
      ? `<div class="empty-state"><p>No orders in this status.</p></div>`
      : filteredOrders
          .map(
            (order) => `
            <button class="order-card ${order.id === selectedOrderId ? "is-active" : ""}" type="button" data-order-id="${order.id}">
              <div class="order-card-top">
                <span>${order.id}</span>
                <span class="status-pill ${order.status}">${order.status}</span>
              </div>
              <p>${escapeHtml(order.customer)} · ${formatMoney(getOrderTotal(order))}</p>
              <p>${formatDate(order.date)} · ${order.items.length} item${order.items.length === 1 ? "" : "s"}</p>
            </button>
          `,
          )
          .join("");

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);
  if (!selectedOrder) {
    orderDetails.innerHTML = `<div class="empty-state"><p>No order selected.</p></div>`;
    return;
  }

  orderDetails.innerHTML = `
    <div class="details-header">
      <div>
        <span class="kicker">Order ${selectedOrder.id}</span>
        <h3>${escapeHtml(selectedOrder.customer)}</h3>
        <p>${formatDate(selectedOrder.date)}</p>
      </div>
      <div class="admin-field">
        <label for="${selectedOrder.id}-status">Status</label>
        <select id="${selectedOrder.id}-status" data-order-status="${selectedOrder.id}">
          ${["New", "Packed", "Shipped", "Delivered"]
            .map((status) => `<option ${selectedOrder.status === status ? "selected" : ""}>${status}</option>`)
            .join("")}
        </select>
      </div>
    </div>

    <div class="details-grid">
      <div class="detail-box"><span>Phone</span><p>${escapeHtml(selectedOrder.phone)}</p></div>
      <div class="detail-box"><span>Payment</span><p>${escapeHtml(selectedOrder.payment)}</p></div>
      <div class="detail-box"><span>Payment Status</span><p>${escapeHtml(selectedOrder.paymentStatus || "Pending")}</p></div>
      <div class="detail-box"><span>Coupon</span><p>${escapeHtml(selectedOrder.couponCode || "None")}</p></div>
      <div class="detail-box"><span>Address</span><p>${escapeHtml(selectedOrder.address)}</p></div>
      <div class="detail-box"><span>Total</span><p>${formatMoney(getOrderTotal(selectedOrder))}</p></div>
    </div>

    <div class="order-items">
      ${selectedOrder.items
        .map(
          (item) => `
          <div class="order-item">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <p>${escapeHtml(item.pack)} · Qty ${item.qty}</p>
            </div>
            <strong>${formatMoney(item.price * item.qty)}</strong>
          </div>
        `,
        )
        .join("")}
    </div>
    ${
      Number(selectedOrder.discount) > 0
        ? `<div class="summary-line"><span>${escapeHtml(selectedOrder.couponCode || "Discount")}</span><strong>-${formatMoney(selectedOrder.discount)}</strong></div>`
        : ""
    }
    <div class="summary-line"><span>Shipping</span><strong>${selectedOrder.shipping === 0 ? "Free" : formatMoney(selectedOrder.shipping)}</strong></div>
    <div class="summary-line total"><span>Order total</span><strong>${formatMoney(getOrderTotal(selectedOrder))}</strong></div>
  `;
}

function openAccountDrawer() {
  closeCart();
  renderAccount();
  accountDrawer.classList.add("is-open");
  accountDrawer.setAttribute("aria-hidden", "false");
  accountBackdrop.hidden = false;
  document.body.classList.add("no-scroll");
}

function closeAccountDrawer() {
  if (!accountDrawer.classList.contains("is-open")) return;
  accountDrawer.classList.remove("is-open");
  accountDrawer.setAttribute("aria-hidden", "true");
  accountBackdrop.hidden = true;
  document.body.classList.remove("no-scroll");
}

async function handleAccountAction(action) {
  if (action === "logout") {
    const client = getSupabaseClient();
    if (client && currentUserId?.startsWith("supabase-")) {
      await client.auth.signOut().catch(() => {});
    }
    saveActiveCart();
    currentUserId = null;
    localStorage.removeItem(SESSION_KEY);
    resetAdminAccess();
    cart = loadState(getCartStorageKey(), []);
    renderAll();
    showToast("Signed out.");
    return;
  }

  if (action === "shop") {
    closeAccountDrawer();
    setView("shop");
    return;
  }

  if (action === "checkout") {
    closeAccountDrawer();
    openCart();
  }
}

function signInAccount(account, options = {}) {
  const { mergeGuestCart = false } = options;
  const guestCart = mergeGuestCart && !currentUserId ? clone(cart) : [];
  if (currentUserId !== account.id) resetAdminAccess();
  saveActiveCart();
  currentUserId = account.id;
  saveState(SESSION_KEY, currentUserId);
  cart = mergeCartItems(loadState(getCartStorageKey(), []), guestCart);
  saveActiveCart();
  renderAll();
}

function openCart() {
  closeAccountDrawer();
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("no-scroll");
}

function openSuccessModal(orderId) {
  successOrderId.textContent = `Order ${orderId}`;
  successBackdrop.hidden = false;
  successModal.hidden = false;
  successModal.classList.add("is-open");
  successModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeSuccessModal() {
  successModal.classList.remove("is-open");
  successModal.setAttribute("aria-hidden", "true");
  successModal.hidden = true;
  successBackdrop.hidden = true;
  document.body.classList.remove("no-scroll");
}

function handleSuccessAction(action) {
  if (action === "track") {
    closeSuccessModal();
    openAccountDrawer();
    return;
  }

  closeSuccessModal();
  setView("shop", { updateHash: false, scroll: false });
  document.querySelector("#products")?.scrollIntoView({ block: "start" });
  history.replaceState(null, "", "#products");
}

function addToCart(productId, variantId, quantity = 1) {
  const product = getProduct(productId);
  if (!product || product.stock <= 0) return;

  const variant = getVariant(product, variantId) ?? getDefaultVariant(product);
  const existing = cart.find((item) => item.id === productId && item.variantId === variant.id);
  const currentQty = existing?.qty ?? 0;
  const nextQty = Math.min(currentQty + quantity, product.stock);

  if (nextQty === currentQty) {
    showToast("No more stock available for this spice.");
    return;
  }

  if (existing) {
    existing.qty = nextQty;
  } else {
    cart.push({ id: productId, variantId: variant.id, qty: nextQty });
  }
  saveActiveCart();
  renderCart();
  showToast(`${product.name} (${variant.label}) added to cart.`);
}

function updateCartItem(action, productId, variantId) {
  const item = cart.find((entry) => entry.id === productId && entry.variantId === variantId);
  const product = getProduct(productId);
  if (!item || !product) return;

  if (action === "increase") {
    const nextQty = Math.min(item.qty + 1, product.stock);
    if (nextQty === item.qty) showToast(`Only ${product.stock} left in stock.`);
    item.qty = nextQty;
  }
  if (action === "decrease") {
    item.qty -= 1;
  }

  cart = cart.filter((entry) => entry.qty > 0);
  saveActiveCart();
  renderCart();
}

function clampCartToStock({ notify = false } = {}) {
  let changed = false;
  const removedNames = [];
  const reducedNames = [];

  cart = cart
    .map((item) => {
      const product = getProduct(item.id);
      if (!product || product.stock <= 0) {
        changed = true;
        if (product) removedNames.push(product.name);
        return null;
      }

      const currentQty = Math.max(1, Number(item.qty) || 1);
      const nextQty = Math.min(currentQty, product.stock);
      if (nextQty !== currentQty) {
        changed = true;
        reducedNames.push(product.name);
      }
      return { ...item, qty: nextQty };
    })
    .filter(Boolean);

  if (changed) {
    saveActiveCart();
    if (notify) {
      const changedNames = [...new Set([...removedNames, ...reducedNames])];
      showToast(changedNames.length ? `Cart updated for available stock: ${changedNames[0]}.` : "Cart updated for available stock.");
    }
  }

  return changed;
}

async function placeOrder(formData) {
  if (isPlacingOrder) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    openAccountDrawer();
    showToast("Login to place your order.");
    return;
  }

  isPlacingOrder = true;
  renderCart();
  let verifiedPayment = null;

  try {
    showToast("Checking live stock...");
    await loadProductsFromSupabase();
    if (clampCartToStock({ notify: true })) {
      renderAll();
      return;
    }

    const enrichedCart = getCartItems();
    const pricing = getCartPricing(enrichedCart, appliedCouponCode);
    if (pricing.subtotal < MIN_ORDER_VALUE) {
      showToast(`Minimum order value is ${formatMoney(MIN_ORDER_VALUE)}.`);
      return;
    }

    const customerName = String(formData.get("customer") || currentUser.name).trim().replace(/\s+/g, " ");
    const phone = normalizeIndianPhone(formData.get("phone"));
    const address = String(formData.get("address") || "").trim().replace(/\s+/g, " ");
    const state = String(formData.get("state") || "").trim().replace(/\s+/g, " ");
    const validationError = getCheckoutDetailsValidationError({ customerName, phone, address, state });
    if (validationError) {
      showToast(validationError);
      return;
    }
    const requestedPaymentMethod = String(formData.get("payment") || "Razorpay");
    const paymentMethod = requestedPaymentMethod === "Cash on Delivery" ? "Cash on Delivery" : "Razorpay";
    currentUser.name = customerName || currentUser.name;
    currentUser.phone = phone || currentUser.phone;
    currentUser.address = address || currentUser.address;
    currentUser.state = state || currentUser.state;
    saveState(ACCOUNTS_KEY, accounts);

    const order = {
      id: createOrderId(),
      date: new Date().toISOString().slice(0, 10),
      accountId: currentUser.id,
      email: currentUser.email,
      customer: currentUser.name,
      phone: currentUser.phone,
      state: currentUser.state,
      address: `${currentUser.address}, ${currentUser.state}`.replace(/^,\s*|,\s*$/g, ""),
      supabaseUserId: currentUser.supabaseUserId || "",
      payment: paymentMethod,
      status: "New",
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      couponCode: pricing.couponCode,
      couponLabel: pricing.couponLabel,
      items: enrichedCart.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        name: item.name,
        pack: item.pack,
        price: item.price,
        qty: item.qty,
      })),
      shipping: pricing.shipping,
      totalAmount: pricing.total,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Due on Delivery" : "Pending",
    };

    await assertOrderCheckoutAvailable();

    if (paymentMethod === "Razorpay") {
      verifiedPayment = await collectRazorpayPayment({ order, currentUser });
      order.paymentStatus = "Paid";
      order.razorpay = verifiedPayment;
    }

    const result = await placeSupabaseOrder(order);
    applyRemoteProducts(result.products);
    const savedOrder = result.order || order;
    orders = [savedOrder, ...orders.filter((item) => item.id !== savedOrder.id)];
    selectedOrderId = savedOrder.id;
    await syncOrderToGoogleSheets(savedOrder);
    cart = [];
    clearAppliedCouponState();
    saveState(ORDERS_KEY, orders);
    saveState(PRODUCTS_KEY, products);
    saveActiveCart();
    renderAll();
    closeCart();
    openSuccessModal(savedOrder.id);
  } catch (error) {
    console.warn("Shared checkout failed.", error);
    await loadProductsFromSupabase();
    clampCartToStock({ notify: true });
    renderAll();
    showToast(getCheckoutErrorMessage(error, { verifiedPayment }));
  } finally {
    isPlacingOrder = false;
    renderCart();
  }
}

async function collectRazorpayPayment({ order, currentUser }) {
  if (!supabaseConfig?.razorpayKeyId) throw new Error("RAZORPAY_KEY_MISSING");

  const razorpayOrder = await createRazorpayOrder({
    currency: "INR",
    receipt: order.id,
    couponCode: order.couponCode || "",
    items: order.items.map((item) => ({
      id: item.id,
      variantId: item.variantId,
      qty: item.qty,
    })),
  });

  const payment = await openRazorpayCheckout({
    razorpayOrder,
    order,
    currentUser,
  });

  const verifiedPayment = await verifyRazorpayPayment(payment);
  return {
    orderId: verifiedPayment.razorpay_order_id,
    paymentId: verifiedPayment.razorpay_payment_id,
    signature: payment.razorpay_signature,
  };
}

async function createRazorpayOrder(payload) {
  const response = await fetch(RAZORPAY_CREATE_ORDER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "RAZORPAY_ORDER_FAILED");
  return result;
}

function openRazorpayCheckout({ razorpayOrder, order, currentUser }) {
  if (!window.Razorpay) throw new Error("RAZORPAY_CHECKOUT_MISSING");

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      callback(value);
    };

    const checkout = new window.Razorpay({
      key: supabaseConfig.razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Vadi Masala",
      description: `Order ${order.id}`,
      order_id: razorpayOrder.order_id,
      prefill: {
        name: currentUser.name || "",
        email: currentUser.email || "",
        contact: currentUser.phone || "",
      },
      notes: {
        receipt: order.id,
      },
      theme: {
        color: "#9c5600",
      },
      handler(payment) {
        finish(resolve, payment);
      },
      modal: {
        ondismiss() {
          finish(reject, new Error("PAYMENT_CANCELLED"));
        },
      },
    });

    checkout.on("payment.failed", (response) => {
      const message = response?.error?.description || response?.error?.reason || "PAYMENT_FAILED";
      finish(reject, new Error(message));
    });

    checkout.open();
  });
}

async function verifyRazorpayPayment(payment) {
  const response = await fetch(RAZORPAY_VERIFY_PAYMENT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payment),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.error || "PAYMENT_VERIFICATION_FAILED");
  return result;
}

async function placeSupabaseOrder(order) {
  const client = await waitForSupabaseClient();
  if (!client) throw new Error("Supabase checkout is not configured.");

  const { data, error } = await client.rpc("place_order", {
    order_payload: order,
  });
  if (error) throw error;

  return {
    order: data?.order || order,
    products: Array.isArray(data?.products) ? data.products : [],
  };
}

async function assertOrderCheckoutAvailable() {
  const client = await waitForSupabaseClient();
  if (!client) throw new Error("CHECKOUT_NOT_CONFIGURED");

  const { error } = await client.rpc("place_order", {
    order_payload: {},
  });
  if (!error) return true;

  const message = [error.code, error.message, error.details, error.hint].filter(Boolean).join(" ");
  if (message.includes("ORDER_ID_REQUIRED")) return true;
  if (message.includes("PGRST202") || message.includes("Could not find the function") || message.includes("schema cache")) {
    throw new Error("CHECKOUT_NOT_CONFIGURED");
  }
  throw error;
}

async function syncOrderToGoogleSheets(order) {
  if (!order?.id) return false;
  return requestGoogleSheetsSync({ orderId: order.id });
}

async function syncAllOrdersToGoogleSheets() {
  if (!isAdminAuthorized()) return false;
  return requestGoogleSheetsSync({ syncAll: true });
}

async function requestGoogleSheetsSync(payload) {
  try {
    const token = await getSupabaseAccessToken();
    if (!token) return false;
    const response = await fetch(ORDER_SYNC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok === false) {
      console.warn("Google Sheets sync did not complete.", result);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Google Sheets sync failed.", error);
    return false;
  }
}

function applyRemoteProducts(remoteProducts) {
  if (!Array.isArray(remoteProducts) || !remoteProducts.length) return;

  const remoteById = new Map(remoteProducts.filter((product) => product?.id).map((product) => [product.id, product]));
  products = normalizeProducts(products.map((product) => (remoteById.has(product.id) ? { ...product, ...remoteById.get(product.id) } : product)));
}

function createOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VM${time}${random}`;
}

function getCheckoutErrorMessage(error, options = {}) {
  const message = String(error?.message || error?.details || "");
  if (options.verifiedPayment) return "Payment verified, but order stock changed. Contact Vadi Masala support with your payment ID.";
  if (message.includes("CHECKOUT_NOT_CONFIGURED")) return "Checkout is temporarily unavailable. Please try again shortly.";
  if (message.includes("PAYMENT_CANCELLED")) return "Payment cancelled. Your order was not placed.";
  if (message.includes("RAZORPAY_KEY_MISSING")) return "Razorpay is not configured yet.";
  if (message.includes("RAZORPAY_CHECKOUT_MISSING")) return "Payment checkout could not load. Please try again.";
  if (message.includes("PAYMENT_VERIFICATION_FAILED") || message.includes("Invalid payment signature")) {
    return "Payment verification failed. Your order was not placed.";
  }
  const stockMatch = message.match(/OUT_OF_STOCK:([^:]+):(\d+)/);
  if (stockMatch) {
    const product = getProduct(stockMatch[1]);
    return `${product?.name || "This product"} has only ${stockMatch[2]} left. Cart updated.`;
  }
  if (message.includes("LOGIN_REQUIRED")) return "Login again before placing the order.";
  if (message.includes("ORDER_EMAIL_MISMATCH")) return "Login again before placing the order.";
  if (message.includes("PRODUCT_NOT_FOUND")) return "One cart item is no longer available.";
  if (message.includes("place_order")) return "Run the updated Supabase SQL before checkout can update stock.";
  return "Order could not be placed. Please try again.";
}

async function saveProductFromAdmin(productId) {
  const card = adminProductList.querySelector(`[data-admin-product="${productId}"]`);
  const product = getProduct(productId);
  if (!card || !product) return;

  const productIndex = products.findIndex((item) => item.id === productId);
  const originalProduct = clone(product);
  const defaultVariant = getDefaultVariant(product);
  const name = card.querySelector('[data-product-input="name"]').value.trim();
  const category = card.querySelector('[data-product-input="category"]').value.trim();
  const region = card.querySelector('[data-product-input="region"]').value.trim();
  const priceValue = card.querySelector('[data-product-input="price"]').value;
  const stockValue = card.querySelector('[data-product-input="stock"]').value;
  const price = Number(priceValue);
  const stock = Number(stockValue);
  const pack = card.querySelector('[data-product-input="pack"]').value.trim();
  const badge = card.querySelector('[data-product-input="badge"]').value.trim();
  const description = card.querySelector('[data-product-input="description"]').value.trim();
  const longDescription = card.querySelector('[data-product-input="longDescription"]').value.trim();
  const origin = card.querySelector('[data-product-input="origin"]').value.trim();
  const ingredients = card.querySelector('[data-product-input="ingredients"]').value.trim();
  const use = card.querySelector('[data-product-input="use"]').value.trim();
  const flavor = card.querySelector('[data-product-input="flavor"]').value.trim();
  const heat = card.querySelector('[data-product-input="heat"]').value.trim();
  const oil = card.querySelector('[data-product-input="oil"]').value.trim();
  const harvest = card.querySelector('[data-product-input="harvest"]').value.trim();

  if (!/^\d+$/.test(priceValue) || !Number.isInteger(price) || price < 1) {
    showToast("Enter a valid product price using numbers only.");
    return;
  }
  if (!/^\d+$/.test(stockValue) || !Number.isInteger(stock) || stock < 0) {
    showToast("Enter valid product stock using numbers only.");
    return;
  }

  product.name = name || product.name;
  product.category = category || product.category;
  product.region = region || product.region;
  if (Number.isFinite(price) && price > 0) {
    defaultVariant.price = Math.round(price);
    product.price = defaultVariant.price;
  }
  product.stock = Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : product.stock;
  defaultVariant.label = pack || defaultVariant.label;
  product.pack = defaultVariant.label;
  product.badge = badge || product.badge;
  product.description = description || product.description;
  product.longDescription = longDescription || product.longDescription || product.description;
  product.origin = origin || product.origin;
  product.ingredients = ingredients || product.ingredients;
  product.use = use || product.use;
  product.flavor = flavor || product.flavor;
  product.heat = heat || product.heat;
  product.oil = oil || product.oil;
  product.harvest = harvest || product.harvest;

  const result = await saveProductCatalog({ product });
  if (!result.remoteSaved) {
    if (productIndex >= 0) products[productIndex] = originalProduct;
    renderAll();
    showToast("Could not save globally. Set up Supabase products first.");
    return;
  }

  renderAll();
  showToast(`${product.name} updated for everyone.`);
}

async function uploadProductImage(productId, file) {
  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file.");
    return;
  }

  const product = getProduct(productId);
  if (!product) return;
  const originalImage = product.image;

  try {
    product.image = await uploadOptimizedProductImage(product.id, file, "Uploading main image...");
    const result = await saveProductCatalog({ product });
    if (!result.remoteSaved) {
      product.image = originalImage;
      renderAll();
      showToast("Image was not saved. Set up Supabase products first.");
      return;
    }

    renderAll();
    showToast(`${product.name} image updated for everyone.`);
  } catch (error) {
    product.image = originalImage;
    renderAll();
    console.warn("Product image upload failed.", error);
    showToast("Image upload failed. Set up Supabase Storage before uploading.");
  }
}

async function uploadProductGalleryImages(productId, files) {
  const product = getProduct(productId);
  if (!product) return;
  const validFiles = files.filter((file) => file.type.startsWith("image/")).slice(0, 6);
  if (!validFiles.length) {
    showToast("Please choose image files.");
    return;
  }

  const originalGallery = Array.isArray(product.gallery) ? [...product.gallery] : [];
  try {
    const uploadedImages = [];
    for (const file of validFiles) {
      uploadedImages.push(await uploadOptimizedProductImage(product.id, file, "Uploading gallery images..."));
    }
    product.gallery = [...originalGallery, ...uploadedImages].slice(0, 6);
    const result = await saveProductCatalog({ product });
    if (!result.remoteSaved) {
      product.gallery = originalGallery;
      renderAll();
      showToast("Gallery was not saved. Set up Supabase products first.");
      return;
    }

    renderAll();
    showToast(`${product.name} gallery updated.`);
  } catch (error) {
    product.gallery = originalGallery;
    renderAll();
    console.warn("Gallery upload failed.", error);
    showToast("Gallery upload failed. Set up Supabase Storage before uploading.");
  }
}

async function removeProductGalleryImage(productId, galleryIndex) {
  const product = getProduct(productId);
  if (!product || !Array.isArray(product.gallery) || !Number.isInteger(galleryIndex)) return;
  const originalGallery = [...product.gallery];
  product.gallery.splice(galleryIndex, 1);
  const result = await saveProductCatalog({ product });
  if (!result.remoteSaved) {
    product.gallery = originalGallery;
    renderAll();
    showToast("Could not remove gallery image globally.");
    return;
  }
  renderAll();
  showToast("Gallery image removed.");
}

async function uploadOptimizedProductImage(productId, file, message) {
  showToast("Optimizing product image...");
  const imageData = await resizeImageFile(file);
  showToast(message);
  return uploadDataUrlToSupabase(productId, imageData);
}

function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      try {
        resolve(await resizeImageSource(String(reader.result || "")));
      } catch (error) {
        reject(error);
      }
    });
    reader.addEventListener("error", () => reject(reader.error || new Error("Could not read image file.")));
    reader.readAsDataURL(file);
  });
}

function resizeImageSource(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const scale = Math.min(1, MAX_PRODUCT_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas is not available."));
        return;
      }
      context.fillStyle = "#fffaf2";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", PRODUCT_IMAGE_QUALITY));
    });
    image.addEventListener("error", () => reject(new Error("Could not load image.")));
    image.src = source;
  });
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getDefaultVariant(product) {
  return product.variants?.[0] ?? { id: product.pack, label: product.pack, price: product.price };
}

function getVariant(product, variantId) {
  return product.variants?.find((variant) => variant.id === variantId);
}

function getProductGallery(product) {
  const ownImages = [product.image, ...(Array.isArray(product.gallery) ? product.gallery : [])]
    .filter((image) => image && !isDataImage(image));
  return [...new Set(ownImages.length ? ownImages : [getDefaultProductImage(product.id)])];
}

function getCurrentUser() {
  return accounts.find((account) => account.id === currentUserId) ?? null;
}

function getCurrentUserOrders() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  return orders.filter((order) => order.accountId === currentUser.id || order.email === currentUser.email);
}

function getCartStorageKey(accountId = currentUserId) {
  return accountId ? `${CART_KEY}-${accountId}` : CART_KEY;
}

function saveActiveCart() {
  saveState(getCartStorageKey(), cart);
}

function mergeCartItems(baseCart, incomingCart) {
  const merged = clone(baseCart || []);
  (incomingCart || []).forEach((item) => {
    const existing = merged.find((entry) => entry.id === item.id && entry.variantId === item.variantId);
    if (existing) {
      existing.qty = Math.min(existing.qty + item.qty, getProduct(item.id)?.stock ?? existing.qty + item.qty);
    } else {
      merged.push({ ...item });
    }
  });
  return merged;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeIndianPhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  return digits.slice(0, 10);
}

function getCheckoutDetailsValidationError({ customerName, phone, address, state }) {
  if (!/^[A-Za-z][A-Za-z .'-]{1,79}$/.test(customerName)) return "Enter a valid customer name.";
  if (!/^[6-9]\d{9}$/.test(phone)) return "Enter a valid 10-digit Indian mobile number.";
  if (address.length < 10 || address.length > 300) return "Enter a complete delivery address.";
  if (!/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(state)) return "Enter a valid state name.";
  return "";
}

function getInitials(name) {
  return String(name || "VM")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getCardProductName(product) {
  const names = {
    "lakadong-turmeric": "Golden Turmeric",
    "kashmiri-chilli": "Kashmiri Chilli",
    "black-pepper": "Tellicherry Pepper",
    "roasted-cumin": "Roasted Cumin",
    "coriander-powder": "Coriander Powder",
    "green-cardamom": "Green Cardamom",
    "cinnamon-sticks": "Cinnamon Sticks",
    "clove-whole": "Whole Cloves",
    "garam-masala": "Garam Masala",
    "fenugreek-seeds": "Fenugreek Seeds",
  };
  return names[product.id] || product.name;
}

function getCartItems() {
  return cart
    .map((item) => {
      const product = getProduct(item.id);
      if (!product) return null;
      const variant = getVariant(product, item.variantId) ?? getDefaultVariant(product);
      return {
        ...product,
        variantId: variant.id,
        pack: variant.label,
        price: variant.price,
        qty: item.qty,
      };
    })
    .filter(Boolean);
}

function normalizeCouponCode(value) {
  return String(value || "").trim().toUpperCase();
}

function getCoupon(code) {
  const normalized = normalizeCouponCode(code);
  if (normalized !== TEST_COUPON_CODE) return null;
  return {
    code: TEST_COUPON_CODE,
    label: "TEST99 99% off",
    rate: 0.99,
    waivesShipping: true,
    minimumPayable: 1,
  };
}

function getCartPricing(items, couponCode = appliedCouponCode) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const coupon = getCoupon(couponCode);
  let discount = 0;
  let shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_VALUE ? 0 : SHIPPING_FEE;

  if (coupon && subtotal >= MIN_ORDER_VALUE) {
    discount = Math.min(subtotal - coupon.minimumPayable, Math.round(subtotal * coupon.rate));
    if (coupon.waivesShipping) shipping = 0;
  }

  const total = Math.max(coupon?.minimumPayable || 0, subtotal - discount + shipping);
  return {
    couponCode: coupon?.code || "",
    couponLabel: coupon?.label || "",
    discount,
    shipping,
    subtotal,
    total,
  };
}

function applyCouponFromCart() {
  const input = cartBody?.querySelector("#couponCode");
  const code = normalizeCouponCode(input?.value);
  const coupon = getCoupon(code);
  if (!coupon) {
    showToast("Coupon code is invalid.");
    return;
  }

  const pricing = getCartPricing(getCartItems(), coupon.code);
  if (pricing.subtotal < MIN_ORDER_VALUE) {
    showToast(`Add ${formatMoney(MIN_ORDER_VALUE - pricing.subtotal)} more before applying ${coupon.code}.`);
    return;
  }

  appliedCouponCode = coupon.code;
  saveState(COUPON_KEY, appliedCouponCode);
  renderCart();
  showToast(`${coupon.code} applied.`);
}

function clearAppliedCoupon() {
  clearAppliedCouponState();
  renderCart();
  showToast("Coupon removed.");
}

function clearAppliedCouponState() {
  appliedCouponCode = "";
  localStorage.removeItem(COUPON_KEY);
}

function getOrderSubtotal(order) {
  return Number.isFinite(Number(order.subtotal)) ? Number(order.subtotal) : order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getOrderTotal(order) {
  if (Number.isFinite(Number(order.totalAmount))) return Number(order.totalAmount);
  return getOrderSubtotal(order) - (Number(order.discount) || 0) + (Number(order.shipping) || 0);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCardPrice(value) {
  return `₹ ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
