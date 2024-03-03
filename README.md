# SNAGGING APP - The Final Project CS50W
#### Video Demo:  https://youtu.be/DZC8-fWX8Z0

## Introduction

This represents the CS50W final project. In this project, the specification was to build a web application. The nature of the application was up to me, subject to a few requirements:

>The web application must be sufficiently distinct from the other projects in this course.
>
>The web application must utilize Django (including at least one model) on the back-end and JavaScript on the front-end.
>
>The web application must be mobile-responsive.

I decided to build a Snagging Application. I was entirely responsible for the development of this project, including its architecture, look, structure, programming, etc. 

The Snagging App web application is a tool designed to streamline the process of identifying, documenting, and managing issues or "snags" within a construction or project environment. The term "snagging" refers to the identification of defects, deficiencies, or problems that need to be addressed before a project can be considered complete or handed over.

Key features of a snagging web application may include all of the following, however for the purpose of this project I only focused on the highlighted ones, leaving the rest of the features to be implemented in future updates:

>***Issue Identification**: Users can easily pinpoint and mark areas or items where issues are detected. This could include structural problems, cosmetic defects, safety concerns, or any other elements not meeting the required standards.*

>***Multimedia Documentation**: The ability to capture and attach photos, videos, or audio recordings to each identified snag helps in providing comprehensive documentation. This assists in better communication and understanding of the issues.*

>Categorization and Prioritization: Users can categorize snags based on their nature, severity, or priority. This helps in organizing and addressing the most critical issues first.

>***Collaboration and Communication**: A snagging web application facilitates collaboration among project stakeholders. Team members can communicate about specific issues, provide updates on resolution progress, and share insights in real-time.*

>***Real-time Updates**: The application should offer real-time updates on the status of identified issues, allowing all relevant parties to stay informed about the progress of snag resolution.*

>Reporting and Analytics: The application may include reporting features to generate summaries and analytics on snagging trends, resolution times, and overall project quality. These reports can be valuable for project managers and stakeholders.

>***User Access Control**: Different project members may have varying levels of access based on their roles. For instance, contractors, architects, and project managers may have different permissions and views within the application.*

>Integration with Other Tools: Integration capabilities with other project management tools or systems can enhance overall efficiency by eliminating duplicate data entry and ensuring consistency across platforms.

By providing a centralized and digital platform for snag identification and resolution, snagging web applications contribute to smoother project completion and improved quality control in construction and other industries.

## How to Use the App

The Snagging App requires a super-user to set-up the project structure and upload the pdf-plans of the building in the database; The super-user is also required to assign roles to the various parties involved in the project (i.e. define which user is a project master or a project responsible). Within the construction indurstry, the super-user role will typically be played by the project manager or the construction manager; Even though the user can register onto the application, they will not have a role assigned to them initially and will therefore not be able to use the app; As noted above, the roles will have to be assigned by the super-user. 

Once the roles have been assigned by the super-user, the individual users can utilise the platform in order to manage the snagging process as follows: 
> - the project master can navigate to a particular project and then to a particular level/area within the project and add snags; The snags will require a particular position on plan (which should correspond to the position of the issue within the real building), a photo of the issue, a description, a responsible user and a due date; Once all the fields have been completed the snag can be submitted and will appear onto the plan as "not resolved";
> - the project responsible (i.e. the representative of the contractor which must make good the works) will then be able to view the snags onto the plan and will be able to view all the details; The responsible will have to make good the works in the real-life and then provide photographic evidence of the resolved snag onto the current web app; The responsible can then set the snag status as ready for inspection;
> - the project master will be able to see all the snags that are ready for inspection onto the plan; If the master is satisfied that the snag has been resolved he can then set the snag status as resolved;
> - the process will repeat until all the snags have been resolved and the handover has been signed off (this does not form part of the current web app, however it can be implemented in future revisions).

## Getting Started

- Make sure you have Python 3 installed on your computer.
- Clone this repository to your local machine.
- Install the Python packages as indicated in the requriements section below.
- Run the app in your terminal by executing the following Python script: python manage.py runserver
- Create a super-user and use the Django admin panel in order to set-up the project structure as described above.

## The Code

What the individual files do (please note that this project was created using Django, therefore the folder structure is the standard Django folder structure and only the files for which is considered that additional explanation is required or the files created additionally to the standard ones will be described below):
- index.js within the static folder - this file contains JavaScript code required by the index.html page;
- level.js within the static folder  - this file contains JavaScript code required by the level.html page; Note that Bootstrap script is also utilised and it is referenced within the code;
- project.js within the static folder - this file contains JavaScript code required by the project.html page;
- styles.css within the static folder - this file contains CSS code required by the the project; Note that Bootstrap CSS is also utilised and it is referenced within the code;
- index.html within the templates/SnaggingApp folder - this file contains all the html code for the index page;
- layout.html within the templates/SnaggingApp - this file contains all the html code for the layout page - this is used by all the pages within the project;
- level.html within the templates/SnaggingApp - this file contains all the html code for the level page;
- login.html within the templates/SnaggingApp - this file contains all the html code for the login page;
- project.html within the templates/SnaggingApp - this file contains all the html code for the project page;
- register.html within the templates/SnaggingApp - this file contains all the html code for the register page;
- models.py - contains all the models for the project;
- urls.py - contains all the url references used by the project;
- views.py - contains all the project views;
- README.md - this is the readme file, containing the information related to the program.

## Requirements

The following prerequsites are required to run the program:
- NONE.

Notes:
- The project uses Mozilla pdf.js library - this is already referenced within the code (level.js and level.html) and no installation of additional packages is requried. 
- The project also uses Bootstrap style and script, but this is already referenced within the code and no installation of additional packages is requried. 

## Author

This project was created by Adrian Iorgulescu as part of the CS50W Capstone Project.

## Contribute

If you'd like to modify this project, feel free to do so as you see fit. I am sure that the game can have more features or have its usability improved.

## Acknowledgments

I'd like to thank the CS50 team for the great work they are doing, and in particular to Brian Yu for explaining everythicg so clearly!