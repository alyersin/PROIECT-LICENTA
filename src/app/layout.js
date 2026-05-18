import "./globals.css";
import "./polish.css";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata = {
  title: "MaritimeOps",
  description: "Simplified Container Terminal Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className={sora.className}>{children}</body>
    </html>
  );
}
