
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, DollarSign, AlertCircle, TrendingUp, Calendar, Star, CreditCard } from 'lucide-react';
import { adminData } from '@/data/adminData';

export const AdminDashboard: React.FC = () => {
  const { stats } = adminData.dashboard;

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs.toLocaleString(),
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Active Disputes",
      value: stats.activeDisputes.toLocaleString(),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Completed Jobs",
      value: stats.completedJobs.toLocaleString(),
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments.toLocaleString(),
      icon: CreditCard,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Monthly Growth</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Freelancers</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalFreelancers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.monthlyGrowth}% this month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Employers</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalEmployers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{(stats.monthlyGrowth * 0.8).toFixed(1)}% this month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{(stats.monthlyGrowth * 1.2).toFixed(1)}% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
