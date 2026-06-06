# Project: La Casa De IPE - UI/UX Overhaul & Functional Logic

## Design Directive: "UI UI Pro Max"
All UI components, animations, and layouts must be executed at a "UI UI Pro Max" level. Use ultra-premium, highly polished aesthetics. Utilize smooth transitions, sleek glassmorphism, deep contrast for the heist theme, and flawless responsiveness. 

## Task 1: 3D Stacked Event Carousel & Search/Sort

### UI Redesign (Stacked Cards)
* Replace the standard horizontal event grid with a premium 3D stacked card component.
* **Visuals:** The active/front card must be fully opaque, interactive, and prominent. Background cards should be progressively scaled down, pushed back in the z-index, and slightly blurred to create depth.
* **Interaction:** Users must be able to swipe or click to slide through the deck smoothly.

### Default Hierarchy & Sorting Controls
* **Initial State:** The default render order must be strictly chronological based on the event schedule.
* **Controls:** Implement a sleek dropdown or toggle buttons adjacent to the search bar allowing users to reorder the deck by:
    * Alphabetical (A-Z or Z-A).
    * Date (Chronological or Reverse-Chronological).

### Fuzzy Search Algorithm
* Integrate a modern search bar above the carousel.
* Implement a fuzzy matching algorithm (e.g., Fuse.js) configured to a 25% threshold. If a user's input matches at least 25% of an event's title characters, that event card must immediately filter into the active view.

## Task 2: Global Sidebar Navigation & Content Structure

### Sidebar Construction
* Build a hidden, slide-out side navigation drawer triggered via a "three dots" menu icon in the top navigation bar.
* Route Links to include: `Home`, `Login`, `About Us`, `Sponsors`, `Last Year Event Page`, `Events`, and `Alumni`.

### "About Us" and "Alumni" (Placeholder Integration)
* **About Us:** Create a visually striking layout. For the placeholder text, format a professional summary stating that the event is driven by the collaborative efforts of the **Yeamizing** and **Money Mavericks** teams, focusing on innovation and strategic competition. 
* **Alumni:** Design a professional grid component. Populate it with 3-5 mock alumni profiles (e.g., placeholder avatar, name, and a short mock quote about their experience) so the layout is ready for real data insertion later.

## Task 3: Time-Gated Registration & Dashboard Reporting

### Time-Gated Access Logic
* Automate the "Register" button state on each event card based on the exact timeline provided below.
* Evaluate the user's local system time against the designated start and end times.
* **Active State:** Within the window, the "Register" button is prominently highlighted and clickable.
* **Disabled State:** Outside the window (before or after), the button must be greyed out, disabled, and display a status indicator (e.g., "Opens Soon" or "Closed").

### Schedule Data Object
Hardcode this registration timeline data for the gating logic (+06:00 Dhaka time, Year 2026):
* **Integration Bee:** Jul 6, 7:30 PM – Jul 9, 11:59 PM[cite: 1]
* **Tug of War:** Jul 7, 7:30 PM – Jul 10, 11:59 PM[cite: 1]
* **The Bizz Seminar:** Jul 12, 7:30 PM – Jul 20, 11:59 PM[cite: 1]
* **La Guerra De Argumentos:** Jul 12, 7:30 PM – Jul 15, 11:59 PM[cite: 1]
* **Pes:** Jul 15, 7:30 PM – Jul 18, 11:59 PM[cite: 1]
* **La Casa del Emprendedor (BIZZ):** Jul 16, 7:30 PM – Jul 21, 11:59 PM[cite: 1]
* **Chess:** Jul 18, 7:30 PM – Jul 22, 11:59 PM[cite: 1]
* **FIFA:** Jul 18, 7:30 PM – Jul 22, 11:59 PM[cite: 1]
* **Football:** Jul 20, 7:30 PM – Jul 23, 11:59 PM[cite: 1]
* **Uno:** Jul 20, 7:30 PM – Jul 23, 11:59 PM[cite: 1]
* **El Codigo 29:** Jul 20, 7:30 PM – Jul 23, 11:59 PM[cite: 1]
* **Football Quiz:** Aug 1, 7:30 PM – Aug 2, 11:59 PM[cite: 1]
* **Sirat & Historical quiz:** Aug 1, 7:30 PM – Aug 3, 11:59 PM[cite: 1]
* **Mortal Kombat:** Aug 2, 7:30 PM – Aug 5, 11:59 PM[cite: 1]
* **Nostalgia Viva:** Aug 2, 7:30 PM – Aug 5, 11:59 PM[cite: 1]
* **Ospe:** Aug 2, 7:30 PM – Aug 5, 11:59 PM[cite: 1]
* **Guess The Movies or song:** Aug 2, 7:30 PM – Aug 5, 11:59 PM[cite: 1]
* **Table Tennis:** Aug 3, 7:30 PM – Aug 6, 11:59 PM[cite: 1]
* **La Casa del Teclado:** Aug 7, 7:30 PM – Aug 10, 11:59 PM[cite: 1]
* **Meme Comp:** Aug 10, 7:30 PM – Aug 13, 11:59 PM[cite: 1]
* **Pillow Passing:** Aug 10, 7:30 PM – Aug 14, 11:59 PM[cite: 1]

### Admin Dashboard Reporting
* Build a state management function that fires upon every successful registration submission.
* This function must update a central count and send a compiled report of total registered individuals per event directly to the Admin Dashboard component for live monitoring.


Please execute the following tasks to refine the UI components and navigation based on my latest requirements. Maintain the "UI UI Pro Max" standard, ensuring all changes look professional and seamless.

Task 1: Update Event Carousel Background
Target Component: The 3D event card carousel section (the component displaying the "Case Competition Seminar" card).

Action: Apply the newly provided background image to the main background of this specific section.

Color Matching & Professionalism: Ensure the new background image blends seamlessly with the existing dark/red "Money Heist" aesthetic. Apply a CSS overlay (e.g., a dark gradient or a subtle dark-red tint rgba(0,0,0,0.8)) over the background image so that the text and the glowing red borders of the event cards remain highly readable and professional.

Task 2: Reposition Organizer Logos
Target Component: The section displaying the circular "ORGANIZED BY" (IPE 24) and "IN ASSOCIATION WITH" logos.

Action: Move these logos to the far left side of the container.

Layout Requirements: Keep both logos aligned in the exact same horizontal row (use justify-content: flex-start if using flexbox). Add appropriate left padding so it aligns with the main page margins. Leave the right side of this container completely empty to make room for future sponsor logos that I will add later.

Task 3: Sidebar Navigation Routing & Cleanup
Target Component: The "three dots" sidebar navigation menu.

Action 1 (Removal): Temporarily remove the "About Us" link from the sidebar array entirely.

Action 2 (Active Routing): Ensure the remaining links are fully functional and connected to their respective sections.

If a user clicks Events, it must smoothly scroll down to (or route to) the new Event Carousel section.

If a user clicks Contact Us, it must navigate them directly to the contact section/footer.

Apply smooth scrolling behavior (scroll-behavior: smooth) for all anchor links on the single page.