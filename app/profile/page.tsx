'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  MapPin,
  ArrowLeft,
  Edit,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nationality: user?.nationality || '',
    dateOfBirth: user?.dateOfBirth || ''
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect to login)
  if (!user) {
    return null;
  }

  const handleEditClick = () => {
    // Edit functionality not implemented yet
    // This will be implemented later
  };

  const handleSave = () => {
    // TODO: Implement save functionality with backend API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      nationality: user?.nationality || '',
      dateOfBirth: user?.dateOfBirth || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Profile</h1>
            </div>
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name || 'User Name'}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500 capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                                 ) : (
                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                       <Button className="flex items-center">
                         <Edit className="h-4 w-4 mr-2" />
                         Edit Profile
                       </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                       <AlertDialogHeader>
                         <div className="flex items-center">
                           <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                             <AlertTriangle className="h-5 w-5 text-yellow-600" />
                           </div>
                           <AlertDialogTitle>Edit Functionality Not Available</AlertDialogTitle>
                         </div>
                       </AlertDialogHeader>
                       <AlertDialogDescription className="text-left">
                         The edit profile functionality is not implemented yet. This feature will be available in a future update. You can currently view your profile information but cannot modify it.
                       </AlertDialogDescription>
                       <AlertDialogFooter>
                         <AlertDialogCancel>Close</AlertDialogCancel>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                 )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                </div>
                <div className="md:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.name || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                </div>
                <div className="md:col-span-2">
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                </div>
                <div className="md:col-span-2">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                </div>
                <div className="md:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.nationality}
                      onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{user.nationality || 'Not provided'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                </div>
                <div className="md:col-span-2">
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">
                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Permissions</label>
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {user.permissions && user.permissions.length > 0 ? (
                      user.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {permission}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No specific permissions assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
} 