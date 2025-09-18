import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString()
}

export function formatISODateTime(date) {
    return date.toISOString().slice(0, 16)
}

export function calculateEstimatedDuration(fromPincode, toPincode) {
    const duration = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24
    return Math.max(duration, 0.5)
}

export function isValidPincode(pincode) {
    return /^\d{6}$/.test(pincode)
}