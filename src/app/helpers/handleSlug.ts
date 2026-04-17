export const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .split(" ")
        .join("-") + "-division";
};