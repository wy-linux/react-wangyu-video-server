import { Request } from 'express'

declare module 'express' {
    export interface Request {
        user?: Record<string, string> | null
        userId?: string
    }
}