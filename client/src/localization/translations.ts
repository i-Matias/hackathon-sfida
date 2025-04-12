export const translations = {
  en: {
    // Auth
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    username: "Username",
    role: "Role",
    farmer: "Farmer",
    consumer: "Consumer",
    logout: "Logout",

    // Products
    products: "Products",
    addProduct: "Add Product",
    productName: "Product Name",
    productDescription: "Product Description",
    productPrice: "Price",
    productQuantity: "Quantity",
    search: "Search",
    filter: "Filter",

    // Actions
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    update: "Update",
    cancel: "Cancel",
    requestToBuy: "Request to Buy",

    // Messages
    messages: "Messages",
    send: "Send",
    sendMessage: "Send Message",
    noMessages: "No messages yet",

    // Dashboard
    dashboard: "Dashboard",
    farmerDashboard: "Farmer Dashboard",
    consumerDashboard: "Consumer Dashboard",
    adminDashboard: "Admin Dashboard",
    myProducts: "My Products",
    buyRequests: "Buy Requests",

    // Admin
    users: "Users",
    allProducts: "All Products",

    // Misc
    language: "Language",
    english: "English",
    albanian: "Albanian",
  },
  sq: {
    // Auth
    login: "Hyrje",
    signup: "Regjistrohu",
    email: "Email",
    password: "Fjalëkalimi",
    username: "Emri i përdoruesit",
    role: "Roli",
    farmer: "Fermer",
    consumer: "Konsumator",
    logout: "Dilni",

    // Products
    products: "Produktet",
    addProduct: "Shto Produkt",
    productName: "Emri i Produktit",
    productDescription: "Përshkrimi i Produktit",
    productPrice: "Çmimi",
    productQuantity: "Sasia",
    search: "Kërko",
    filter: "Filtro",

    // Actions
    save: "Ruaj",
    edit: "Ndrysho",
    delete: "Fshi",
    update: "Përditëso",
    cancel: "Anulo",
    requestToBuy: "Bëj kërkesë për të blerë",

    // Messages
    messages: "Mesazhet",
    send: "Dërgo",
    sendMessage: "Dërgo Mesazh",
    noMessages: "Asnjë mesazh ende",

    // Dashboard
    dashboard: "Paneli",
    farmerDashboard: "Paneli i Fermerit",
    consumerDashboard: "Paneli i Konsumatorit",
    adminDashboard: "Paneli i Administratorit",
    myProducts: "Produktet e Mia",
    buyRequests: "Kërkesat për Blerje",

    // Admin
    users: "Përdoruesit",
    allProducts: "Të Gjitha Produktet",

    // Misc
    language: "Gjuha",
    english: "Anglisht",
    albanian: "Shqip",
  },
};

export type TranslationKey = keyof typeof translations.en;
