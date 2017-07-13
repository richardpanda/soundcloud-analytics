# SoundCloud Analytics

## Summary
A web application that tracks the number of followers a SoundCloud user has per day.

## Usage
To run this app, run "docker-compose up" in the root directory. Once every service is running, navigate to "localhost" in your browser and begin tracking your favorite artists!

## Notes
There is a cron job that saves SoundCloud users' follower count every day at 23:59:30 UTC (or local time if the app is running outside a Docker container).
