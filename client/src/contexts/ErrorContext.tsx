import React, { createContext, useContext, useState } from "react";

interface ErrorContextType {
  errors: string[];

  addError: (error: string) => void;
  removeError: (error: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const addError = (error: string) => {
    setErrors((prev) => [...prev, error]);
  };

  const removeError = (error: string) => {
    setErrors((prev) => prev.filter((e) => e !== error));
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useErrorContext must be used inside ErrorProvider");
  return context;
};
