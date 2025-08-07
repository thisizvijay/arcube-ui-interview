'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Plane, Activity, Webhook } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavigationMenu = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const isPartner = user?.role === 'partner';
  const isAdmin = user?.role === 'admin';
  const showDashboardMenu = isPartner || isAdmin;

  const isOrdersActive = pathname === '/';
  const isDashboardActive = pathname === '/dashboard';
  const isWebhooksActive = pathname === '/webhooks';

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isOrdersActive ? "default" : "outline"}
        size="sm"
        asChild
        className="flex items-center"
      >
        <Link href="/">
          <Plane className="h-4 w-4 mr-2" />
          Orders
        </Link>
      </Button>
      
      {showDashboardMenu && (
        <Button
          variant={isDashboardActive ? "default" : "outline"}
          size="sm"
          asChild
          className="flex items-center"
        >
          <Link href="/dashboard">
            <Activity className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      )}
      
      {isAdmin && (
        <Button
          variant={isWebhooksActive ? "default" : "outline"}
          size="sm"
          asChild
          className="flex items-center"
        >
          <Link href="/webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </Link>
        </Button>
      )}
    </div>
  );
}; 