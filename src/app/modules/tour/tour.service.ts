import { excludeField } from "../../constants.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { tourSearchableFields } from "./tour.constant.js";
import type { ITour, ITourType } from "./tour.interface.js";
import { Tour, TourType } from "./tour.model.js";

const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    const tour = await Tour.create(payload)

    return tour;
};

// const getAllTours = async (query: Record<string, string>) => {

//     const queryBuilder = new QueryBuilder(Tour.find(), query)

//     const tours = queryBuilder
//         .search(tourSearchableFields)
//         .filter()
//         .sort()
//         .fields()
//         .paginate()

//     const [data, meta] = await Promise.all([
//         tours.build(),
//         queryBuilder.getMeta()
//     ])


//     return {
//         data,
//         meta
//     }
// };

const getAllTours = async (query: Record<string, string>) => {

    console.log(query)
    const filter = query;
    const searchTerm = query.searchTerm || "";
    const sort = query.sort || "-createdAt";

    // filed filtering
    const fields = query.fields?.split(",").join(" ") || "";

    for (const field of excludeField) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete filter[field]
    }

    const searchQuery = {
        $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
    }
    const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields)

    const totalTours = await Tour.countDocuments();

    return {
        data: tours,
        meta: {
            total: totalTours
        }
    }
};


const updateTour = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    return updatedTour;
};

const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create({ name: payload.name });
};

const getAllTourTypes = async () => {
    return await TourType.find();
};


const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};


const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourType.findByIdAndDelete(id);
};


export const TourService = {
    createTour,
    createTourType,
    deleteTourType,
    updateTourType,
    getAllTourTypes,
    getAllTours,
    updateTour,
    deleteTour,
};