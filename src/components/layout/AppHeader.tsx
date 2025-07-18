import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { usePersonalBrand } from '@/contexts/PersonalBrandContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings, User, Keyboard, Search, Briefcase, Plus, UserIcon } from 'lucide-react';

export function AppHeader() {
  const { user, signOut } = useUser();
  const { workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace } = useWorkspace();
  const { personalBrands, currentPersonalBrand, setCurrentPersonalBrand } = usePersonalBrand();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  if (!user) return null;

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const handleCreateWorkspace = async () => {
    if (newWorkspaceName.trim()) {
      await createWorkspace({ name: newWorkspaceName.trim() });
      setNewWorkspaceName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCreateDialogOpen(true);
  };

  return (
    <header className="h-14 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Sidebar trigger and workspace selector */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="smooth-transition" />
          
          {/* Personal Brand Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={currentPersonalBrand?.id || ''} 
                onValueChange={(value) => {
                  const brand = personalBrands.find(b => b.id === value);
                  setCurrentPersonalBrand(brand || null);
                }}
              >
                <SelectTrigger className="w-[200px] h-8">
                  <SelectValue placeholder="Select personal brand..." />
                </SelectTrigger>
                <SelectContent>
                  {personalBrands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Workspace Selector */}
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={currentWorkspace?.id || ''} 
                onValueChange={(value) => {
                  const workspace = workspaces.find(w => w.id === value);
                  setCurrentWorkspace(workspace || null);
                }}
              >
                <SelectTrigger className="w-[200px] h-8">
                  <SelectValue placeholder="Select workspace..." />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <SelectItem value="__create__">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start p-0 h-auto font-normal"
                          onClick={handleCreateClick}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Workspace
                        </Button>
                      </SelectItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Workspace</DialogTitle>
                        <DialogDescription>
                          Create a new workspace for organizing your content and projects.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="workspace-name">Workspace Name</Label>
                          <Input
                            id="workspace-name"
                            value={newWorkspaceName}
                            onChange={(e) => setNewWorkspaceName(e.target.value)}
                            placeholder="e.g., Personal Brand, Client Project..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleCreateWorkspace();
                              }
                            }}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsCreateDialogOpen(false);
                            setNewWorkspaceName('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
                          Create Workspace
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Right side - User menu and quick actions */}
        <div className="flex items-center space-x-3">
          {/* Global Search Trigger */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex items-center space-x-2 text-muted-foreground hover:text-foreground min-w-[200px] justify-start"
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true
              });
              document.dispatchEvent(event);
            }}
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="kbd ml-auto">⌘K</kbd>
          </Button>

          {/* Keyboard shortcuts hint */}
          <div className="hidden lg:flex items-center space-x-1 text-xs text-muted-foreground">
            <Keyboard className="h-3 w-3" />
            <span>⌘K for search</span>
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getUserInitials(user.email || '')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1 text-xs">
                    User
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}