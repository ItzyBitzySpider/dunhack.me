Ref: https://github.com/vercel/next.js/discussions/10935#discussioncomment-2295832

Certs, certs, certs
Needed: 
* privkey.pem
* chained.pem (this must be a CHAINED Cert. i.e to say, `cat cert.pem chain.pem > /chained.pem`)
* ssl_dhparam (`openssl dhparam -out dhparam.pem 4096`)
