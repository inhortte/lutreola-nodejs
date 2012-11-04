#!/bin/zsh

pushd ~/rummaging_round/node.js/lutreola-nodejs/tmp
mongodump -h localhost -d naaritsad -c collection
mongodump -h localhost -d naaritsad -c collection_photo
mongodump -h localhost -d naaritsad -c entry
mongodump -h localhost -d naaritsad -c entry_menu
mongodump -h localhost -d naaritsad -c member
mongodump -h localhost -d naaritsad -c menu
mongodump -h localhost -d naaritsad -c photo
mongodump -h localhost -d naaritsad -c photographer
mongodump -h localhost -d naaritsad -c thurk
mongodump -h localhost -d naaritsad -c user
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.collection.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.collection_photo.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.entry.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.entry_menu.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.member.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.menu.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.photo.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.photographer.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.thurk.remove()'
mongo ds039427.mongolab.com:39427/naaritsad -u lutreola -p mustelid --eval 'db.user.remove()'
mongorestore -h ds039427.mongolab.com:39427 -d naaritsad -u lutreola -p mustelid dump/naaritsad
rm -rf dump
popd

