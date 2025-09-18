<p align="center">
<img src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2R0Z2Exa3E0MzVyc3V1ZXlrd2hoZzJvODJyNWcyZjFqbHdqYmdsaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UDjF1zMreMld6/giphy.gif' width='500'>
</p>

# <h1 align="center">Mosaic</h1>

<p align="center">
Group watch nights should be fun – not an hour-long debate about what to watch.
<p>
<p align="center">
Mosaic is a mobile app that takes the guesswork out of group entertainment. Instead of endlessly scrolling or settling for whatever’s “okay,” Mosaic uses AI-driven mood inputs, collaborative filtering, and short, curated video clips to help groups find the perfect thing to watch fast! Each person bookmarks what catches their eye, and over time, Mosaic uses advanced machine learning to understand your group’s evolving tastes, preferences, and viewing dynamics. It suggests titles that match the mood, not just the genre. Whether you're in the mood for something light and funny or emotionally intense, Mosaic will make deciding what to watch as enjoyable as watching itself.
</p>
<br>

## MVP :trophy:

- User account with secure authentication
- Mood-Based Input
  - Users describe or take a quick quiz about the kind of vibe they’re in the mood for.
- Taste Refinement
  - Mosaic learns user and group preferences over time through mood inputs, clip bookmarks, and feedback.
- Clip Browsing
  - Watch short, curated, spoiler-free clips and bookmark anything interesting to refine suggestions.
- Personal/Group Recommendation Engine
  - Based on combined preferences, Mosaic suggests a small set of titles tailored to the group’s current mood.
- Shared Watchlist
  - Groups can bookmark movies/shows to watch later and track what they’ve already seen or skipped.
- Movie Import from other apps (e.g., Letterboxd)
- Basic Filters
  - Filter content by genre, runtime, and available streaming platforms.

  <br> <br>

## Stretch Goals :hourglass_flowing_sand:

- Spoiler Free Clips
  - Automatically identify and extract compelling, spoiler-free scenes from full content.
- Group Analytics Dashboard
  - Visualize patterns like genre leanings, shared mood trends, and content overlap.
- Taste-Stretching Wildcards
  - Suggest high-quality picks that fall slightly outside the group's usual preferences for new discovery.
- Contextual Info Cards
  - View trailers, cast details, ratings, trivia, and related titles from within the app.
- Browser Extension
  - Save scenes, trailers, or YouTube videos to your Mosaic profile from external sites.

<br>

## Milestones :calendar:

<details>
  
**<summary>Week 1: Set Up :rocket:</summary>**

#### General:
- Discuss with the team who’s frontend/backend and the overall project/tech stack
- Set up communication, environments, and WhenToMeet(Link available in doc) 📆
- Go over GitHub basics
- Create a Figma account and start working on UI designs (For Everyone) 🎨
  - Start with Low Fidelity and then build up to High Fidelity
  - Create User Flowchart

#### Backend:
- Start looking into Firebase and frameworks
- Look into API’s and playing around with Postman
  - Identify accessible data for our use and strategize on leveraging this data to our advantage.
- Look into AI/ML


<br>
</details>
  
<details>
  
**<summary>Week 2: Further Preparations :mag:</summary>**

#### Frontend:
- Go over some UI design basics and do’s/don’ts
- Try to finish up the Figma Design by the end of this week
- Start planning UI components, including:
  - Mood quiz screen
  - Clip browsing page
  - Group/Personal suggestion view
  - Shared watchlist
  - Settings Page
- If not done already, create app logo!!

#### Backend:
- Start setting up the User Authentication and the Database. Have a working prototype by the end of the 2nd week
  - Database:
    - User preferences (e.g., preferred coding platform, hint frequency).
    - Saved challenges, solutions, and user code drafts for future reference.
- Keep doing research with the Friebase Tech Stack
- Start looking into APIs for Movies and AI/ML options for the recommendation engine

<br>
</details>

<details>
  
