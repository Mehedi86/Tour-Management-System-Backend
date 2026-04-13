import type { Types } from "mongoose";

export interface ITourType {
    name: string
}

export interface ITour {
    title: string;
    slug: string;
    description?: string;
    images: string[];
    location?: string;
    costForm?:number;
    startDate?: Date;
    endDate?: Date;
    inclueded?: string[];
    excluded?: string[];
    amenities?: string[];
    tourPlan?: string[];
    maxGuest?: number;
    minAge?: number;
    division: Types.ObjectId;
    tourType: Types.ObjectId;
}