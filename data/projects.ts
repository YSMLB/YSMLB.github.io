// data/projects.ts

export const portfolioProjects = [
    {
        id: 1,
        title: "ПОЕШЬ",
        category: "Food Delivery System",
        location: "ORENBURG",
        isFlagship: true,
        features: [
            { num: "00-1", name: "BACKEND (GO)" },
            { num: "00-2", name: "REST API" },
            { num: "00-3", name: "PAYMENT GATEWAY" },
            { num: "00-4", name: "COURIER APP" },
            { num: "00-5", name: "POSTGRESQL DB" }
        ]
    },
    {
        id: 2,
        title: "System Layer 02",
        category: "Backend / Logic",
        isFlagship: false,
        features: []
    },
    {
        id: 3,
        title: "System Layer 03",
        category: "Architecture / C#",
        isFlagship: false,
        features: []
    },
];