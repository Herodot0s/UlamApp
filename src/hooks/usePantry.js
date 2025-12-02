import { useState, useEffect, useRef } from 'react';
import { identifyIngredientsFromImage } from '../services/api';
import { normalize } from '../utils/helpers.js';

export const usePantry = () => {
  // --- STATE ---
  const [input, setInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  // FIX: Changed 'SX' to 'setError' so the variable exists
  const [error, setError] = useState(null); 

  // Initialize Cart from LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ulam_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
      return [];
    }
  });

  const fileInputRef = useRef(null);

  // --- EFFECTS ---
  // Save Cart whenever it changes
  useEffect(() => {
    localStorage.setItem('ulam_cart', JSON.stringify(cart));
  }, [cart]);

  // --- ACTIONS ---

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Prevent duplicates
    if (cart.some(item => normalize(item) === normalize(input))) {
      setInput("");
      return;
    }
    
    setCart(prev => [...prev, input.trim()]);
    setInput("");
  };

  const removeIngredient = (index) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);

    try {
      // Call the API service
      const detectedIngredients = await identifyIngredientsFromImage(file);
      
      // Filter out duplicates that are already in the cart
      const newIngredients = detectedIngredients.filter(
        item => !cart.some(cartItem => normalize(cartItem) === normalize(item))
      );

      if (newIngredients.length > 0) {
        setCart(prev => [...prev, ...newIngredients]);
      } else {
        setError("No new ingredients detected or they are already in your list.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to scan image. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsScanning(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return {
    cart,
    setCart,
    input,
    setInput,
    isScanning,
    error,
    setError,
    fileInputRef,
    handleAddIngredient,
    removeIngredient,
    handleCameraClick,
    handleFileChange
  };
};
