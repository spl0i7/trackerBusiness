# trackerBusiness website

### How to install

1) Clone this repository and cd into directory.

```$xslt
$ git clone https://github.com/spl0i7/trackerBusiness.git
$ cd trackerBusiness
```

2) Setup database name and url in `config.js`
3) Edit recaptcha2 keys for your domain in `config.js` (https://www.google.com/recaptcha/admin)
4) Edit 
`<div class="g-recaptcha" data-sitekey="6LcPbyUUAAAAAN9EQl2ROqwK9mDyjp_9i1ORZ7Ly"></div>` to code given by recapcha in `signup.js` , one you register for recaptcha.
5) Install forever module by
`
$ sudo npm install -g forever
`
6) Install dependencies for this app by 
  `$ npm install`
7) Edit the line in `bin/www` 

`var port = normalizePort(process.env.PORT || '3000');
`

to

`
var port = normalizePort(process.env.PORT || '80');
`

this will change default port from 3000 to 80 (which is normally the case for most website).

6) Start the website by

`
$ sudo forever start bin/www
`