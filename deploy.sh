#! /bin/bash

# Clean Files
echo '######################### Cleaning old files #########################'
rm -rf ansible/files
rm -rf enzoian.com/dist

# Build website
echo '######################### Building enozian.com #########################'
echo 'Build '
pushd enozian.com
npm ci
npm run build
popd

# Copy Files
echo '######################### Copying files to ansible folder #########################'
echo 'Copying ansible files'
mkdir -p ansible/files
cp Caddyfile ansible/files/
cp -r enozian.com/dist ansible/files/enozian.com

# Playbook
echo '######################### Executing Playbook #########################'
ansible-playbook -i ./ansible/hosts ./ansible/website.yml
