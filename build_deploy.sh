#!/bin/bash

# Builds Ratstronauts for deployment.

yarn run build-deploy
zip -r ./ratstronauts_deploy.zip ./dist
