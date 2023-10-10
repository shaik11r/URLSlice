const passport = require("passport");
const Strategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("./models/user");
const slugify = require("slugify");
function setUpGoogle({ server, ROOT_URL }) {
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: `${ROOT_URL}/oauth2callback`,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("googleprofile : ", profile);
          const existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            existingUser.googleToken = {
              access_token: accessToken,
              refresh_token: refreshToken,
              token_type: profile.token_type,
              expiry_date: profile.expiry_date,
            };
            await existingUser.save();
            return done(null, existingUser);
          } else {
            const slug = slugify(profile.displayName, { lower: true });
            const newUser = new User({
              googleId: profile.id,
              googleToken: {
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: profile.token_type,
                expiry_date: profile.expiry_date,
              },
              email:profile.emails[0].value,
              displayName: profile.displayName,
              avatarUrl: profile.photos[0].value,
              slug: slug,
              createdAt: new Date(),
            });
            await newUser.save();
            return done(null, newUser);
          }
        } catch (error) {
          console.log("error in google.js", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  server.get("/auth/google", (req, res, next) => {
    const options = {
      scope: ["profile", "email"],
      prompt: "select_account",
    };
    passport.authenticate("google", options)(req, res, next);
  });

  server.get(
    "/oauth2callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
    }),
    (req, res) => {
      if (req.user && req.user.isAdmin) {
        res.redirect("/home");
      } else if (req.user && req.session.finalUrl) {
        res.redirect(`${ROOT_URL}${(req.session, finalUrl)}`);
      } else {
        res.redirect("/home");
      }
    }
  );
  server.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      res.redirect("/login");
    });
  });
}
module.exports = setUpGoogle;
