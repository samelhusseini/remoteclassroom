Generate cert: 

certbot certonly --manual -d remoteclass.school -d www.remoteclass.school

sudo su
cd /etc/letsencrypt/live/remoteclass.school

cp fullchain.pem /Users/sammysam/work/tealsclassroom/certs
cp privkey.pem /Users/sammysam/work/tealsclassroom/certs

cd /Users/sammysam/work/tealsclassroom/certs
openssl rsa -in privkey.pem -out server_rsa.key


Upload fullchain.pem
Upload server_rsa.key

