import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'si';

interface Translations {
  [key: string]: {
    en: string;
    si: string;
  };
}

const translations: Translations = {
  'app.title': { en: 'POS System', si: 'POS පද්ධතිය' },
  'dashboard.title': { en: 'Dashboard', si: 'උපකරණ පුවරුව' },
  'sales.title': { en: 'Sales', si: 'විකිණීම්' },
  'inventory.title': { en: 'Inventory', si: 'ඉඟිය' },
  'customers.title': { en: 'Customers', si: 'ගනුදෙනුකරුවන්' },
  'analytics.title': { en: 'Analytics', si: 'විශ්ලේෂණ' },
  'repairs.title': { en: 'Repairs & Services', si: 'අලුත්වැඩියා සහ සේවා' },
  'settings.title': { en: 'Settings', si: 'සැකසීම්' },
  'common.add': { en: 'Add', si: 'එකතු කරන්න' },
  'common.edit': { en: 'Edit', si: 'සංස්කරණය' },
  'common.delete': { en: 'Delete', si: 'මකන්න' },
  'common.save': { en: 'Save', si: 'සුරකින්න' },
  'common.cancel': { en: 'Cancel', si: 'අවලංගු කරන්න' },
  'common.search': { en: 'Search', si: 'සොයන්න' },
  'common.filter': { en: 'Filter', si: 'පෙරහන' },
  'common.total': { en: 'Total', si: 'එකතුව' },
  'common.subtotal': { en: 'Subtotal', si: 'උපඑකතුව' },
  'common.tax': { en: 'Tax', si: 'බද්ද' },
  'common.discount': { en: 'Discount', si: 'වට්ටම්' },
  'common.quantity': { en: 'Quantity', si: 'ප්‍රමාණය' },
  'common.price': { en: 'Price', si: 'මිල' },
  'common.name': { en: 'Name', si: 'නම' },
  'common.email': { en: 'Email', si: 'ඊමේල්' },
  'common.phone': { en: 'Phone', si: 'දුරකථන' },
  'common.address': { en: 'Address', si: 'ලිපිනය' },
  'common.date': { en: 'Date', si: 'දිනය' },
  'common.status': { en: 'Status', si: 'තත්වය' },
  'common.actions': { en: 'Actions', si: 'ක්‍රියා' },
  'common.product': { en: 'Product', si: 'නිෂ්පාදනය' },
  'common.category': { en: 'Category', si: 'කාණ්ඩය' },
  'common.stock': { en: 'Stock', si: 'එළඹ' },
  'common.barcode': { en: 'Barcode', si: 'බාර්කෝඩ්' },
  'common.cart': { en: 'Cart', si: 'කරත්තය' },
  'common.logout': { en: 'Logout', si: 'පිටවීම' },
  'login.title': { en: 'Login', si: 'ඇතුළු වන්න' },
  'login.username': { en: 'Username', si: 'පරිශීලක නම' },
  'login.password': { en: 'Password', si: 'මුරපදය' },
  'login.button': { en: 'Sign In', si: 'ඇතුළු වන්න' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem('language') as Language) || 'en'
  );

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
