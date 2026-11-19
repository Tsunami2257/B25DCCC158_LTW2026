import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((text) => {
    setNotice({ text, id: Date.now() + Math.random() });
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => {
      setNotice(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {notice && (
        <div role="status" className="notice-banner">
          {notice.text}
        </div>
      )}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNotice phải dùng bên trong NoticeProvider');
  }
  return context;
};