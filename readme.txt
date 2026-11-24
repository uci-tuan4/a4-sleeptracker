--Readme document for Tu Nguyen, tuan4@uci.edu, 35299222--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
roughly 15 hours including brushing up on Angular


3. What online resources did you consult when completing this assignment? (list specific URLs)
https://www.w3schools.com/angular/default.asp


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
I did not consult other classmates for this assignment


5. Is there anything special we need to know in order to run your code?
No


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
The app is meant for the average adult who wants to track their sleep. I didn't really have a specific person in mind.


7. Did you design your app specifically for iOS or Android, or both?
I primarily focused and tested the app for iOS.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
Tap "Log overnight sleep" to jump to the form, pick bedtime and wake-up with the date and time pickers, and tap "Save overnight
sleep". After saving an Undo button appears. Including both dates handles sleep that crosses midnight, the pickers prevent typing
mistakes, and Undo fixes accidental saves.


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
Drag the 1-7 Stanford Sleepiness Scale slider, keep or change "When you felt this way" and tap "Save sleepiness". The scale
is a standard measure and the defaults make logging the current moment quick while still allowing past entries.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
Scroll down to "Overnight history" and "Sleepiness history" on the same page, which list the newest entries first. Overnight
entries show the night, how long you slept, and both times. Sleepiness entries show when you logged and the rating with its 
description.  Keeping everything on one page means no switching between logging and reviewing and recent entries are at the top.


11. Which feature choose--using a native device resource, backing up logged data, or both?
I chose to back up logged data rather than use a native device resource.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
Not applicable since I chose the local storage option.


13. If you backed up logged data, where does it back up to?
Overnight sleep and daytime sleepiness entries are saved in the browser’s local storage and restored when the app reloads. The data 
stays in that browser and does not sync across devices.

14. How does your app implement or follow principles of good mobile design?
The home page puts both logging shortcuts at the top, and each save offers an Undo action that removes the entry from history and local 
storage. Familiar date and time pickers and a 1–7 slider simplify input, while validation prevents incomplete entries and rejects wake-up 
times at or before bedtime.