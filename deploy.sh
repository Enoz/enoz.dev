#! /bin/bash

# Build website
echo '######################### Building enoz.dev #########################'
echo 'Build '
pushd enoz.dev
npm ci
npm run build
popd

# Playbook
echo '######################### Executing Playbook #########################'
ansible-playbook -i ./ansible/hosts ./ansible/website.yml
