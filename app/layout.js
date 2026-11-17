import "./globals.css";

export const metadata = { title: "Coy Discover", description: "Swipe. Match only when it's mutual." };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#22123a" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
