import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useCreateVehicleMutation } from '../store/services/vehicleApi'
import { useToast } from './ui/toast'
import { Loader2, Truck } from 'lucide-react'

const AddVehicleForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        capacityKg: '',
        tyres: '',
        registrationNumber: ''
    })

    const [errors, setErrors] = useState({})
    const [createVehicle, { isLoading }] = useCreateVehicleMutation()
    const { addToast } = useToast()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Vehicle name is required'
        } else if (formData.name.length > 100) {
            newErrors.name = 'Vehicle name cannot exceed 100 characters'
        }

        const capacity = parseInt(formData.capacityKg)
        if (!formData.capacityKg || isNaN(capacity)) {
            newErrors.capacityKg = 'Valid capacity is required'
        } else if (capacity < 1) {
            newErrors.capacityKg = 'Capacity must be at least 1 kg'
        } else if (capacity > 50000) {
            newErrors.capacityKg = 'Capacity cannot exceed 50,000 kg'
        }

        const tyres = parseInt(formData.tyres)
        if (!formData.tyres || isNaN(tyres)) {
            newErrors.tyres = 'Valid number of tyres is required'
        } else if (tyres < 2) {
            newErrors.tyres = 'Vehicle must have at least 2 tyres'
        } else if (tyres > 18) {
            newErrors.tyres = 'Vehicle cannot have more than 18 tyres'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const vehicleData = {
                name: formData.name.trim(),
                capacityKg: parseInt(formData.capacityKg),
                tyres: parseInt(formData.tyres)
            }

            if (formData.registrationNumber.trim()) {
                vehicleData.registrationNumber = formData.registrationNumber.trim()
            }

            const result = await createVehicle(vehicleData).unwrap()

            addToast({
                variant: 'success',
                title: 'Success!',
                description: 'Vehicle created successfully'
            })

            // Reset form
            setFormData({
                name: '',
                capacityKg: '',
                tyres: '',
                registrationNumber: ''
            })

        } catch (error) {
            addToast({
                variant: 'error',
                title: 'Error',
                description: error.data?.message || 'Failed to create vehicle'
            })
        }
    }

    const getVehicleType = (capacity) => {
        const cap = parseInt(capacity)
        if (!cap) return ''
        if (cap <= 1000) return 'Light Vehicle'
        if (cap <= 5000) return 'Medium Vehicle'
        return 'Heavy Vehicle'
    }

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Truck className="h-6 w-6 text-primary" />
                    <CardTitle>Add New Vehicle</CardTitle>
                </div>
                <CardDescription>
                    Add a new vehicle to your fleet
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Vehicle Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g., Truck A"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacityKg">Capacity (KG) *</Label>
                        <Input
                            id="capacityKg"
                            name="capacityKg"
                            type="number"
                            min="1"
                            max="50000"
                            placeholder="e.g., 1500"
                            value={formData.capacityKg}
                            onChange={handleChange}
                            className={errors.capacityKg ? 'border-red-500' : ''}
                        />
                        {formData.capacityKg && (
                            <p className="text-sm text-muted-foreground">
                                Type: {getVehicleType(formData.capacityKg)}
                            </p>
                        )}
                        {errors.capacityKg && (
                            <p className="text-sm text-red-500">{errors.capacityKg}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tyres">Number of Tyres *</Label>
                        <Input
                            id="tyres"
                            name="tyres"
                            type="number"
                            min="2"
                            max="18"
                            placeholder="e.g., 4"
                            value={formData.tyres}
                            onChange={handleChange}
                            className={errors.tyres ? 'border-red-500' : ''}
                        />
                        {errors.tyres && (
                            <p className="text-sm text-red-500">{errors.tyres}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                            id="registrationNumber"
                            name="registrationNumber"
                            type="text"
                            placeholder="e.g., FL-2024-001 (Optional)"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                        />
                        <p className="text-sm text-muted-foreground">
                            Leave empty to auto-generate
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Vehicle...
                            </>
                        ) : (
                            'Create Vehicle'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default AddVehicleForm