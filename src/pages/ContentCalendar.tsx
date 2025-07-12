import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ContentPiece {
  id: string;
  title: string;
  platform: string;
  status: string;
  created_at: string;
  personal_brand_id: string | null;
}

const statusConfig = {
  'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Clock },
  'in_review': { label: 'In Review', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  'approved': { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'scheduled': { label: 'Scheduled', color: 'bg-purple-100 text-purple-800', icon: Calendar },
  'published': { label: 'Published', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle }
};

const platformColors = {
  'linkedin': 'bg-blue-500',
  'youtube': 'bg-red-500',
  'newsletter': 'bg-orange-500',
  'instagram': 'bg-pink-500'
};

export default function ContentCalendar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contentPieces, setContentPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchContentPieces();
    }
  }, [user, currentDate]);

  const fetchContentPieces = async () => {
    try {
      setLoading(true);
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const { data, error } = await supabase
        .from('content_pieces')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      setContentPieces(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error loading content",
        description: "Failed to load content pieces",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = contentPieces.filter(piece => {
    const platformMatch = selectedPlatform === 'all' || piece.platform === selectedPlatform;
    const statusMatch = selectedStatus === 'all' || piece.status === selectedStatus;
    return platformMatch && statusMatch;
  });

  const getContentForDate = (date: Date) => {
    return filteredContent.filter(piece => 
      isSameDay(new Date(piece.created_at), date)
    );
  };

  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || Clock;
    return <IconComponent className="h-3 w-3" />;
  };

  const totalContent = filteredContent.length;
  const publishedContent = filteredContent.filter(p => p.status === 'published').length;
  const scheduledContent = filteredContent.filter(p => p.status === 'scheduled').length;
  const pendingContent = filteredContent.filter(p => ['draft', 'in_review'].includes(p.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your content schedule across all platforms
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalContent}</p>
                <p className="text-xs text-muted-foreground">Total Content</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{publishedContent}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{scheduledContent}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{pendingContent}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-b">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map(day => {
              const dayContent = getContentForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 border-r border-b transition-colors hover:bg-muted/50 ${
                    !isCurrentMonth ? 'text-muted-foreground bg-muted/30' : ''
                  } ${isToday ? 'bg-primary/5 border-primary/20' : ''}`}
                >
                  <div className={`text-sm mb-2 ${isToday ? 'font-bold text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayContent.slice(0, 3).map(piece => {
                      const statusConfig_ = statusConfig[piece.status as keyof typeof statusConfig];
                      const platformColor = platformColors[piece.platform as keyof typeof platformColors] || 'bg-gray-500';
                      
                      return (
                        <div
                          key={piece.id}
                          className="p-1 rounded text-xs border cursor-pointer hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <div className={`w-2 h-2 rounded-full ${platformColor}`} />
                            <span className="font-medium truncate flex-1">{piece.title}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(piece.status)}
                            <span className={`text-xs px-1 py-0.5 rounded ${statusConfig_?.color || 'bg-gray-100 text-gray-800'}`}>
                              {statusConfig_?.label || piece.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {dayContent.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayContent.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}