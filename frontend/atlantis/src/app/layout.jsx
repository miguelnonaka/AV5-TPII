import "./globals.css";
import { ApiProvider } from "../components/ApiProvider/ApiProvider";
import { AppFrame } from "../components/AppFrame/AppFrame";

export const metadata = {
  title: "Atlantis",
  description: "Sistema web de gestao hoteleira",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
    >
      <body>
        <ApiProvider>
          <AppFrame>
            {children}
          </AppFrame>
        </ApiProvider>
      </body>
    </html>
  );
}
