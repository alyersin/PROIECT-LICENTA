import "./globals.css";
import "./polish.css";

export const metadata = {
  title: "MaritimeOps",
  description: "Simplified Container Terminal Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
