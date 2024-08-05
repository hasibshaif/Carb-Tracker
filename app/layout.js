import { Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Carb Tracker"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lora.className}>{children}</body>
    </html>
  );
}
