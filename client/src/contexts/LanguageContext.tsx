import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type Language = "sq" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translations for both languages
const translations: Record<Language, Record<string, string>> = {
  sq: {
    // Header
    "nav.products": "Produktet",
    "nav.dashboard": "Paneli Im",
    "nav.login": "Hyr",
    "nav.register": "Regjistrohu",
    "nav.logout": "Dilni",
    "nav.profile": "Profili Im",

    // Home
    "home.title": "MerrBio",
    "home.tagline":
      "Produkte të freskëta, organike, dhe vendore direkt nga fermerët",
    "home.viewProducts": "Shiko produktet",
    "home.viewDashboard": "Shiko Panelin",
    "home.forFarmers": "Për Fermerët",
    "home.farmersDesc":
      "Publikoni produktet tuaja dhe lidhuni drejtpërdrejt me konsumatorët vendas.",
    "home.forConsumers": "Për Konsumatorët",
    "home.consumersDesc":
      "Gjeni produkte të freskëta dhe organike nga fermerët afër jush.",

    // Product List Page
    "products.title": "Produktet e Disponueshme",
    "products.search": "Kërko produkte...",
    "products.searchButton": "Kërko",
    "products.noResults": "Nuk u gjetën produkte për",
    "products.noProducts": "Nuk ka produkte të disponueshme për momentin.",
    "products.loading": "Duke ngarkuar...",
    "products.error": "Gabim në ngarkim të produkteve",

    // Product Card
    "product.viewDetails": "Shiko Detajet",
    "product.delete": "Fshi",
    "product.quantity": "Sasia",
    "product.farmer": "Fermeri",

    // Product Detail Page
    "productDetail.backToProducts": "← Kthehu te produktet",
    "productDetail.price": "Çmimi",
    "productDetail.availableQuantity": "Sasia e Disponueshme",
    "productDetail.editProduct": "Ndrysho Produktin",
    "productDetail.quantity": "Sasia (kg)",
    "productDetail.submitRequest": "Dërgo Kërkesën për Blerje",
    "productDetail.sending": "Duke dërguar...",
    "productDetail.loginToBuy": "Identifikohu për të Blerë",
    "productDetail.requestSuccess":
      "Kërkesa juaj u dërgua me sukses! Fermeri do të përgjigjet së shpejti.",
    "productDetail.requestError": "Gabim në dërgimin e kërkesës",
    "productDetail.notFound": "Produkti nuk u gjet",
    "productDetail.loadingError": "Gabim në ngarkim të produktit",

    // Farmer Dashboard
    "farmerDashboard.title": "Paneli i Fermerit",
    "farmerDashboard.products": "Produktet e Mia",
    "farmerDashboard.requests": "Kërkesat e Blerjeve",
    "farmerDashboard.addProduct": "+ Shto Produkt",
    "farmerDashboard.noProducts":
      "Nuk keni produkte. Shtoni produkte për t'i shfaqur këtu.",
    "farmerDashboard.noRequests":
      "Nuk keni kërkesa për blerje. Kur konsumatorët bëjnë kërkesa, do të shfaqen këtu.",
    "farmerDashboard.product": "Produkti",
    "farmerDashboard.quantity": "Sasia",
    "farmerDashboard.consumer": "Konsumatori",
    "farmerDashboard.contact": "Kontakt",
    "farmerDashboard.date": "Data",
    "farmerDashboard.status": "Statusi",
    "farmerDashboard.actions": "Veprime",
    "farmerDashboard.pending": "Në pritje",
    "farmerDashboard.approved": "Aprovuar",
    "farmerDashboard.rejected": "Refuzuar",
    "farmerDashboard.approve": "Aprovo",
    "farmerDashboard.reject": "Refuzo",
    "farmerDashboard.viewProduct": "Shiko Produktin",
    "farmerDashboard.errorProducts": "Gabim në ngarkim të produkteve",
    "farmerDashboard.errorRequests": "Gabim në ngarkim të kërkesave",
    "farmerDashboard.errorDelete": "Gabim në fshirjen e produktit",
    "farmerDashboard.errorUpdateStatus": "Gabim në përditësimin e statusit",
    "farmerDashboard.loadingProducts": "Duke ngarkuar produktet...",
    "farmerDashboard.loadingRequests": "Duke ngarkuar kërkesat...",

    // Consumer Dashboard
    "consumerDashboard.title": "Paneli i Konsumatorit",
    "consumerDashboard.browseProducts": "Shfletoni Produktet",
    "consumerDashboard.myRequests": "Kërkesat e Mia",
    "consumerDashboard.noRequests":
      "Nuk keni kërkesa aktive. Shfletoni produktet për të bërë kërkesa.",
    "consumerDashboard.errorRequests": "Gabim në ngarkim të kërkesave",

    // Add/Edit Product
    "productForm.backToDashboard": "← Kthehu te Paneli",
    "productForm.addTitle": "Shto Produkt të Ri",
    "productForm.editTitle": "Ndrysho Produktin",
    "productForm.productName": "Emri i Produktit",
    "productForm.price": "Çmimi (€/kg)",
    "productForm.quantity": "Sasia (kg)",
    "productForm.description": "Përshkrimi",
    "productForm.productNamePlaceholder": "p.sh. Domate Bio",
    "productForm.pricePlaceholder": "p.sh. 2.50",
    "productForm.quantityPlaceholder": "p.sh. 50",
    "productForm.descriptionPlaceholder": "Përshkruani produktin tuaj",
    "productForm.adding": "Duke shtuar...",
    "productForm.updating": "Duke përditësuar...",
    "productForm.addButton": "Shto Produktin",
    "productForm.updateButton": "Përditëso Produktin",
    "productForm.addSuccess": "Produkti u shtua me sukses!",
    "productForm.updateSuccess": "Produkti u përditësua me sukses!",
    "productForm.addError": "Gabim në shtimin e produktit",
    "productForm.updateError": "Gabim në përditësimin e produktit",
    "productForm.unauthorized":
      "Ju nuk keni të drejtë të ndryshoni këtë produkt.",

    // Authentication
    "auth.registerTitle": "Regjistrohu në MerrBio",
    "auth.loginTitle": "Hyr në MerrBio",
    "auth.username": "Emri i përdoruesit",
    "auth.email": "Email",
    "auth.password": "Fjalëkalimi",
    "auth.role": "Roli",
    "auth.farmer": "Fermer",
    "auth.customer": "Konsumator",
    "auth.usernamePlaceholder": "Emri juaj",
    "auth.emailPlaceholder": "juaji@email.com",
    "auth.passwordPlaceholder": "Fjalëkalimi juaj",
    "auth.registerButton": "Regjistrohu",
    "auth.loginButton": "Hyr",
    "auth.registering": "Duke u regjistruar...",
    "auth.loggingIn": "Duke u identifikuar...",
    "auth.haveAccount": "Keni tashmë një llogari?",
    "auth.noAccount": "Nuk keni një llogari?",

    // Footer
    "footer.rights": "Të gjitha të drejtat e rezervuara",
    "footer.about": "Rreth Nesh",
    "footer.terms": "Kushtet e Përdorimit",
    "footer.privacy": "Privatësia",

    // Common UI components
    loading: "Duke ngarkuar...",
    "error.message": "Gabim:",
    "success.message": "Sukses:",

    // Language toggle
    language: "English",

    // Profile Page
    "profile.title": "Profili Im",
    "profile.personalInfo": "Informacioni Personal",
    "profile.username": "Emri i përdoruesit",
    "profile.email": "Email",
    "profile.role": "Roli",
    "profile.changePassword": "Ndrysho Fjalëkalimin",
    "profile.currentPassword": "Fjalëkalimi aktual",
    "profile.newPassword": "Fjalëkalimi i ri",
    "profile.confirmPassword": "Konfirmo fjalëkalimin",
    "profile.saveChanges": "Ruaj Ndryshimet",
    "profile.saving": "Duke ruajtur...",
    "profile.updateSuccess": "Profili u përditësua me sukses!",
    "profile.updateError": "Gabim në përditësimin e profilit",
    "profile.notFound": "Profili nuk u gjet",
    "profile.passwordInfo":
      "Plotëso fushën e fjalëkalimit vetëm nëse dëshiron ta ndryshosh.",
    "profile.passwordMismatch": "Fjalëkalimet nuk përputhen",
    "profile.passwordTooShort":
      "Fjalëkalimi duhet të jetë të paktën 6 karaktere",
    "profile.currentPasswordRequired":
      "Kërkohet fjalëkalimi aktual për të ndryshuar fjalëkalimin",
  },
  en: {
    // Header
    "nav.products": "Products",
    "nav.dashboard": "My Dashboard",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "nav.profile": "My Profile",

    // Home
    "home.title": "MerrBio",
    "home.tagline": "Fresh, organic, and local products directly from farmers",
    "home.viewProducts": "View products",
    "home.viewDashboard": "View Dashboard",
    "home.forFarmers": "For Farmers",
    "home.farmersDesc":
      "List your products and connect directly with local consumers.",
    "home.forConsumers": "For Consumers",
    "home.consumersDesc":
      "Find fresh and organic products from farmers near you.",

    // Product List Page
    "products.title": "Available Products",
    "products.search": "Search products...",
    "products.searchButton": "Search",
    "products.noResults": "No products found for",
    "products.noProducts": "No products available at the moment.",
    "products.loading": "Loading...",
    "products.error": "Error loading products",

    // Product Card
    "product.viewDetails": "View Details",
    "product.delete": "Delete",
    "product.quantity": "Quantity",
    "product.farmer": "Farmer",

    // Product Detail Page
    "productDetail.backToProducts": "← Back to products",
    "productDetail.price": "Price",
    "productDetail.availableQuantity": "Available Quantity",
    "productDetail.editProduct": "Edit Product",
    "productDetail.quantity": "Quantity (kg)",
    "productDetail.submitRequest": "Submit Purchase Request",
    "productDetail.sending": "Sending...",
    "productDetail.loginToBuy": "Login to Purchase",
    "productDetail.requestSuccess":
      "Your request was sent successfully! The farmer will respond soon.",
    "productDetail.requestError": "Error sending request",
    "productDetail.notFound": "Product not found",
    "productDetail.loadingError": "Error loading product",

    // Farmer Dashboard
    "farmerDashboard.title": "Farmer Dashboard",
    "farmerDashboard.products": "My Products",
    "farmerDashboard.requests": "Purchase Requests",
    "farmerDashboard.addProduct": "+ Add Product",
    "farmerDashboard.noProducts":
      "You have no products. Add products to display them here.",
    "farmerDashboard.noRequests":
      "You have no purchase requests. When consumers make requests, they will appear here.",
    "farmerDashboard.product": "Product",
    "farmerDashboard.quantity": "Quantity",
    "farmerDashboard.consumer": "Consumer",
    "farmerDashboard.contact": "Contact",
    "farmerDashboard.date": "Date",
    "farmerDashboard.status": "Status",
    "farmerDashboard.actions": "Actions",
    "farmerDashboard.pending": "Pending",
    "farmerDashboard.approved": "Approved",
    "farmerDashboard.rejected": "Rejected",
    "farmerDashboard.approve": "Approve",
    "farmerDashboard.reject": "Reject",
    "farmerDashboard.viewProduct": "View Product",
    "farmerDashboard.errorProducts": "Error loading products",
    "farmerDashboard.errorRequests": "Error loading requests",
    "farmerDashboard.errorDelete": "Error deleting product",
    "farmerDashboard.errorUpdateStatus": "Error updating status",
    "farmerDashboard.loadingProducts": "Loading products...",
    "farmerDashboard.loadingRequests": "Loading requests...",

    // Consumer Dashboard
    "consumerDashboard.title": "Consumer Dashboard",
    "consumerDashboard.browseProducts": "Browse Products",
    "consumerDashboard.myRequests": "My Requests",
    "consumerDashboard.noRequests":
      "You have no active requests. Browse products to make requests.",
    "consumerDashboard.errorRequests": "Error loading requests",

    // Add/Edit Product
    "productForm.backToDashboard": "← Back to Dashboard",
    "productForm.addTitle": "Add New Product",
    "productForm.editTitle": "Edit Product",
    "productForm.productName": "Product Name",
    "productForm.price": "Price (€/kg)",
    "productForm.quantity": "Quantity (kg)",
    "productForm.description": "Description",
    "productForm.productNamePlaceholder": "e.g. Organic Tomatoes",
    "productForm.pricePlaceholder": "e.g. 2.50",
    "productForm.quantityPlaceholder": "e.g. 50",
    "productForm.descriptionPlaceholder": "Describe your product",
    "productForm.adding": "Adding...",
    "productForm.updating": "Updating...",
    "productForm.addButton": "Add Product",
    "productForm.updateButton": "Update Product",
    "productForm.addSuccess": "Product added successfully!",
    "productForm.updateSuccess": "Product updated successfully!",
    "productForm.addError": "Error adding product",
    "productForm.updateError": "Error updating product",
    "productForm.unauthorized":
      "You don't have permission to edit this product.",

    // Authentication
    "auth.registerTitle": "Register with MerrBio",
    "auth.loginTitle": "Login to MerrBio",
    "auth.username": "Username",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.role": "Role",
    "auth.farmer": "Farmer",
    "auth.customer": "Customer",
    "auth.usernamePlaceholder": "Your name",
    "auth.emailPlaceholder": "your@email.com",
    "auth.passwordPlaceholder": "Your password",
    "auth.registerButton": "Register",
    "auth.loginButton": "Login",
    "auth.registering": "Registering...",
    "auth.loggingIn": "Logging in...",
    "auth.haveAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",

    // Footer
    "footer.rights": "All rights reserved",
    "footer.about": "About Us",
    "footer.terms": "Terms of Use",
    "footer.privacy": "Privacy",

    // Common UI components
    loading: "Loading...",
    "error.message": "Error:",
    "success.message": "Success:",

    // Language toggle
    language: "Shqip",

    // Profile Page
    "profile.title": "My Profile",
    "profile.personalInfo": "Personal Information",
    "profile.username": "Username",
    "profile.email": "Email",
    "profile.role": "Role",
    "profile.changePassword": "Change Password",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm Password",
    "profile.saveChanges": "Save Changes",
    "profile.saving": "Saving...",
    "profile.updateSuccess": "Profile updated successfully!",
    "profile.updateError": "Error updating profile",
    "profile.notFound": "Profile not found",
    "profile.passwordInfo":
      "Fill in the password fields only if you want to change your password.",
    "profile.passwordMismatch": "Passwords don't match",
    "profile.passwordTooShort": "Password must be at least 6 characters",
    "profile.currentPasswordRequired":
      "Current password is required to change password",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get initial language from localStorage or default to Albanian
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage === "en" ? "en" : "sq") as Language;
  });

  // Translate function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Update language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Update document language attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
