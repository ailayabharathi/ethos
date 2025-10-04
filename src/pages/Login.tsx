"use client";

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/auth/SessionContextProvider';
import { useNavigate } from 'react-router-dom'; // Fixed import syntax

const Login = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/'); // Redirect to dashboard if already logged in
    }
  }, [session, navigate]);

  if (session) {
    return null; // Don't render login form if already logged in
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-foreground">Welcome Back!</h1>
        <Auth
          supabaseClient={supabase}
          providers={[]} // You can add 'google', 'github', etc. here if desired
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  // Diagnostic colors to ensure visibility of input and potential toggle
                  inputBackground: 'white', // Force white background for visibility
                  inputText: 'black',     // Force black text for visibility
                  // Re-adding other original theme variables to maintain overall look
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  defaultButtonBackground: 'hsl(var(--secondary))',
                  defaultButtonBackgroundHover: 'hsl(var(--secondary-foreground))',
                  defaultButtonBorder: 'hsl(var(--border))',
                  defaultButtonText: 'hsl(var(--secondary-foreground))',
                },
              },
            },
          }}
          theme="dark" // Using dark theme for Auth UI to match app's dark mode
          redirectTo={window.location.origin + '/'} // Redirect to home after successful login
          localization={{
            variables: {
              sign_in: {
                link_text: '', // Fixed: Changed sign_up_link_text to link_text to hide the "Don't have an account? Sign up" link
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;