**<summary>Weeks 3/4: Coding :technologist:</summary>**
  
#### Frontend:
- Start working on the frontend components. Make sure to evenly split the workload
  - Login/Sign Up Page
    - Have this done by the end of the 3rd or 4th week
  - Mood quiz screen
  - Clip browsing view screen
  - Clip interaction components
  - Settings Page (optional)
   
#### Backend:
- Start working on these features. Have a plan created for these features by the end of the 3rd week, and start working on them starting on the 4th week.
- Develop Firestore write/read logic for:
  - Storing mood input under each user session
  - Bookmarking clips and syncing state
  - Group creation (add user ID to group document)
  - Watchlist updates (add/remove functionality)
  - Recommendation Engine
    - Do collaborative research and later have 1 person who is more confident in this area be in charge
- Set up Cloud Function (Node.js) for:
  - Basic suggestion algorithm using bookmarks + moods + previous watchlist
  - Fetching top TMDB titles by group tastes

<br>
</details>

<details>

**<summary>Weeks 5/6: Middle Ground :construction:</summary>**
#### General:
- Start looking into prepping for the Presentation.
- Work on the Presentation Script over the weeks.
- Each person will be assigned a section of the script that they need to - - complete by the end of Week 7.
- Start of Week 6, begin integrating backend with frontend components.

#### Frontend:
- Continue working on any remaining pages
- Complete group recommendation screen by the end of week 5:
  - Show top suggested movies/shows
  - Have filter buttons for more advanced filtering
  - Indicate which user bookmarked/interacted with which clip
- Complete shared/personal watchlist screen by week 5:
  - Allow adding suggestions to the shared watchlist
  - Be able to remove, mark as watched, or save
- Improve clip experience:
  - Dynamic loading of new clips
  - Improved transitions between clips

#### Backend:
- Finish working on the remaining backend features. Once completed, start working on these new features: 
  - Expand recommendation logic:
  - Factor in genres from bookmarks and watchlist
  - Incorporate group/personal mood
  - Start tagging clips by genre/mood in the database for quicker filtering
  - Track skipped clips to avoid repeats
- Have all data either be stored in a database or have an API connection all set up
- Keep looking into AI/ML be ready to pivot to gpt wrapper if need be.
- Curate a plan and start working on these features. Have these done by end of week 6 or week 7.

<br>
</details>

<details>

**<summary>Weeks 7/8: Finishing Touches :checkered_flag:</summary>**

#### General:
- Finish any remaining pages and implementations by the end of week 7
- Finish connecting Frontend with Backend by the 8th week
- If possible work on stretch goals
- Start looking into the Presentation material and creating a script
  
<br>
</details>

<details>

**<summary>Weeks 9/10: Preparations :sparkles:</summary>** 

#### General:
- Prep for Presentation Night! :partying_face:
- Make sure the Slides and Demo are ready and good to go
<br>
</details>

<br>

## Tech Stack & Resources :computer:

### FrontEnd
- #### React Native
  - <a href="https://reactnative.dev/docs/tutorial?language=javascript">Learn the Basics</a>
  - <a href="https://reactnative.dev/docs/environment-setup">Setting up the Environment</a>
  - <a href="https://www.youtube.com/watch?v=mrjy92pW0kM">React Native #1: Setup Visual Studio Code</a>
  - <a href="https://www.youtube.com/watch?v=6ZnfsJ6mM5c">React Native Tutorial for Beginners - Getting Started</a>

- #### Expo
  - <a href="https://docs.expo.dev/guides/using-firebase/">Integration with Firebase</a>

- #### Tailwind CSS
  - <a href="https://tailwindcss.com/docs/installation/using-vite">Setup</a>
  - <a href="https://www.youtube.com/watch?v=ft30zcMlFao">Learn Tailwind CSS - Course for Beginners</a>

