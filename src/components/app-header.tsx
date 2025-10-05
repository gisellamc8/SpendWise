"use client";

import Image from 'next/image';
import Notifications from './notifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { LogOut, ShoppingCart, User } from 'lucide-react';
import ShoppingCartSheet from './shopping-cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useCart } from '@/context/cart-context';
import { useAuth, useUser } from '@/firebase';
import Link from 'next/link';

export default function AppHeader() {
  const { totalItems } = useCart();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  }

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo1.png" alt="SpendWise" width={250} height={250} />
        </Link>
        <div className="flex items-center gap-4">
          <Notifications />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <ShoppingCartSheet />
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {isUserLoading ? "Loading..." : user ? (user.isAnonymous ? "Guest" : user.email) : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isUserLoading ? null : user ? (
                 <DropdownMenuItem>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Button className="w-full" asChild>
                    <Link href="/login">Log In / Sign Up</Link>
                  </Button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
