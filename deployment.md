# Deploying Ratstronauts

This game is deployed at https://sixstring982.itch.io/ratstronauts. Deployment
is pretty straightforward.

## 1. Run the deployment script

After you've cloned this repo, run `./build_deploy.sh`. This will build a file
called `./ratstronauts_deploy.zip` and stick it in `dist/`.

## 2. Log in to Itch

You'll need to contact sixstring982 to do this, as they own the deployment site.

## 3. Upload the new release

* On Itch.io, go to *Dashboard* -> *Ratstronauts (edit)* -> *Uploads*.
* Upload `ratstronauts_deploy.zip`.
* Delete the old release.
* Set **This file will be played in the browser**.
* The rest of the setting shouldn't need to be changed.
* Hit **Save**.
* Make sure it worked by browsing to the game.
