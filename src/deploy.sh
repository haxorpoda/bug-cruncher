#!/usr/bin/env bash
npm run build
rsync -ru --info=progress2 --info=name0 ../package.json ../package-lock.json ../server.js rockdapus:./haxorpoda-selector
rsync -ru --info=progress2 --info=name0 ../public/ rockdapus:./haxorpoda-selector/public
rsync -ru --info=progress2 --info=name0 ../lib/ rockdapus:./haxorpoda-selector/lib
rsync -ru --info=progress2 --info=name0 ../public/ rockdapus:./haxorpoda-selector/public
# ssh -t rockdapus "sudo cp -r /home/select/haxorpoda-selector /opt; sudo chown -R node-pm1:node-pm2 /opt/haxorpoda-selector; sudo -H -u node-pm2 bash -c 'cd /opt/haxorpoda-selector; npm i; pm2 restart haxorpoda-selector'"

# rsync -ru --progress data/img/ rockdapus:./haxorpoda-selector-data/img/
# DATA_DIR='/opt/haxorpoda-selector-data/' pm2 start haxorpoda-selector --update-env
