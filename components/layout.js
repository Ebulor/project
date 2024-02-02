import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="mx-6 md:max-w-2xl md:mx-auto font-poppins">
      <Nav />
      <main className="flex flex-col items-center">{children}</main>
    </div>
  );
}
