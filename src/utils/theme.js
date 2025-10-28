// Aivy Theme - Futuristic Cyan + White Design System
export const aivyTheme = {
  colors: {
    // Primary Colors - Cyan & White
    primary: '#00FFFF',          // Main cyan
    primaryLight: '#33FFFF',     // Lighter cyan
    primaryDark: '#00CCCC',      // Darker cyan
    secondary: '#FFFFFF',        // Pure white
    
    // Background Colors
    background: '#000000',       // Pure black for contrast
    surface: '#0A0A0A',         // Slightly lighter black
    surfaceElevated: '#1A1A1A',  // Elevated surfaces
    surfaceHighest: '#2A2A2A',   // Highest elevation
    
    // Text Colors
    text: '#FFFFFF',             // Primary text (white)
    textSecondary: '#CCCCCC',    // Secondary text
    textTertiary: '#999999',     // Tertiary text
    textInverse: '#000000',      // Text on cyan backgrounds
    
    // Status Colors with Cyan Tint
    success: '#00FF88',          // Cyan-tinted green
    warning: '#FFD700',          // Gold
    error: '#FF4466',            // Red with slight warmth
    info: '#00BBFF',             // Light cyan blue
    
    // Gradient Colors
    primaryGradientStart: '#00FFFF',
    primaryGradientEnd: '#0088FF',
    backgroundGradientStart: '#000000',
    backgroundGradientEnd: '#001122',
    
    // Component Specific
    border: '#333333',
    shadow: 'rgba(0, 255, 255, 0.2)', // Cyan shadow
    overlay: 'rgba(0, 0, 0, 0.8)',
    
    // Activity Colors
    calories: '#FF6B6B',         // Red-orange
    hydration: '#00FFFF',        // Cyan
    fitness: '#00FF88',          // Green-cyan
    nutrition: '#FFB347',        // Orange
    sleep: '#9B59B6',           // Purple
    
    // Chart Colors
    chartPrimary: '#00FFFF',
    chartSecondary: '#00BBFF',
    chartTertiary: '#0088FF',
    chartAccent: '#FF6B6B',
    
    // Notification
    notification: '#FF4466',
    
    // Category Pills
    categoryActive: '#00FFFF',
    categoryActiveText: '#000000',
    categoryInactive: '#333333',
    categoryInactiveText: '#CCCCCC',
  },
  
  // Typography
  typography: {
    // Use Poppins-style font weights
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  
  // Shadows with Cyan Glow
  shadows: {
    sm: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
  },
  
  // Animation timings
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },
};

// Hook to use theme
import { useMemo } from 'react';

export function useAivyTheme() {
  return useMemo(() => aivyTheme, []);
}

export default useAivyTheme;