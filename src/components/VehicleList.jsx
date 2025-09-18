import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useGetAllVehiclesQuery, useDeleteVehicleMutation } from '../store/services/vehicleApi'
import { useToast } from './ui/toast'
import { Truck, Filter, Trash2, AlertCircle, Weight,BombIcon, Calendar } from 'lucide-react'
import { formatDateTime } from '../lib/utils'

const VehicleList = () => {
    const [filters, setFilters] = useState({
        status: '',
        minCapacity: ''
    })

    const { addToast } = useToast()
    const [deleteVehicle] = useDeleteVehicleMutation()

    const {
        data: vehicles = [],
        isLoading,
        error
    } = useGetAllVehiclesQuery(filters)

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDeleteVehicle = async (vehicle) => {
        if (window.confirm(`Are you sure you want to delete "${vehicle.name}"?`)) {
            try {
                await deleteVehicle(vehicle._id).unwrap()
                addToast({
                    variant: 'success',
                    title: 'Vehicle Deleted',
                    description: `${vehicle.name} has been removed from the fleet`
                })
            } catch (error) {
                addToast({
                    variant: 'error',
                    title: 'Delete Failed',
                    description: error.data?.message || 'Failed to delete vehicle'
                })
            }
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'retired':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getVehicleTypeColor = (type) => {
        switch (type) {
            case 'Light Vehicle':
                return 'text-green-600'
            case 'Medium Vehicle':
                return 'text-yellow-600'
            case 'Heavy Vehicle':
                return 'text-red-600'
            default:
                return 'text-gray-600'
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading vehicles...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600">Failed to load vehicles</p>
                        <p className="text-sm text-muted-foreground">{error.data?.message || error.message}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Filters</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minCapacity">Minimum Capacity (KG)</Label>
                            <Input
                                id="minCapacity"
                                name="minCapacity"
                                type="number"
                                min="1"
                                placeholder="e.g., 1000"
                                value={filters.minCapacity}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vehicle List */}
            <Card>
                <CardHeader>
                    <CardTitle>Fleet Overview</CardTitle>
                    <CardDescription>
                        {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in your fleet
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {vehicles.length === 0 ? (
                        <div className="text-center py-8">
                            <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                No vehicles found
                            </h3>
                            <p className="text-muted-foreground">
                                {Object.values(filters).some(f => f)
                                    ? 'Try adjusting your filters or add some vehicles to get started.'
                                    : 'Add your first vehicle to get started.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {vehicles.map((vehicle) => (
                                <div key={vehicle._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <Truck className="mr-2 h-5 w-5" />
                                                    {vehicle.name}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vehicle.status)}`}>
                                                    {vehicle.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center text-muted-foreground">
                                                    <Weight className="mr-1 h-4 w-4" />
                                                    <span>{vehicle.capacityKg} KG</span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <BombIcon className="mr-1 h-4 w-4" />
                                                    <span>{vehicle.tyres} Tyres</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`font-medium ${getVehicleTypeColor(vehicle.type)}`}>
                                                        {vehicle.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    <span>{formatDateTime(vehicle.createdAt)}</span>
                                                </div>
                                            </div>

                                            {vehicle.registrationNumber && (
                                                <p className="text-sm text-muted-foreground">
                                                    Registration: {vehicle.registrationNumber}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteVehicle(vehicle)}
                                                disabled={vehicle.status === 'retired'}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default VehicleList