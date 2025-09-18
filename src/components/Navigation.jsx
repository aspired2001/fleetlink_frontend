import React from 'react'
import { NavLink } from 'react-router-dom'
import { Truck, Search, Calendar, Plus } from 'lucide-react'

function Navigation() {
    const tabs = [
        {
            id: 'search',
            label: 'Search & Book',
            icon: Search,
            path: '/search',
            description: 'Find and book available vehicles'
        },
        {
            id: 'add-vehicle',
            label: 'Add Vehicle',
            icon: Plus,
            path: '/add-vehicle',
            description: 'Add new vehicles to the fleet'
        },
        {
            id: 'vehicles',
            label: 'Fleet Management',
            icon: Truck,
            path: '/vehicles',
            description: 'Manage your vehicle fleet'
        },
        {
            id: 'bookings',
            label: 'Bookings',
            icon: Calendar,
            path: '/bookings',
            description: 'View and manage all bookings'
        }
    ]

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <Truck className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold text-primary">FleetLink</h1>
                    </div>
                    <div className="flex space-x-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <NavLink
                                    key={tab.id}
                                    to={tab.path}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`
                                    }
                                    title={tab.description}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </NavLink>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation