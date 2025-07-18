const sampleListings = [
    {
        title: "Luxury Beachfront Villa",
        description: "Stunning beachfront villa with panoramic ocean views, private pool, and direct beach access. Perfect for family vacations or group getaways.",
        image: {
            filename: "beachfront-villa",
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2hmcm9udCUyMHZpbGxhfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 500,
        location: "Maldives",
        country: "Maldives"
    },
    {
        title: "Modern City Apartment",
        description: "Contemporary apartment in the heart of the city with stunning skyline views. Close to major attractions and public transportation.",
        image: {
            filename: "city-apartment",
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 200,
        location: "New York",
        country: "USA"
    },
    {
        title: "Mountain Cabin Retreat",
        description: "Cozy log cabin nestled in the mountains with breathtaking views. Perfect for nature lovers and outdoor enthusiasts.",
        image: {
            filename: "mountain-cabin",
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FiaW58ZW58MHx8MHx8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 150,
        location: "Swiss Alps",
        country: "Switzerland"
    },
    {
        title: "Historic Townhouse",
        description: "Beautifully restored historic townhouse with modern amenities. Located in the cultural district with easy access to museums and galleries.",
        image: {
            filename: "townhouse",
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 300,
        location: "Paris",
        country: "France"
    },
    {
        title: "Lakeside Cottage",
        description: "Charming cottage on the lake with private dock and stunning sunset views. Perfect for fishing and water activities.",
        image: {
            filename: "lakeside-cottage",
            url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 180,
        location: "Lake Como",
        country: "Italy"
    },
    {
        title: "Desert Oasis Villa",
        description: "Luxurious villa in the desert with private pool and stunning mountain views. Experience the magic of the desert landscape.",
        image: {
            filename: "desert-villa",
            url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 400,
        location: "Dubai",
        country: "UAE"
    },
    {
        title: "Treehouse Escape",
        description: "Unique treehouse experience in the heart of the rainforest. Wake up to the sounds of nature and stunning forest views.",
        image: {
            filename: "treehouse",
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 120,
        location: "Costa Rica",
        country: "Costa Rica"
    },
    {
        title: "Ski Chalet",
        description: "Traditional alpine chalet with direct access to ski slopes. Perfect for winter sports enthusiasts and family vacations.",
        image: {
            filename: "ski-chalet",
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FiaW58ZW58MHx8MHx8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 350,
        location: "Whistler",
        country: "Canada"
    },
    {
        title: "Beach Bungalow",
        description: "Traditional beach bungalow with direct access to white sand beaches. Experience the authentic island lifestyle.",
        image: {
            filename: "beach-bungalow",
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2hmcm9udCUyMHZpbGxhfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 100,
        location: "Bali",
        country: "Indonesia"
    },
    {
        title: "Luxury Penthouse",
        description: "Ultra-modern penthouse with panoramic city views and high-end amenities. Perfect for business travelers and luxury seekers.",
        image: {
            filename: "penthouse",
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        },
        price: 600,
        location: "Singapore",
        country: "Singapore"
    }
];

module.exports = { data: sampleListings };