import ClientLayout from "./ClientLayout";


export const metadata = {
  title: "E-Learn",
  // description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