### Backend
- #### <a href="https://firebase.google.com/?gad_source=1&gad_campaignid=12211052842&gbraid=0AAAAADpUDOgGz7MmCBeqn7acKTnAFYGe8&gclid=Cj0KCQjwnJfEBhCzARIsAIMtfKJVj8If514taMXYeQLjgmuvKyaf_3Xp2sH6y9DowRdNEi5sec8QhK0aAg05EALw_wcB&gclsrc=aw.ds">Firebase</a>

  - <a href="https://jscrambler.com/blog/integrating-firebase-with-react-native">Integration</a>
  - <a href="https://rnfirebase.io/auth/usage">Firebase Authentication</a>
    - <a href="https://www.youtube.com/watch?v=ONAVmsGW6-M">Super EAsy React Native Authentication with Firebase</a>
    - <a href="https://docs.expo.dev/guides/google-authentication/">Google Auth</a>
      - <a href="https://www.youtube.com/watch?v=eET0YtDBWWg">Step-by-Step Guide: Implementing Google Sign-In Using React Native with Firebase (Android)</a>
  - <a href="https://firebase.google.com/docs/firestore/quickstart">Firebase Firestore</a>
    - <a href="https://www.youtube.com/watch?v=eET0YtDBWWg">React Native Firebase Firestore | Cloud Firestore Database</a>
  - <a href="https://firebase.google.com/docs/functions">Cloud Functions</a>
    - <a href="https://firebase.google.com/docs/admin/setup">Admin SDK</a>
  - AI/ML
    - <a href="https://www.youtube.com/watch?v=GzJ9oiCnjJw">Adding on-device recommendations to your app using TensorFlow and Firebase</a>
    - <a href="https://www.freecodecamp.org/news/how-to-build-a-movie-recommendation-system-based-on-collaborative-filtering/">Collaborative Filtering</a>
    - <a href="https://www.youtube.com/watch?v=i-B_I2DGIAI">Movie Recommendation System | Python Machine Learning Project Tutorial for Beginners</a>
  - <a href="https://firebase.google.com/docs/cloud-messaging">Firebase Cloud Messaging</a> (Stretch Goal)
  - <a href="https://rnfirebase.io/messaging/usage">Cloud Messaging</a>

- #### APIs
 - <a href="https://developer.themoviedb.org/reference/intro/getting-started">TMDB</a>
   - Industry-standard API for retrieving detailed metadata on movies, shows, actors, trailers, genres, ratings, posters, and more.
 - <a href="https://www.omdbapi.com/">OMDb API</a>
   - Lightweight API offering basic movie/show information, including IMDb ratings, plot summaries, and release data.
 - <a href="https://rapidapi.com/collection/movie-apis">Rapid API</a>
   - A centralized marketplace for APIs across many domains, including entertainment, sentiment analysis, recommendation engines, subtitle generation, and more. You can find specific APIs that fill data gaps in TMDB/OMDb or add unique features.
 - <a href="https://www.kaggle.com/">Kaggle</a>
   - Offers a lot of datasets, including movies which could cover watch history, genre preferences, mood annotations, and collaborative filtering data. Ideal for training/testing early-stage ML models or prototyping recommendation logic offline.

## Alternatives 🔄

- ### AWS Tech Stack
  - #### User Auth:
    - <a href="https://aws.amazon.com/cognito/">Cognito</a>
      - <a href="https://www.youtube.com/watch?v=QEGo6ZoN-ao&t=1472s">Amazon Cognito Beginner Guide</a>
      
  - #### Database/Storage:
    - <a href="https://stackoverflow.com/questions/37880961/aws-dynamodb-over-aws-s3">AWS DynamoDB over AWS S3?</a>
    - <a href="https://aws.amazon.com/dynamodb/">DynamoDB</a>
      - <a href="https://www.youtube.com/watch?v=2k2GINpO308">AWS DynamoDB Tutorial For Beginners</a>
    - <a href="https://aws.amazon.com/s3/">S3</a>
      - <a href="https://www.youtube.com/watch?v=mDRoyPFJvlU">Amazon/AWS S3 (Simple Storage Service) Basics | S3 Tutorial, Creating a Bucket | AWS for Beginners</a>
      - <a href="https://www.youtube.com/watch?v=3Knsg3Js8jI">Next.js To AWS S3 File Uploads</a>

  - #### API:
    - <a href="https://aws.amazon.com/amplify/">Amplify</a>
      - <a href="https://www.youtube.com/watch?v=HdCmo0a3ngM">AWS Amplify (Gen 1) in Plain English | Getting Started Tutorial for Beginners</a>
    - OpenAI:
      - <a href="https://platform.openai.com/docs/api-reference/introduction">Documentation</a>
   
  - #### Servers: (Optional)
    - <a href="https://aws.amazon.com/ec2/">EC2</a>

