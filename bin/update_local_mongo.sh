pushd ~/rummaging_round/node.js/lutreola-nodejs/tmp
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c collection
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c collection_photo
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c entry
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c entry_menu
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c member
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c menu
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c photo
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c photographer
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c thurk
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c user
mongodump -h ds039427.mongolab.com:39427 -u lutreola -p mustelid -d naaritsad -c news
mongo localhost/naaritsad  --eval 'db.collection.remove()'
mongo localhost/naaritsad  --eval 'db.collection_photo.remove()'
mongo localhost/naaritsad  --eval 'db.entry.remove()'
mongo localhost/naaritsad  --eval 'db.entry_menu.remove()'
mongo localhost/naaritsad  --eval 'db.member.remove()'
mongo localhost/naaritsad  --eval 'db.menu.remove()'
mongo localhost/naaritsad  --eval 'db.photo.remove()'
mongo localhost/naaritsad  --eval 'db.photographer.remove()'
mongo localhost/naaritsad  --eval 'db.thurk.remove()'
mongo localhost/naaritsad  --eval 'db.user.remove()'
mongo localhost/naaritsad  --eval 'db.news.remove()'
mongorestore -h localhost -d naaritsad dump/naaritsad
rm -rf dump
popd
