# Project: "Treasure Hunt Temporary" - Registration & Interactive Game Loop

## Design Directive: "UI UI Pro Max"
The "Treasure Hunt Temporary" interface must embody a highly immersive, premium "Money Heist" theme. The chatbox/terminal should feature dark backgrounds, glowing red accents, hacker-style typing animations, and sleek glassmorphism. It must feel like an underground communication terminal.

## Task 4: Team Registration Logic
* **Event Access:** Open registration immediately for the "Treasure Hunt Temporary" event.
* **Form Structure:** Create a dynamic registration form for teams. 
    * Inputs required: `Team Name`, `Team Leader UID (Roll Number)`, and `Teammate UIDs`.
    * Validation: A team must have a minimum of 2 members and a maximum of 5 members (Leader + 1 to 4 teammates).
* **State Update:** Save the registered team data to the global state/mock admin dashboard upon submission.

## Task 5: The Heist Terminal (Game Chatbox) & Access Control
* **Access Gate:** When a user opens the chatbox for this event, verify their identity.
    * **Primary Access:** If the logged-in user is the Team Leader, grant immediate access.
    * **Secondary Access:** If a teammate tries to log in, prompt them with an access challenge. They must input the `Team Leader's UID` and the override passcode strictly set to: `shera_mahid_vai`.
    * **Concurrency Check:** Implement a mock state variable to ensure only *one* device/user per team can actively use the terminal at the same time.
* **Onboarding Flow:** Once inside, the terminal must prompt the user to:
    1. Confirm their `Team Name`.
    2. Select their "City" (e.g., Tokyo, Berlin, Rio, Denver).
* **City Shuffling:** Based on the selected City, shuffle the order in which the 5 image clues are presented so different cities get different paths.

## Task 6: QR Scanner & Clue Mechanics
* **Built-in Scanner:** Integrate a web-based QR code scanner directly into the chatbox interface (using a library like `react-qr-reader` or `html5-qrcode`).
* **The Intel Data:** Hardcode the following Clue Images and their exact matching QR string codes. *(Note: Clue 1 and Clue 2 share the same code intentionally)*:
    * `tr1.png` -> Code: `RLBT76S`
    * `tr2.png` -> Code: `RLBT76S`
    * `tr3.png` -> Code: `ATLCOOM`
    * `tr4.png` -> Code: `QDZY25L`
    * `tr5.png` -> Code: `VALD02N`
* **Game Loop:** 
    1. Display the first image. 
    2. User scans a QR code. 
    3. If the scanned string matches the target code for the current image, display a success message and present the next image in their shuffled sequence.

## Task 7: Penalty System & Override Codes
* **Strike System:** Track incorrect QR scans. If a team submits 3 incorrect scans consecutively, completely lock the terminal interface displaying a red "SYSTEM BLOCKED" alert.
* **Override Mechanics:** Provide an input field in the blocked state for an override command.
    * If they enter `amichodna`: Initiate a visual countdown timer that unlocks the system and displays the current clue again after exactly 10 minutes.
    * If they enter `mahidvaishera`: Initiate a fast visual countdown that unlocks the system and displays the current clue again after exactly 5 seconds.

