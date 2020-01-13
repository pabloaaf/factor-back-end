const google = require('googleapis').google;

/*******************/
/** CONFIGURATION **/
/*******************/
const googleConfig = {
  clientId: process.env.OAUTH2_CLIENT_ID,
  clientSecret: process.env.OAUTH2_CLIENT_SECRET,
  redirect: process.env.OAUTH2_CALLBACK // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

/**
 * This scope tells google what information we want to request.
 */
const infoScope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  //'https://www.googleapis.com/oauth2/v2/userinfo'
];

/**
 * Get a url which will open the google sign-in page and request
 * access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: infoScope,
    clientId: googleConfig.clientId,
    redirect_uri: googleConfig.redirect
  });
}

/*function getGoogleApi(auth) {
  return google.oauth2('v2').userinfo.get({auth: auth});
}*/



/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
function urlGoogle() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */ 
async function getGoogleAccountFromCode(code) {
  const auth = createConnection();
  // get the auth "tokens" from the request
  const data = await auth.getToken(code);
  const tokens = data.tokens;
  console.log(data);
  // add the tokens to the google api so we have access to the account
  auth.setCredentials(tokens);
  // connect to google plus - need this to get the user's email
  //const gooauth = getGoogleApi(auth);
  const gooauth = await google.oauth2('v2').userinfo.get({auth: auth});
  //const me = await plus.people.get({ userId: 'me' });
  // get the google id and email
  //const userGoogleId = me.data.id;
  //const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
  // return so we can login or sign up the user
  console.log("antes");
  console.log(gooauth.data);
  console.log("despues");
  var user = {
    email: gooauth.data.email,
    family_name: gooauth.data.family_name,
    given_name: gooauth.data.given_name,
    hd: gooauth.data.hd,
    id: gooauth.data.id,
    link: gooauth.data.link,
    locale: gooauth.data.locale,
    name: gooauth.data.name,
    picture: gooauth.data.picture,
    verified_email: gooauth.data.verified_email,
    tokens: tokens
  };
  return user;
}

module.exports = {
    urlGoogle: urlGoogle,
    getGoogleAccountFromCode: getGoogleAccountFromCode
};