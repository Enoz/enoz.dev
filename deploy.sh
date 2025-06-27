#! /bin/bash

# Build website
echo '######################### Building enozian.com #########################'
echo 'Build '
pushd enozian.com
npm ci
npm run build
popd

# Playbook
echo '######################### Executing Playbook #########################'
ansible-playbook -i ./ansible/hosts ./ansible/website.yml
