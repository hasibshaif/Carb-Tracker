import { Fira_Sans } from "next/font/google";
import "./globals.css";

const fira_sans = Fira_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Carb Tracker"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={fira_sans.className}>{children}</body>
    </html>
  );
}
