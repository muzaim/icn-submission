export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "high":
            return "bg-red-500";
        case "medium":
            return "bg-yellow-500";
        case "low":
            return "bg-green-500";
        default:
            return "bg-gray-500";
    }
};

export const getStatusColor = (priority: string) => {
    switch (priority) {
        case "On progress":
            return "bg-gray-500";
        case "Done":
            return "bg-green-500";
        default:
            return "bg-gray-500";
    }
};