- ### React Website (Optional)
  - <a href="https://legacy.reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial">Setup</a>
  - <a href="https://legacy.reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial">Setting up the Environment</a>
  - <a href="https://youtu.be/SqcY0GlETPk?si=7m4sb_bs-ksPQLkv">React Tutorial for Beginners</a>
  - Do’s and Don'ts - 
    - <a href="https://www.youtube.com/watch?v=b0IZo2Aho9Y">10 React Antipatterns to Avoid - Code This, Not That!</a>

- ### Node (Optional)
  - Use this in conjunction with React
  - <a href="https://nodejs.org/en/download/prebuilt-installer">Node Download</a>
  - <a href="https://www.codecademy.com/article/what-is-node">What is Node?</a>
    - This is optional but I recommend taking a look at this.

- ### HTML/CSS:
  - <a href="https://www.youtube.com/watch?v=pQN-pnXPaVg&t=3s">HTML Full Course - Build a Website Tutorial</a>
  - <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">HTML Documentation</a>
  - <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">CSS Documentation</a>

<br>

## Roadblocks and Possible Solutions :construction: :bulb:

- Either the Frontend or Backend team falling behind.
  - If this happens the best course would be to get some assistance from the other side until caught up
  - Worst case scenario we move on and focus on implementing the important features
- Running into Firebase Tech Stack Issues.
  - If for any reason we are having a hard time with utilizing Firebase in the early stages of development then we immediately switch over to another like MERN, AWS, ….
- Clip acquisition and processing limitations
  - Begin with licensed trailer content or API-based previews before exploring Spoiler free clip generation

<br>

## Competition :vs:

- TikTok/YouTube Shorts
  - Great for entertainment discovery, but lack group decision-making tools and personalization.
- Netflix
  - Offers trailers and some suggestions, but no collaborative or mood-based recommendation systems.
- JustWatch
  - Focuses on availability across streaming platforms, not preference learning or group interaction.
- Letterboxd
  - Strong in reviews and logging, but lacks real-time, group-based suggestion features.


<br>

## Other Resources ➕
- <a href="https://git-scm.com/downloads">GitHub</a> - <a href="https://docs.github.com/en/get-started/quickstart/hello-world">Docs</a> - <a href="https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners">Tutorial</a>
- - <a href="https://code.visualstudio.com/">Visual Studio Code</a>
- <a href="https://www.postman.com/downloads/">Postman</a>

<br>

## Git Commands :notebook:

| Command                       | What it does                        |
| ----------------------------- | ----------------------------------- |
| git branch                    | lists all the branches              |
| git branch "branch name"      | makes a new branch                  |
| git checkout "branch name"    | switches to speicified branch       |
| git checkout -b "branch name" | combines the previous 2 commands    |
| git add .                     | finds all changed files             |
| git commit -m "Testing123"    | commit with a message               |
| git push origin "branch"      | push to branch                      |
| git pull origin "branch"      | pull updates from a specific branch |

<br>

## Mosaic TEAM!! :partying_face: :fireworks:

- Tanaz Lodi
- Atharva Mishra
- Zahraa Al-Naami
- Sagar Lamichhane