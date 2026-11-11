import "./globals.css";

export const metadata = { title: "404 — NORVIGATE Istanbul", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="stub wrap">
          <h1>404</h1>
          <p>Page not found · الصفحة غير موجودة</p>
          <a className="back" href="/en">NORVIGATE Istanbul</a>
        </div>
      </body>
    </html>
  );
}
