Firestore

Result: Pass & Fail


Firestore is how user data is saved & maintained in a database. It saves the user's streak, addictions, awards, and daily logs.

Check if Addiction Selection saves addictions & reason to quit by entering in user addictions and then exiting. If after re-opening, the previous saved addiction & reason replace the standard text, Firestore saves. Another place where Firestore is used is in tracking streaks. Each day, enter the daily log. If the days increment, then Firestore works. Check awards to see if those saved even after streaks are broken.

This one failed, here's what part:
While the streak does in fact correctly track, the Addiction Selection does not, always reverting to default values. Interestingly, awards are correctly stored & accessed. 