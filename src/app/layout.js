import "./globals.css";

export const metadata = {
  title: "MaritimeOps",
  description: "Simplified container terminal management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
