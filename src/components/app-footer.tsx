export default function AppFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p className="font-semibold text-primary">Price Match Guarantee</p>
        <p className="text-sm mb-2">
          Find a lower price? We'll match it. Shop with confidence.
        </p>
        <p className="text-xs">
          © {new Date().getFullYear()} WasteNot Wallet. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
