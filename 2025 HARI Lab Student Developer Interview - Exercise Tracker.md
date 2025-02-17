# Problem you will solve
In this interview, we will discuss the implementation of a self-management exercise tracker that helps individuals with chronic conditions and disabilities engaged with daily exercise, monitored by health coaches.

The system consists of three main components:
- a **Mobile Health app** that allows individuals (primary users) to record the type of exercise, the duration, and location over a day. 
- a **RESTful backend** that is connected to a **database**. This backend sends, receives and stores the data for all individuals (users).
- a **Web Portal** for health coaches. This portal displays reports and analysis of the exercise records collected from the app for a group of individuals with chronic conditions and disabilities.

A diagram of the system can be seen here:
![enter image description here](https://i.ibb.co/1bQxLDZ/architecture.png)

We will explain what features you need to implement and what technology you need to use for each component in the following sections.

# System Components

## App
The app captures the occurence of daily exercises. Since there are "a group of" primary users who will use it, we need to assign an identification for each user in the database. The first feature is to generate an identification for each user and show it on the app when they log in. Secondly, for the exercise record, we want to note the type, time, duration, and location of the exercise. Users should be able to edit their input if they make a mistake. For the type and duration, you can make it as text inputs, or any advanced user-centered design you are familiar with. For the location, users can choose between "indoor" and "outdoor" options instead of giving an exact location captured by devices. Lastly, the app should be able to retrieve exercise history and provide an advanced report of the exercise records from the past seven days (please be creative to design the past seven days' report based on your experience).
 
### Features

- An identification for the app user
    - Ask the user to input the username **for the first time using the app**.
    - Send the username and device uuid to the server and save in database
    - Since the second time use of the app, the app should remember the username of the app user. Besides, the username should always be shown on top with words like "Hello, xxx"


- Report exercise with type, duration, location (exercises may be reported MORE THAN ONCE on a day)
    - An exercise type text input (or advanced user-centered design)
    - A duration text input (or advanced user-centered design)
    - A date & time input
    - date and time should be DISPLAYED as local time, but taking into account app users from different time zones
    - A location question:"Did you finish an indoor or outdoor exercise?" with answer options: "inside"/"outside" (users can only choose one)
    - Send this record to the **RESTFUL BACKEND** and save in database
    - Create an editable list of the ongoing day's records in app till next day (i.e. **in app**, at the beginning of the day the records should be empty. Reported records will retain till the end of the day (11:59 PM), and can be edited. On the second day (12:00 AM), the list should be refreshed.
    - Create a section to retrieve report history (not the ongoing day, not editable)
    - Create an advanced past seven day report (be creative)

### Technique
You should use the following hybrid mobile frameworks to finish the mobile app part:
- Angular + Ionic + Capacitor (latest stable version recommended)
- If you are an expert in another hybrid programming framework, please discuss with Leon (hah90@pitt)

**How to Demo:** You will playthe app as **one user**. A real device demo is recommended yet simulator/web browser demo is acceptable. Just use the device you have on hand and don't purchase any new device specifically for this interview.
________
## RESTful Backend (server + database)
The **RESTful Backend** will collect the exercise reports from app users and serve these data for the **app** and the **web portal**.  More details is shown below.
### Features
- Save Profile of a new user
    - user id
    - username
    - corresponding device uuid (it's OK you design as one user only use one phone)

- Save exercise reports
    - record id
    - exercise type
    - exercise duration
    - exercise location
    - exercise date & time

- Save Profile of a health coach to let them login in to the **Web Portal**
    - health coach id
    - username
    - password


### Technique 
To implement **RESTful Backend**,  you should use the following framework:
*  Spring Boot + Spring MVC + Spring data JPA

To implement **Database**, you can choose one of the following databases:
* MySQL
* PostgreSQL

If you are an expert in another framework, please discuss with Leon (hah90@pitt)


**HINTS**
- to let your mobile app to use your backend
  - if you are running the app on devices, you might need to deploy your backend to a cloud, a server or use native feature (e.g., iPhone + Safari). Here is a tutorial for you to deploy a Spring MVC backend to [heroku](https://devcenter.heroku.com/articles/deploying-spring-boot-apps-to-heroku) or [ngrock](https://ngrok.com/docs/getting-started/). Please avoid using any service with charge, we may not have budget to reimburse you for any deployment cost.
  - if you are running the app on simulators, you can use native feature (e.g., iPhone + Safari) or localhost.
  - If you could not complete all the tasks and will use the browser to demo, just run the localhost backend.
- You can use [postman](https://www.getpostman.com/)  to test your **RESTful Backend** when you haven't finish your frontend.
_____
## Web Portal
### Feature

- Login Page
    - A Login page to verify the identification of a health coach by username and password

- App User List Page (a dashboard)
    - A list of all app users currently using the app shown by a table with columns: username, alert, last time of report (the latest reported record's time), respectively
    - In the "alert" column, health coaches should be notified if an app user has not reported attacks for more than 2 days before today. An alert, such as a highlighted icon, should be shown. The app users with the alert should be displayed first. The longer an app user goes without reporting, the higher their priority. For example, if app user A has not reported for the past 3 days and app user B has not reported for the past 2 days, A should be sorted above B.
- App User Detail Page
    - Any app user in the list on dashboard can be selected to navigate to the detail page
    - A table to show all records in a time reverse manner (the latest record should be shown on the top). The columns of the table is "date & time", "exercise type", "duration", "location". If there are more than 10 records for an app user, you need to make a pagination. Advanced filters/pipe are welcome.
    - Following the design of the past seven days' report on the app side, duplicate the past seven days' report on the portal, but be more compatible with the larger browser screens. Also, be creative to design something different from the app, taking into account the different users: app - individuals with chronic conditions and disabilities vs. portal - health coaches

#### Technique
The **web portal** should be implement in Angular 2+ (latest stable version recommended). For page navigation between login page, app user list page and single app user detail page, you need to use [Angular Router](https://angular.dev/guide/routing/common-router-tasks)) to implement. 
If you are an expert in another programming framework, please discuss with Leon (hah90@pitt)

**How to Demo** 
Show the development web portal in browser on your computer. No need to deploy on a server.

**HINTS**
- Besides the core features that require your creative skills, other fancy, well-designed user interfaces are not required.

# Data size for Demo
To effectively demonstrate your system, particularly the dashboard and backend, it is necessary to create a dashboard list with a minimum of 10 app users, although only simulating one app user on the app side. Additionally, for each app user, 14 days of the exercise records should be generated. It is important to include more than 2 days of missing reports for certain app users in order to showcase the alert feature. Therefore, in the backend, a minimum of 280 records in total for 10 app users over the past 14 days should be saved.

#  Rules
- Focus on implementing the system as much as possible. If you are short on time, prioritize the app, backend, and portal in that order. It is not recommended to partially develop all components without fully implementing any of them. For example, a fully functional app will receive a better grade than having partially developed components.
- Your code will be reviewed, and you will be asked about your development process.
- It is acceptable for your code to have defects, including bugs. If you finish the project quickly, consider how you can enhance the system and implement those improvements in your code.
- If you have any questions, please send an email at hah90@pitt.edu.
- This project should be completed independently. If you copy code from others or mostly use generative content from AI (proper use of copilot is allowed), you will lose the opportunity. Additionally, if you cannot explain your code, you will fail.
