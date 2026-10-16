# SHREI Manga and Anime

## Run locally

1. Double-click `start-backend.bat` and leave its window open.
2. Open `index.html` in a browser, or go to `http://localhost:5000`.

The manga and anime catalogue APIs run in the backend, so the page needs the
backend while it is open. The MangaDex catalogue does not require MongoDB.

## Publish a live website

This project includes `render.yaml` to publish the frontend and API together as
one Node web service:

1. Upload the project folder to a GitHub repository. Do not upload `.env` or
   `node_modules`; `.gitignore` excludes them.
2. In Render, choose **New > Blueprint**, connect that repository, and deploy
   the `shrei` service described by `render.yaml`.
3. Open the public URL Render provides. The same service serves the website and
   `/api`, so no separate frontend or API URL is needed.

The service fetches catalogue and chapter data from AniList and MangaDex.

## Reading and saved titles

The manga catalogue is refreshed from the API whenever you open the catalogue.
Reading progress, chapter history, and favourites are saved automatically in
your browser, and the Continue reading and Reading history sections let you
resume a chapter from the page you last read. Browser-saved items stay on that
browser profile and website origin; they are not synced between devices.
