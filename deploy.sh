#! /bin/bash

# Clean Files
echo 'Cleaning old files'
rm -rf ansible/files

# Copy Files
echo 'Copying ansible files'
mkdir -p ansible/files
cp Caddyfile ansible/files/

ansible-playbook -i ./ansible/hosts ./ansible/website.yml
