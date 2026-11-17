// Deterministic mock data. `likesMe` is server-side only and is NEVER sent to the client.
const people = [
  ["Aarav", 24, "Bengaluru", "Climbing gym regular who still can't cook dal.", ["Bouldering", "Indie music", "Coffee"]],
  ["Meera", 22, "IISc Bangalore", "PhD student. Will explain black holes over chai.", ["Astronomy", "Chai", "Books"]],
  ["Kabir", 25, "Mumbai", "Weekend sourdough baker, weekday product manager.", ["Baking", "Running", "Podcasts"]],
  ["Ananya", 23, "Delhi University", "Debate society hot takes and street food maps.", ["Debate", "Street food", "Theatre"]],
  ["Rohan", 26, "Pune", "Guitarist in a band that only plays one gig a year.", ["Guitar", "Cycling", "Films"]],
  ["Isha", 21, "Christ University", "Sketchbook in bag, always.", ["Drawing", "Thrifting", "Anime"]],
  ["Vihaan", 27, "Hyderabad", "Biryani critic. Strong opinions, weakly held.", ["Food", "Cricket", "Travel"]],
  ["Diya", 24, "Chennai", "Bharatanatyam by morning, spreadsheets by day.", ["Dance", "Data", "Filter coffee"]],
  ["Arjun", 25, "Bengaluru", "Trying to read more than I scroll.", ["Reading", "Chess", "Hiking"]],
  ["Saanvi", 22, "NIT Trichy", "Hackathon addict and amateur photographer.", ["Photography", "Coding", "Trekking"]],
  ["Reyansh", 28, "Gurugram", "Marathon training, mediocre jokes.", ["Running", "Stand-up", "Startups"]],
  ["Tara", 23, "Kolkata", "Adda enthusiast. Rain makes me poetic.", ["Poetry", "Rain walks", "Cinema"]],
  ["Advait", 24, "IIT Bombay", "Mechanical engineer who builds keyboards.", ["Keyboards", "F1", "Lo-fi"]],
  ["Navya", 21, "Manipal", "Beach days, bad puns, good playlists.", ["Surfing", "Playlists", "Puns"]],
  ["Krish", 26, "Jaipur", "Heritage walk guide on weekends.", ["History", "Photography", "Chai"]],
  ["Myra", 25, "Bengaluru", "Plant parent of 19. Send help (and pots).", ["Plants", "Yoga", "Brunch"]],
  ["Ishaan", 23, "Ahmedabad", "Design student. Fonts are my love language.", ["Typography", "Garba", "Sketching"]],
  ["Kiara", 22, "St. Stephen's", "Quiz nights and questionable karaoke.", ["Quizzing", "Karaoke", "Poetry"]],
  ["Dhruv", 27, "Chandigarh", "Motorcycle trips to the Himalayas, twice a year.", ["Biking", "Camping", "Dhaba food"]],
  ["Anika", 24, "Kochi", "Marine biology nerd. Ask me about octopuses.", ["Diving", "Biology", "Seafood"]],
  ["Veer", 25, "Indore", "Poha evangelist. Board game host.", ["Board games", "Food", "Cricket"]],
  ["Riya", 23, "Bengaluru", "UX researcher who judges your app's onboarding.", ["UX", "Pottery", "Cafés"]],
  ["Samar", 26, "Lucknow", "Ghazals, kebabs, and long walks.", ["Ghazals", "Food", "Walking"]],
  ["Zoya", 22, "Jamia Millia", "Film school. I will make you watch my short.", ["Filmmaking", "Cafés", "Books"]],
  ["Neil", 24, "Goa", "Sunset chaser and part-time bartender.", ["Cocktails", "Sunsets", "Surfing"]],
  ["Pari", 21, "Symbiosis Pune", "Stationery hoarder, planner girlie.", ["Journaling", "Stationery", "K-dramas"]],
  ["Aditya", 28, "Bengaluru", "Backend dev. My side project has 3 users.", ["Coding", "Badminton", "Ramen"]],
  ["Mahi", 23, "Nagpur", "Dog person. Will show you 400 photos.", ["Dogs", "Baking", "Travel"]],
  ["Yash", 25, "Bhopal", "Tabla player who loves lo-fi remixes.", ["Tabla", "Lo-fi", "Chess"]],
  ["Sia", 24, "Mysuru", "Palace city girl, filter kaapi purist.", ["Heritage", "Kaapi", "Yoga"]],
  ["Om", 22, "BITS Pilani", "Startup club, 2am maggi runs.", ["Startups", "Maggi", "Football"]],
  ["Lavanya", 26, "Coimbatore", "Weekend potter, weekday data scientist.", ["Pottery", "ML", "Gardening"]],
];

// ids 1,3,5,... style spread: 11 profiles have already liked the logged-in user.
const LIKES_ME = new Set([1, 2, 4, 7, 9, 12, 15, 18, 21, 24, 27]);

function buildSeed() {
  const profiles = people.map(([name, age, place, bio, interests], i) => {
    const id = i + 1;
    return { id, name, age, place, bio, interests, photo: `/photos/${id}.svg`, likesMe: LIKES_ME.has(id) };
  });
  return { profiles, swipes: {}, matches: [] };
}
module.exports = { buildSeed };
