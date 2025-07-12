import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { 
  Users, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  FileText,
  User
} from 'lucide-react';

export default function Dashboard() {
  const { profile, isContentStrategist, isClient, clientRelationships } = useUser();

  if (isClient) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {profile?.full_name || 'Client'}!
          </h1>
          <p className="text-muted-foreground">Your content performance dashboard</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                  <p className="text-xs text-muted-foreground">Need Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Content Awaiting Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              3 pieces of content are ready for your review and approval.
            </p>
            <Button>Review Content</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {profile?.full_name || 'Strategist'}!
        </h1>
        <p className="text-muted-foreground">Manage your clients and content strategies</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{clientRelationships.length}</p>
                <p className="text-xs text-muted-foreground">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">47</p>
                <p className="text-xs text-muted-foreground">Content Pieces</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {clientRelationships.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {clientRelationships.map((rel) => (
                <div key={rel.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {rel.client_profile?.full_name || 'Unknown Client'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {rel.client_profile?.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No clients yet. Complete onboarding to invite clients.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}