import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import VisitorTracker from "@/components/tracking/VisitorTracker";
import WhatsAppButton from "@/components/common/WhatsAppButton";

// Providers
import AuthProvider from "@/components/auth/AuthProvider";
import CartProvider from "@/components/cart/CartProvider";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '500', '600'],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Buy Certified Medications & Healthcare Products Online`,
  description: SITE_DESCRIPTION,
  keywords: [
    "buy medications online",
    "online pharmacy no prescription",
    "buy codeine online",
    "promethazine with codeine",
    "codeine linctus",
    "painkillers online",
    "Adderall",
    "Oxycodone",
    "Tramadol",
    "benzodiazepines",
    "Rivotril clonazepam",
    "Clonazolam",
    "diet pills",
    "Adipex phentermine",
    "Foundayo GLP-1 tablets",
    "Alluvi retatrutide",
    "Wegovy",
    "Nembutal",
    "Phenobarbital",
    "Potassium cyanide",
    "men sex health",
    "Anadrol oxymetholone",
    "research chemicals",
    "1P-LSD",
    "1CP-LSD",
    "4-HO-MET",
    "discreet shipping",
  ],
  other: {
    'theme-color': '#FFFFFF',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Buy Certified Medications & Healthcare Products Online`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Buy Certified Medications & Healthcare Products Online`,
    description: SITE_DESCRIPTION,
  },
  verification: {
    // Add your verification codes when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://analytics.ahrefs.com" />
        <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-bone text-ink antialiased">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-bone focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>
        
        <AuthProvider>
          <CartProvider>
            <VisitorTracker />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#0B1D33',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: '14px',
                  letterSpacing: '0.01em',
                },
              }}
            />
            <WhatsAppButton />
            <ConditionalNavbar>
              <Navbar />
            </ConditionalNavbar>
            <main id="main-content" className="flex-grow">{children}</main>
            <ConditionalNavbar>
              <Footer />
            </ConditionalNavbar>
          </CartProvider>
        </AuthProvider>

        {/* Ahrefs Analytics - Lazy load for better performance */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="+CffPsHUUwlzmNtibduF4Q"
          strategy="lazyOnload"
        />

        {/* Smartsupp Live Chat */}
        <Script
          id="smartsupp-chat"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '6433c85acf6d637ffbf9f1d6a486a25a50c962d0';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `,
          }}
        />
      </body>
    </html>
  );
}
