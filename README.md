# Outlook Inline Reply

![Node.js CI](https://github.com/dyyu/outlook-inline-reply/workflows/Node.js%20CI/badge.svg)
![Docker Image CI](https://github.com/dyyu/outlook-inline-reply/workflows/Docker%20Image%20CI/badge.svg)

This is an add-in for Outlook 365 that provides a traditional style inline reply.
Currently, it supports Outlook Desktop and Outlook Web.

# Quick Start for development (Windows and MacOS)

To run this add-in on your own machine, take the following steps.

0.  Make sure you satisfy the prerequisites and clone this repository.
    -   Node.js
    
1.  Start the local server.

        npm start

2.  Sideload the add-in to your Outlook.

3.  Try inline replying.

    1.  Randomly select an email you received and click on reply.

    2.  In the compose window, click the three dots to expand the email history.
    
    3.  Find the add-in Inline Reply in the menu and click on "Reformat Email."

    4.  You should see that there is a vertical blockquote bar before the email history.

# Building and Running the Docker container image

This is useful for production and developing on Linux

1.  Build the container.

        docker build . --tag <name:tag>

2.  Start the container while binding the ports.

        docker run -p 3000:3000 -e "WEBSITE_HOSTNAME=<hostname>" <name:tag>

    where `<hostname>` is your host name (defaults to `localhost`)

    *Cloud container apps, like the Azure Web App for Containers, may automatically detect the port (`3000`) and set the `WEBSITE_HOSTNAME` environment variable so this container can be successfully started without specifying the `-p` and `-e` arguments.*
